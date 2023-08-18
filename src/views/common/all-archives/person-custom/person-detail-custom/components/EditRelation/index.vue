<template>
  <div class="relation">
    <el-tabs tab-position="left" @tab-click="tabClick" class="tabBtn">
      <!-- 真实身份 -->
      <el-tab-pane v-if="hasPermission('custom_human:human_relation_real')">
        <!-- 左边tab栏 -->
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">真实身份</span>
          </div>
          <div class="tabs-des">人物特征/车辆/手机号/银行卡/信用卡</div>
        </div>
        <div class="addDataBtn">
          <el-button @click="handleAdd" type="primary">添加数据</el-button>
        </div>
        <!-- 人物特征 -->
        <div
          class="empty_div"
          v-if="Object.keys(personInfo).length == 0 && Object.keys(relationList).length == 0"
        >
          <EmptyData />
        </div>
        <div v-else>
          <el-descriptions v-for="(item, idx) in relationMsg" :key="idx">
            <div slot="title" class="slotIcon">
              <img :src="require('@/assets/img/icon_person.png')" />
              {{ item.label }}
            </div>
            <el-descriptions-item v-for="(val, key) in item.list" :label="val" :key="val + key">{{
              personInfo[key] || '--'
            }}</el-descriptions-item>
          </el-descriptions>
          <!-- <div class="relationList" v-for="(val, key, idx) in relationList" :key="val + key">
            <div class="infoItem">
              <img :src="require('@/assets/img/' + iconsList[0][key.split('(')[0]] + '.png')" />
              {{ key }}
            </div>
            <div class="infoContent" @mouseover="handeleOverFirst(idx)">
              <div
                :class="[
                  'BaseRehab-chirldren-item',
                  { isActive: isActiveIndex == index && firstIndex == idx }
                ]"
                v-for="(value, key2, index) in val"
                :key="index + '_' + value"
                @mouseover="handeleOver(index)"
                @mouseleave="handeleLeave"
              >
                <div class="singleItem">{{ key2 }} ({{ value }}次)</div>
                <div class="btns" v-show="isActiveIndex == index && firstIndex == idx">
                  <i class="el-icon-edit" @click="handleEdit(key2)"></i>
                  <i class="el-icon-delete" @click="handleDel(key2)"></i>
                </div>
              </div>
            </div>
          </div> -->
          <div>
            <EditAccounts
              v-if="clickIndex === 0"
              :index="clickIndex"
              :list="relationList"
              ref="EditAccounts"
              @handleEdit="handleUpdate"
              @handleDel="handleDel"
              @handleAdd="handleAdd"
            ></EditAccounts>
          </div>
        </div>
      </el-tab-pane>
      <!-- 虚拟账号 -->
      <el-tab-pane v-if="hasPermission('custom_human:human_virtual_account')">
        <!-- 左边tab栏 -->
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">虚拟账号</span>
          </div>

          <div class="tabs-des">微信/QQ/MAC地址/虚拟账号</div>
        </div>
        <div class="addDataBtn">
          <el-button @click="handleAdd" type="primary">添加数据</el-button>
        </div>
        <div class="empty_div" v-if="Object.keys(accountList).length == 0">
          <EmptyData />
        </div>
        <EditAccounts
          v-if="clickIndex === 1"
          :list="accountList"
          :index="clickIndex"
          ref="EditAccounts"
          @handleEdit="handleUpdate"
          @handleDel="handleDel"
          @handleAdd="handleAdd"
        ></EditAccounts>

        <!-- <div class="relationList" v-for="(val, key) in accountList" :key="val + key">
          <div class="infoItem">
            <img :src="require('@/assets/img/' + iconsList[1][key.split('(')[0]] + '.png')" />
            {{ key }}
          </div>
          <div class="infoContent">
            <div v-for="(item, idx) in val" :key="idx">{{ idx }} ({{ item }}次)</div>
          </div>
        </div> -->
      </el-tab-pane>
      <!-- 虚拟痕迹 -->
      <!-- <el-tab-pane>
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">虚拟痕迹</span>
          </div>
          <div class="tabs-des">搜索关键字/BOSS言论</div>
        </div>

        <div class="empty_div" v-if="Object.keys(traceList).length == 0">
          <EmptyData />
        </div>
        <div v-else>
          <div class="relationList" v-for="(val, key) in traceList" :key="val + key">
            <div class="infoItem">{{ key }}</div>
            <div class="infoContent" v-for="(item, idx) in val" :key="idx">
              {{ idx }} ({{ item }}次)
            </div>
          </div>
        </div>
      </el-tab-pane> -->
      <!-- 人物图集 -->
      <el-tab-pane v-if="hasPermission('custom_human:human_pics')">
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">人物图集</span>
          </div>
          <div class="tabs-des">设备采集人脸照片</div>
        </div>

        <div class="empty_div" v-if="!isHasImg">
          <EmptyData />
        </div>

        <div class="PageHeader-search" v-else>
          <PageHeader :cusStyle="{ margin: 0 }">
            <div class="table-searchs">
              <DatePick ref="DatePick"></DatePick>

              <div>
                <el-input
                  v-model.trim="searchParams.key"
                  placeholder="请输入场所名称"
                  clearable
                  @keyup.enter.native="searchPic"
                ></el-input>
              </div>
            </div>

            <!-- 搜索按钮 -->
            <div>
              <el-button type="primary" class="btn" @click="searchPic" :loading="searchLoading">{{
                searchLoading ? '搜索中' : '搜索'
              }}</el-button>
            </div>
          </PageHeader>
        </div>

        <div v-if="Object.keys(picList).length > 0 && isHasImg">
          <div class="relationList" v-for="(val, key) in Object.keys(picList)" :key="val + key">
            <div class="relationList-time">{{ val }}</div>
            <div class="infoContent">
              <div class="img_item" v-for="(_val, _key) in picList[val]" :key="_val + _key">
                <ElImage
                  :imgSet="{
                    src: baseUrl + _key,
                    height: 189,
                    errorSrc: 'icon-morenHeader'
                  }"
                ></ElImage>
              </div>
            </div>
          </div>
        </div>
        <div class="empty_div" v-else-if="Object.keys(picList).length === 0 && isHasImg">
          <EmptyData />
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 关联账号 - 弹窗 - 增删改查  -->
    <pop :pop.sync="identityPop" @beforeClose="hideIdentityPop">
      <SingerType @valueChange="valueChange" :list.sync="identityFormList" :btns="identityTypeBtns">
      </SingerType>
    </pop>
  </div>
