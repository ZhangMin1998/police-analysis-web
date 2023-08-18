<template>
  <div class="PersonnelFile">
    <!-- 标题 -->
    <header>
      <PageHeader :cusStyle="{ margin: 0 }"
        ><template v-slot:headerTop>
          <list-title class="headerTop" title="档案详情"></list-title>

          <div @click="$router.go(-1)">
            <!-- <nav-title :title="NavName"></nav-title> -->
            <BackPrevious></BackPrevious>
            </div
        ></template>
      </PageHeader>
    </header>

    <!-- tab栏 -->
    <div class="tab-wrapper">
      <div class="tabs">
        <div
          :class="[
            'tabsItem',
            {
              tabsItem_active: tabs.activeName == item.name,
              borderYellowColor: tabs.activeName == item.name
            }
          ]"
          v-for="(item, idx) in tabList"
          :key="idx"
          @click="tabsHandleClick(item)"
        >
          {{ item.label }}
          <div :class="['tabs-footer', { borderYellowColor: tabs.activeName == item.name }]"></div>
        </div>
      </div>

      <div class="tabs-container">
        <div class="tabs-container-Charts" v-if="tabs.activeName == 'Graph'">
          <!-- 关系图 -->
          <Charts ref="charts" v-if="chartsList && chartsList[0].length" :chartList="chartsList" />

          <div class="empty_div" v-else>
            <EmptyData />
          </div>
        </div>
        <div v-else>
          <component
            :ID="'' + ID"
            :is="tabs.activeName"
            :certificateList="certificateList"
            :detentionFacilityList="detentionFacilityList"
            :headerInfo="headerInfo"
            :suspects="suspects"
            @showPop="detentionIsShow"
          >
          </component>
        </div>
      </div>
    </div>

    <!-- 拘留信息详情 弹窗 -->
    <el-dialog title="拘留所信息" :visible.sync="detentionPop" width="80%">
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
import Charts from '@/views/common/all-archives/person-custom/relation-atlas/Charts'
import EmptyData from '@/components/BasicComponents/EmptyData'

import DatePick from '@/views/common/data-center/components/DatePick'
import Person from '@/views/common/all-archives/person-important/person-detail/components/Person/index'
import Relation from '@/views/common/all-archives/person-important/person-detail/components/Relation/index'
import Event from '@/views/common/all-archives/person-important/person-detail/components/Event/index'

// import { findRelation } from '@/api/allArchives'
import { weakRelation } from '@/api/allArchives'
import { getAllCertificate } from '@/api/allArchives'

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
    Relation,
    Event,
    PageHeader,
    Charts,
    EmptyData
  },
  data () {
    return {
      suspects: {},
      chartsList: [], // 关系图谱显示
      tabs: {
        list: [
          {
            label: '人物信息',
            name: 'Person'
          },
          {
            label: '关联信息',
            name: 'Relation'
          },
          {
            label: '弱关系图谱',
            name: 'Graph'
          }
          // {
          //   label: '事件纪要',
          //   name: 'Event'
          // }
        ],
        activeName: 'Person'
      },
      headerInfo: {},
      detentionFacilityList: [], // 拘留所列表
      rehabList: [], // 戒毒所列表
      certificateList: [],
      attrsList: [], //getAttrs 关联属性
      activeName: 'info',
      detentionInfo: Object.freeze(detentionInfo),
      showDetention: {},
      cardTitle: {},
      detentionPop: false,
      canvas: ''
    }
  },
  computed: {
    ID () {
      return this.$route.query.id
    },
    NavName () {
      return this.$route.query.label || ''
    },
    tabList () {
      let list = [
        {
          label: '人物信息',
          name: 'Person'
        },
        {
          label: '关联信息',
          name: 'Relation'
        },
        {
          label: '弱关系图谱',
          name: 'Graph'
        }
      ]
      if (this.$route.query.label === "重点人档案" || this.$route.query.label === "人物档案") {
        list = [
          {
            label: '人物信息',
            name: 'Person',
            key: this.$route.query.label === "重点人档案" ? 'important_human:human_info' : 'normal_human:human_info'
          },
          {
            label: '关联信息',
            name: 'Relation',
            key: this.$route.query.label === "重点人档案" ? 'important_human:human_relation' : 'normal_human:human_relation'
          },
          {
            label: '弱关系图谱',
            name: 'Graph',
            key: this.$route.query.label === "重点人档案" ? 'important_human:human_charts' : 'normal_human:human_charts'
          }
        ]
        return this.$backPermissionsArray(list)
      } else {
        return list
      }
    },
  },
  async created () {
    // 设置一进来展示的组件
    this.setComponent()

    // 获取基础数据
    await this.obtainInfo()
    // 获取关系图谱数据
    await this.obtainGraphData()
    // 获取所有证件数据
    await this.queryAllCertificate()
  },

  methods: {
    setComponent () {
      if (this.tabList.length) {
        this.tabs.activeName = this.tabList[0].name
      }
    },
    /** 关联账号 - 用户所有关联属性 */
    formatAttrs (res) {
      if (!res || JSON.stringify(res) == '{}') return

      let list = []

      Object.keys(res).forEach(key => {
        list.push({
          title: res[key]?.[0]?.typeName || key,
          list: res[key],
          totals: res[key].length || 0
        })
      })

      return list
    },

    /**  ------------------  其他证件 - 弹窗 --------------------- */
    /** 证件 - 查询数据 */
    queryAllCertificate () {
      getAllCertificate(this.ID).then(res => {
        this.certificateList = res.map(i => {
          i.label = i.certificateName
          i.value = i.cerNumber
          return i
        })
      })
    },

    goBack () {
      this.$router.go(-1)
    },

    // 获取信息
    async obtainInfo () {
      // 获取个人信息
      // const res = await queryPersonInfoDetail(this.ID)
      // this.headerInfo = { ...res.basePersonInfo }

      // // 人员类型转义
      // const personTypeListMap = this.$store.getters['Dict/personTypeListMap']
      // this.headerInfo.personType = personTypeListMap[this.headerInfo.personType]
      // this.headerInfo.nationRecon = this.headerInfo.nationReconDes
      // this.headerInfo.birthday = this.headerInfo?.birthday?.split(' ')[0] ?? '--'
      // this.headerInfo.iconUrl = window.location.origin + '/' + this.headerInfo.headPic
      // this.detentionFacilityList = res.detentionPersonInfos || []
      // // 拘留信息中缺少了nickName，需要去baseInfo中拿
      // if (this.detentionFacilityList.length) {
      //   // this.detentionFacilityList[0].nickName = this.headerInfo.nickName
      //   this.detentionFacilityList.forEach((item)=>{
      //     item.nickName = this.headerInfo.nickName ? this.headerInfo.nickName : '--'
      //   })
      // }

      // if (res.drugAddicts && res.drugAddicts.length !== 0) {
      //   this.rehabList = res.drugAddicts
      //   this.headerInfo = { ...this.headerInfo, ...res.drugAddicts[0] }
      // }
      // // 入库时间，人员编号等信息
      // if (res.suspects) {
      //   this.suspects = { ...res.suspects }
      // }

      // this.attrsList = this.formatAttrs(res.attrs)

      // // 保存画布id
      // this.canvas = res.basePersonInfo.canvas
    },
    // 获取关系图谱数据
    async obtainGraphData () {
      // 获取节点关系
      // const RelationObj = await findRelation(this.canvas)
      const RelationObj = await weakRelation({ personId: this.ID })
      if (!RelationObj) return
      this.chartsList = [RelationObj.nodes, RelationObj.ships]
    },

    //拘留所详情弹窗
    detentionIsShow (v) {
      this.cardTitle.detentionSn = v.detentionSn
      this.cardTitle.inStatTime = v.inStatTime
      this.showDetention = v
      this.detentionPop = true
    },

    tabChange (v) {
      if (v.index == 2) {
        this.clickRelate()
      }
    },
    tabsHandleClick (tab) {
      this.tabs.activeName = tab.name
    }
  }
}
</script>

