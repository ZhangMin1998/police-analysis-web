<template>
  <div class="FileDetail">
    <!-- 标题 -->
    <header>
      <!-- <PageHeader :cusStyle="{ margin: 0 }">
        <template v-slot:headerTop> -->
      <!-- <list-title class="headerTop" title="档案详情"></list-title>
          <div class="back-box" @click="$router.go(-1)">
            <img :src="require('@/assets/img/' + 'icon-reback' + '.png')"/>
            <div class="back">返回</div>
          </div> -->
      <!-- </template>
      </PageHeader> -->
      <div class="title-box">
        <div class="set">
          <img :src="require('@/assets/img/title-header.png')" alt="" />
          <div>档案详情</div>
        </div>
        <div class="back-box" @click="$router.go(-1)">
          <i class='iconfont icon-fanhui'></i>
          <span>返回</span>
        </div>
      </div>
    </header>

    <!-- tab栏 -->
    <div :class="{ 'tab-wrapper': true, 'is-person': isPerson }">
      <div class="tabs">
        <el-tabs stretch v-model="activeName" @tab-click="tabsHandleClick">
          <!-- <el-tab-pane label="人物信息" name="Person" v-if="getPermisson()"></el-tab-pane>
          <el-tab-pane label="图 谱" name="Chart" v-if="getChartPermisson()"></el-tab-pane>
          <el-tab-pane label="关联信息" name="Relation" v-if="$route.query.label!=='人物档案'"></el-tab-pane> -->
          <el-tab-pane
            v-for="item in tabsArray"
            :label="item.label"
            :name="item.name"
            :key="item.name"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div
        class="export_btn"
        v-if="activeName === 'Person' && $route.query.label === '人物档案' && isShow"
      >
        <div :class="['blank_button', 'button']" v-debounce="exportTable">{{ '导出' }}</div>
      </div>

      <div class="tabs-container">
        <div>
          <component
            :ID="'' + CerNunber"
            :is="activeName"
            :personInfo="personInfo"
            :chartsList="chartsList"
            :mindMapList="mindMapList"
            @showPop="detentionIsShow"
            @isDisable="exportDisable"
          >
          </component>
        </div>
      </div>
    </div>

    <!-- 拘留信息详情 弹窗 -->
    <el-dialog title="拘留所信息" :visible.sync="detentionPop" width="80%" class="dialog">
      <div slot="title" class="infoTiltle">
        <span class="fileNum">{{ cardTitle.detentionSn }}</span>
        <span class="placeName">拘留所</span>
        <span class="fileTime">{{ cardTitle.inStatTime }}</span>
      </div>
      <div class="detentionContent">
        <el-descriptions
          v-for="(item, idx) in detentionInfo"
          :key="idx"
          :column="4"
          style="margintop: 30px"
        >
          <template slot="title">
            {{ item.label }}
          </template>
          <el-descriptions-item v-for="(val, key) in item.list" :key="key" :label="val">
            {{ showDetention[key] || '--' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/BasicComponents/PageHeader'
import { mapState } from 'vuex'
// import Charts from '@/views/common/clueQuery/person-custom/Relation/Charts'
// import EmptyData from '@/components/BasicComponents/EmptyData'

import DatePick from '@/views/common/data-center/components/DatePick'
import Person from '@/views/common/FileDetail/Person/index'
import Chart from '@/views/common/FileDetail/Chart/index'
import Relation from '@/views/common/FileDetail/Relation/index'
// import Event from '@/views/common/FileDetail/Event/index'
// import { findRelation } from '@/api/allArchives'
import { weakRelation, getMindMap } from '@/api/allArchives'
import { getPersonFileDetail, fileDetailExport } from '@/api/allArchives'

import Pop from '@/components/BasicComponents/Dialog'

const detentionInfo = [
  {
    label: '特征标识:',
    // imgUrl: '@/assets/img/feature.png',
    list: {
      nickName: '绰号',
      politicsStatus: '政治面貌',
      jobInfo: '职业',
      posture: '体貌特征',
      identity: '身份信息',
      specIdentity: '特殊身份',
      birthPlace: '出生地址',
      nativePlace: '籍贯',
      accent: '口音特征',
      currHouseAddr: '暂住地址',
      currHouseDetailAddr: '现居地址'
    }
  },
  {
    label: '犯罪记录:',
    // imgUrl: '@/assets/img/crime.png',
    list: {
      detentionSn: '入所编号',
      breakPlace: '违法地点',
      breakTime: '违法时间',
      // inStatTime: '执行期限',
      inStatTime: '入所日期',
      outStatTime: '出所日期',
      outStatReason: '出所原因',
      outStatDir: '出所去向',
      caseUnit: '送案单位',
      clothesNumber: '囚服号',
      bedNumber: '床位号',
      caseSn: '案件号',
      caseInfo: '案件摘要',
      resume: '被拘人简历'
    }
  },
  {
    label: '其他信息:',
    // imgUrl: '@/assets/img/otherInfo.png',
    list: {
      contacter: '联系人',
      contactPhone: '联系电话',
      tmpHouseAddr: '暂住地址',
      currHouseAddr: '现居地址',
      jobUnit: '工作单位'
    }
  }
]

export default {
  components: {
    Pop,
    DatePick,
    Person,
    Chart,
    Relation,
    PageHeader,
    // Event,
    // Charts,
    // EmptyData
  },
  data () {
    return {
      isPerson: true,
      isShow: true,
      suspects: {},
      chartsList: [], // 关系图谱显示
      mindMapList: [], // 思维导图显示
      activeName: 'Person',
      personInfo: {},
      detentionFacilityList: [], // 拘留所列表
      rehabList: [], // 戒毒所列表
      certificateList: [],
      attrsList: [], //getAttrs 关联属性
      detentionInfo: Object.freeze(detentionInfo),
      showDetention: {},
      cardTitle: {},
      detentionPop: false,
      canvas: '',
    }
  },
  computed: {
    CerNunber () {
      return this.$route.query.cerNumber
    },
    NavName () {
      return this.$route.query.label || ''
    },
    ...mapState('Common', {
      permissionsArray: 'permissionsArray'
    }),
    tabsArray () {
      if (this.$route.query.label === '重点人档案') {
        const tabsArray = [
          {
            label: '人物信息',
            name: 'Person',
            key: 'important_human:human_info_profiles'
          },
          {
            label: '图 谱',
            name: 'Chart',
            key: 'important_human:human_charts'
          },
          {
            label: '关联信息',
            name: 'Relation',
            key: 'important_human:human_relation'
          }
        ]
        return this.$backPermissionsArray(tabsArray)
      } else {
        // if (this.$route.query.label === '人物档案')
        const tabsArray = [
          {
            label: '人物信息',
            name: 'Person',
            key: 'normal_human:human_info'
          },
          {
            label: '图 谱',
            name: 'Chart',
            key: 'normal_human:atlas'
          }
        ]
        return this.$backPermissionsArray(tabsArray)
      }

    }
  },
  watch: {
    // activeName: {
    //   handler (val) {
    //     console.log(val)
    //     if (val === 'Person') {
    //       this.isPerson = true
    //     } else {
    //       this.isPerson = false
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
  },
  async created () {
    if (this.tabsArray.length) {
      this.activeName = this.tabsArray[0].name
    }
    // 获取基础数据
    await this.obtainInfo()
    // 获取关系图谱数据
    await this.obtainGraphData()
    // 获取所有证件数据
    // await this.queryAllCertificate()
  },

  methods: {
    // 导出
    exportTable () {
      fileDetailExport(this.$route.query.id).then(res => {
        if (res.code === 0) {
          this.$messageTip.error(res.msg)
          return
        }
        this.funDownload(res)
      })
    },
    funDownload (content) {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement("a")
      eleLink.download = this.personInfo.name + '-' + this.personInfo.cerNumber + '-' + '全息档案.doc'; // 导出文件名
      eleLink.style.display = "none"
      // 字符内容转变成blob地址
      var blob = new Blob([content])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    },
    /** 关联账号 - 用户所有关联属性 */
    // formatAttrs(res) {
    //   if (!res || JSON.stringify(res) == '{}') return

    //   let list = []

    //   Object.keys(res).forEach(key => {
    //     list.push({
    //       title: res[key]?.[0]?.typeName || key,
    //       list: res[key],
    //       totals: res[key].length || 0
    //     })
    //   })

    //   return list
    // },

    // 查询证件数据
    // queryAllCertificate() {
    //   getAllCertificate(this.ID).then(res => {
    //     this.certificateList = res.map(i => {
    //       i.label = i.certificateName
    //       i.value = i.cerNumber
    //       return i
    //     })
    //   })
    // },

    goBack () {
      this.$router.go(-1)
    },

    // 获取信息
    async obtainInfo () {
      const res = await getPersonFileDetail(this.CerNunber)
      // const personTypeListMap = this.$store.getters['Dict/personTypeListMap']
      // res.personType = personTypeListMap[res.personType]

      res.phone = res.mobilePhoneList ? res.mobilePhoneList.toString() : null
      res.company = res.workUnitList ? res.workUnitList.toString() : null
      res.bankCard = res.bankCardList ? res.bankCardList.toString() : null
      res.banDrugsInfo = res.drugAddicts ? JSON.parse(JSON.stringify(res.drugAddicts[0])) : []
      // if (res.assetsHouseVoList) {
      //   res.assetsHouseVoList.forEach(item => {
      //     item.houseArea = item.houseArea + 'm²'
      //   })
      // }
      this.personInfo = { ...res }
    },
    // 获取关系图谱数据
    async obtainGraphData () {
      // 获取节点关系
      // const RelationObj = await findRelation(this.canvas)
      const RelationObj = await weakRelation({ cerNumber: this.CerNunber })
      if (RelationObj) {
        this.chartsList = [RelationObj.nodes, RelationObj.ships]
      }
      // if (!RelationObj) return
      // this.chartsList = [RelationObj.nodes, RelationObj.ships]

      const res = await getMindMap(this.CerNunber)
      this.mindMapList = res
    },

    //拘留所详情弹窗
    detentionIsShow (v) {
      this.cardTitle.detentionSn = v.detentionSn
      this.cardTitle.inStatTime = v.inStatTime
      this.showDetention = v
      this.detentionPop = true
    },
    // 通过不动产详情的显示来控制是否可点击导出
    exportDisable (e) {
      if (e) this.isShow = false
      else this.isShow = true
    },
    tabsHandleClick (tab) {
      this.activeName = tab.name
    }
  }
}
</script>

<style lang="less" scoped>
.FileDetail {
  overflow-y: scroll;
  height: calc(100vh - 90px);
  .title-box {
    height: 60px;
    background: var(--bg-color-1);
    flex: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 24px;
    box-sizing: border-box;
    .set {
      display: flex;
      color: var(--base-text-color-1);
      font-size: 18px;
      line-height: 24px;
      font-weight: bold;
      align-items: center;
      img {
        margin-right: 5px;
        width: 18px;
        height: 18px;
      }
    }
    .back-box {
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--primary-menu-text-color);
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: var(--base-text-color-1);
      }
    }
  }
  .tab-wrapper {
    min-height: calc(100vh - 180px);
    padding: 0 24px 15px 24px;
    margin-bottom: 12px;
    position: relative;
    background: var(--bg-color-1);
    // height: calc(100vh - 104px);
    .tabs {
      display: flex;
      margin-top: 2px;
      /deep/.el-tabs {
        // width: 208px;
        margin-top: 12px;
      }
      /deep/.el-tabs__active-bar {
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 1px !important;
        background-color: var(--active-color);
        z-index: 1;
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        list-style: none;
      }
      /deep/.el-tabs__nav {
        white-space: nowrap;
        position: relative;
        transition: transform 0.3s;
        float: left;
        z-index: 2;
        border-bottom: 1px solid var(--border-color-input);
      }
      /deep/.el-tabs__nav-wrap::after {
        height: 0px !important;
        background-color: #515C7C !important;
      }
      /deep/.el-tabs__item {
        width: 104px;
        padding: 0 !important;
        color: var(--base-text-color-to-999999) !important;
        font-size: 16px !important;
        &:hover{
          color: var(--active-color) !important;
        }
      }
      /deep/.el-tabs__item.is-active {
        color: var(--active-color) !important;
        font-size: 16px !important;
      }
      /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
        -webkit-box-shadow: none;
        box-shadow: none;
      }
    }
    .export_btn {
      position: absolute;
      top: 20px;
      right: 24px;
    }
    // .tabs-container {
    //   height: calc(100vh - 233px);
    //   overflow-y: scroll;
    // }
  }
  /deep/.el-dialog {
    background: #202a3e;
  }
  .infoTiltle {
    position: relative;
    .fileNum {
      display: inline-block;
      width: 237px;
      height: 32px;
      margin-right: 24px;
      line-height: 31px;
      font-size: 18px;
      color: var(--base-text-color-1);
    }
    .placeName {
      display: inline-block;
      width: 60px;
      height: 24px;
      line-height: 22px;
      margin-right: 32px;
      padding-left: 8px;
      font-size: 12px;
      color: #fff;
      background: linear-gradient(91deg, #177ddc 0%, rgba(23, 125, 220, 0.14) 100%);
      opacity: 1;
    }
  }
}

/deep/.el-descriptions__body {
  background: transparent;
}
/deep/.el-descriptions__title {
  color: var(--base-text-color-1);
}
/deep/ .el-descriptions-item__content {
  color: var(--base-text-color-1);
}
/deep/ .el-descriptions-item__label {
  color: var(--base-text-color-to-999999);
}
</style>