</template>

<script>
import DatePick from '@/views/common/data-center/components/DatePick'
import EditAccounts from '@/views/common/all-archives/person-custom/person-detail-custom/components/EditRelation/editAccounts.vue'
import EmptyData from '@/components/BasicComponents/EmptyData'
import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'
import { mapGetters } from 'vuex'
import SingerType from '@/components/BasicComponents/SingerTypeSuper'
import { updateAttr, deleteAttrs } from '@/api/allArchives'
import { queryPersonInfoType, addIdentityAttrs, queryPersonImgLists } from '@/api/allArchives'
import PageHeader from '@/components/BasicComponents/PageHeader'

const relationMsg = [
  {
    label: '人物特征',
    list: {
      height: '身高',
      cerNumber: '身份证号',
      dnaCode: 'DNA编号',
      fingerMark: '指纹编号'
    }
  }
]
export default {
  name: 'Relation',
  components: {
    DatePick,
    EmptyData,
    ElImage,
    EditAccounts,
    Pop,
    SingerType,
    PageHeader
  },

  props: {
    ID: { type: String }
  },

  data () {
    return {
      searchLoading: false,
      isHasImg: false,
      relationMsg: Object.freeze(relationMsg),
      searchParams: {},
      relationList: {},
      clickIndex: 0,
      personInfo: {},
      accountList: {},
      traceList: {},
      picList: {},
      updateIdentityId: '',
      updateIdentityMark: '',
      searchPicList: {
        a: 'ss'
      },
      identityPop: {
        show: false,
        title: '新建关联账号',
        width: '600px',
        top: '180px'
      },
      identityTypeBtns: [
        { text: '取消', btnEvent: this.hideIdentityPop, type: 'normal' },
        {
          isLoading: false,
          isLoadingText: '提交中...',
          text: '确定',
          btnEvent: this.submitIdentity,
          type: 'normal'
        }
      ],
      identityFormList: [
        {
          prop: 'typeCode',
          type: 'select',
          options: [],
          title: '类型',
          value: '',
          isDisable: false
        },
        { prop: 'typeValue', type: 'input', title: '数值', value: '' }
      ],
      certificatePop: {
        show: false,
        title: '新增证件',
        width: '400px',
        top: '180px'
      },
      certificateFormList: [
        {
          prop: 'certificateCode',
          type: 'select',
          options: [],
          title: '证件类型',
          value: ''
        },
        { prop: 'cerNumber', type: 'input', title: '证件数值', value: '' }
      ]
    }
  },

  computed: {
    baseUrl () {
      return window.location.origin + '/'
    },
    ...mapGetters('Dict', {
      usefulRelationTypeList: 'usefulRelationTypeList',
      usefulRelationTypeListMap: 'usefulRelationTypeListMap'
    })
  },

  created () {
    this.getInfoAssociate()

    // 真实身份下拉列表过滤
    const delIdentityTypeList = [
      'entity_community_car_type',
      'entity_probe_phone_type',
      'entity_credit_card_type'
    ]
    this.identityTypeList = this.usefulRelationTypeList
      .filter(item => {
        if (delIdentityTypeList.includes(item.typeCode)) {
          return item
        }
      })
      .map(item => ({
        label: item.typeName,
        value: item.typeCode,
        id: item.id
      }))

    //虚拟账号下拉列表过滤
    const delDummyTypeList = [
      'entity_community_car_type',
      'entity_probe_phone_type',
      'entity_credit_card_type',
      'entity_person_type'
    ]
    this.dummyList = this.usefulRelationTypeList
      .filter(item => {
        if (!delDummyTypeList.includes(item.typeCode)) {
          return item
        }
      })
      .map(item => ({
        label: item.typeName,
        value: item.typeCode,
        id: item.id
      }))
  },

  methods: {
    hasPermission (permission){
      return this.$store.state.Common.permissionsArray.includes(permission)
    },
    tabClick (val) {
      this.clickIndex = Number(val.index)
    },

    valueChange (item) {
      const list = ['imei', 'imsi']
      this.identityFormList = this.identityFormList.filter(_c => !list.includes(_c.prop))
      if (item === '手机') {
        this.identityFormList.push({ prop: 'imei', type: 'input', title: 'IMEI', value: '' })
        this.identityFormList.push({ prop: 'imsi', type: 'input', title: 'IMSI', value: '' })
      }
    },

    // 关闭真实身份弹窗
    hideIdentityPop () {
      this.updateIdentityId = ''
      this.updateAttrId = ''
      this.identityFormList[0].isDisable = false
      this.identityPop.show = false
    },

    // 根据虚拟账号 以及真实身份tab生成select
    changeSelectOptions () {
      // 同一个弹窗。重新赋值下拉泪飙
      if (this.clickIndex === 0) {
        this.identityFormList[0].options = this.identityTypeList
      } else {
        this.identityFormList[0].options = this.dummyList
      }
    },

    // 新增的弹框 - 真实身份以及虚拟账号  -增
    handleAdd (item) {
      const { typeCode } = item
      if (typeCode === 'entity_probe_phone_type') {
        this.valueChange('手机')
      } else {
        this.valueChange()
      }
      // 新增 默认清空数据
      this.identityFormList.forEach(element => {
        element.value = ''
      })

      this.changeSelectOptions()

      // 下拉列表初始赋值
      this.identityFormList[0].value = typeCode
        ? typeCode
        : this.identityFormList[0].options[0].value

      // 打开弹窗
      this.identityPop.title = '新增关联账号'
      this.identityPop.show = true
    },

    // 删除的弹框 - 真实身份以及虚拟账号  -删
    handleDel (item) {
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteAttrs({ nodeId: item.id, attrTypeCode: item.typeCode }).then(() => {
            this.$messageTip.success('删除成功！')
            this.getInfoAssociate()
          })
        })
        .catch(() => {})
    },

    // 修改的弹框 - 真实身份以及虚拟账号  -改
    handleUpdate (item) {
      const { attrId, id, canvas, typeCode, index } = item
      if (typeCode === 'entity_probe_phone_type') {
        this.valueChange('手机')
      } else {
        this.valueChange()
      }

      this.updateAttrId = attrId
      this.updateIdentityId = id
      this.updateIdentityMark = canvas

      this.identityFormList[0].isDisable = true
      this.identityFormList.forEach(element => {
        if (item[element.prop]) {
          element.value = item[element.prop]
        }
      })
      this.identityFormList[0].value = typeCode
      this.identityFormList[1].value = index

      this.changeSelectOptions()
      this.identityPop.title = '编辑关联账号'
      this.identityPop.show = true
    },

    // 增删改调用接口
    submitIdentity () {
      let url = addIdentityAttrs
      let params = {
        map: {}
      }

      this.identityFormList.forEach(element => {
        if (element.prop === 'typeCode') {
          params.attrTypeCode = element.value
        } else if (element.prop === 'typeValue') {
          params.index = element.value
        } else {
          params.map[element.prop] = element.value
        }
      })

      if (params.attrTypeCode === 'entity_probe_phone_type') {
        params.map.phone = params.index
      }

      params.personId = this.ID

      if (this.updateIdentityId) {
        url = updateAttr
        params.nodeId = this.updateIdentityId
        params.canvas = this.updateIdentityMark
        params.attrId = this.updateAttrId
      }

      if (!params.attrTypeCode) {
        this.$messageTip.error('请选择数据类型！')
        return
      }
      if (!params.index) {
        this.$messageTip.error('请输入数据内容！')
        return
      }
      this.identityTypeBtns[1].isLoading = true
      url(params)
        .then(() => {
          this.$messageTip.success(params.nodeId ? '修改成功！' : '新建成功！')
          this.getInfoAssociate()
          this.hideIdentityPop()
          this.$parent.obtainGraphData()
        })
        .finally(() => {
          this.identityTypeBtns[1].isLoading = false
        })
    },

    // 搜索查询人物图集
    searchPic () {
      this.$nextTick(() => {
        this.searchParams.startTime = this.$refs.DatePick.startTime || ''
        this.searchParams.endTime = this.$refs.DatePick.endTime || ''

        if (!this.searchParams.startTime && this.searchParams.endTime) {
          this.$messageTip.error('请输入开始时间！')
          return false
        }
        if (this.searchParams.startTime && !this.searchParams.endTime) {
          this.$messageTip.error('请输入结束时间！')
          return false
        }

        this.searchLoading = true

        // 查找图片信息
        queryPersonImgLists(this.ID, this.searchParams)
          .then(res => {
            if (!res || JSON.stringify(res) === '{}') {
              this.picList = {}
              return
            }

            this.picList = { ...res }
          })
          .finally(() => {
            this.searchLoading = false
          })
      })
    },

    //获取关联信息
    getInfoAssociate () {
      queryPersonInfoType(this.ID, { mark: 'real_identity' }).then(res => {
        if (!res) return
        this.relationList = { ...res.map }
        // 这个this.relationList需要转数组,否则遍历出来会改变位置
        // this.relationList = Object.entries(tempObjList)
        this.personInfo = { ...res.personFeatureVo }
      })
      queryPersonInfoType(this.ID, { mark: 'virtual_account' }).then(res => {
        if (!res) return
        this.accountList = { ...res.map }
        // 这个this.accountList需要转数组,否则遍历出来会改变位置
        // this.accountList = Object.entries(tempObjList)
      })
      // queryPersonInfoType(this.ID, { mark: 'virtual_trace' }).then(res => {
      //   if (!res) return
      //   this.traceList = { ...res.map }
      // })
      queryPersonImgLists(this.ID).then(res => {
        if (!res || JSON.stringify(res) === '{}') {
          this.isHasImg = false
          return
        }

        this.isHasImg = true
        this.picList = { ...res }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.relationList {
  margin-bottom: 34px;
}
.addDataBtn {
  text-align: right;
  margin-right: 20px;
}
.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--base-text-color-1);
  border-radius: 50%;
  .inner {
    width: 4px;
    height: 4px;
    background-color: var(--base-text-color-1);
    border-radius: 50%;
  }
}
.infoItem,
.slotIcon {
  display: flex;
  align-items: center;
  margin: 17px 0;
  color: var(--base-text-color-to-999999);
  img {
    margin-right: 10px;
    width: 24px;
    height: 24px;
  }
  margin: 0;
}
.slotIcon {
  margin: 0;
}
.tabsTitle {
  display: flex;
  align-items: center;
  height: 32px;
}
.infoContent {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--base-text-color-1);
  .img_item {
    width: 20%;
  }
}
.relationMsg /deep/.el-tabs__content {
  padding: 15px;
}