<style lang="less" scoped>
.PersonnelFile {
  height: calc(100vh - 104px);
  .tab-wrapper {
    // height: calc(100vh - 104px);
    .tabs-container {
      height: calc(100vh - 233px);
      overflow-y: scroll;
    }
  }
}
.tabsItem::before {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 6px;
  height: 6px;
  border-left: 2px solid rgba(192, 208, 231, 0.7);
  border-top: 2px solid rgba(192, 208, 231, 0.7);
  content: '';
}

.borderYellowColor::before,
.borderYellowColor::after {
  border-color: #d4b021 !important;
}

.tabsItem::after {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 6px;
  height: 6px;
  border-right: 2px solid rgba(192, 208, 231, 0.7);
  border-top: 2px solid rgba(192, 208, 231, 0.7);
  content: '';
}
.tabsItem .tabs-footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
.tabsItem .tabs-footer::before {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 6px;
  height: 6px;
  border-right: 2px solid rgba(192, 208, 231, 0.7);
  border-bottom: 2px solid rgba(192, 208, 231, 0.7);
  content: '';
}
.tabsItem .tabs-footer::after {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 6px;
  height: 6px;
  border-left: 2px solid rgba(192, 208, 231, 0.7);
  border-bottom: 2px solid rgba(192, 208, 231, 0.7);
  content: '';
}

// /deep/.el-dialog__body {
//   min-height: 630px !important;
// }

.tabs {
  display: flex;
  padding-top: 20px;
  margin-bottom: 16px;
  .tabsItem {
    position: relative;
    margin-right: 25px;
    padding: 8px 43px;
    box-sizing: border-box;
    color: var(--base-text-color-1);
    cursor: pointer;
    //tab选中样式
    &.tabsItem_active {
      color: #d4b021;
      font-weight: bold;
      background-image: radial-gradient(rgba(212, 176, 33, 0), rgba(212, 176, 33, 0.25));
    }
  }
}

.fileNum {
  display: inline-block;
  width: 237px;
  height: 32px;
  margin-right: 24px;
  line-height: 31px;
  font-size: 18px;
  color: var(--base-text-color-1);
}
.infoTiltle {
  position: relative;
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

.tabs-container-Charts {
  height: calc(100vh - 250px);
  background-color: rgba(192, 208, 231, 0.05);
  .empty_div {
    height: calc(100vh - 350px);
  }
}
</style>