.tabBtn {
  text-align: left;
  .tabs-des {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110px;
    color: var(--base-text-color-to-999999);
    font-size: 14px;
    white-space: normal;
  }
  /deep/ .el-tabs__item {
    padding: 0 !important;
    width: 194px;
    height: 160px;
    background: url('~@/assets/img/file_detail_tab.png') no-repeat;
    background-size: 100% 100%;
  }
  /deep/ .el-tabs__item.is-active {
    color: #fff !important;
    font-weight: normal !important;
    background: url('~@/assets/img/tab_active.png') no-repeat;
    background-size: 100% 100%;
  }
}

.search {
  display: flex;
}

.el-icon-search {
  position: relative;
  top: 13px;
  right: 20px;
  cursor: pointer;
}

.picSearch {
  width: 300px;
  height: 38px;
  border: 1px solid #4c5565;
  margin-left: 15px;
}

/deep/ .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
/deep/ .el-tabs--left .el-tabs__nav.is-left {
  overflow: auto;
  height: calc(100vh - 249px);
  float: none;
}

/deep/.el-tabs__active-bar {
  background-color: transparent;
}
/deep/.el-tabs__item,
/deep/.is-left {
  margin-bottom: 16px;
}
/deep/.is-left:last-child {
  margin-bottom: 0px;
}

/deep/.el-tabs__nav-next,
/deep/.el-tabs__nav-prev {
  display: none;
}

/deep/.el-tabs__nav-wrap,
/deep/.is-scrollable,
/deep/.is-left {
  padding: 0 !important;
}
/deep/.el-tabs__content {
  position: relative;
  height: calc(100vh - 249px);
  padding: 24px 0px 0px 24px;
  box-sizing: border-box;
  overflow: auto;
  // background: rgba(248, 248, 248, 0.04);
  background: var(--bg-color-2);
}

.empty_div {
  height: calc(100vh - 350px);
}

.table-searchs {
  display: flex;
  align-items: center;
  > div {
    margin-right: 12px;
  }
}
</style>
