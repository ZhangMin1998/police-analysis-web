<template>
<div
  class='feature_set_wrap'
>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='callBack'></OperaHeader>
  <div
    class='feature_content'
    v-p-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="loadingBg"
  >
    <div class='ground_bar'>
      <div class='tab' :class='{ "active": activeGroup === "all" }'>
        <div class='tab_label' @click='changeGroup("all")'>全部</div>
      </div>
      <div class='tab' v-for='(item, index) in tabList' :key='index' :class='{ "active": activeGroup === item.id }'>
        <div class='tab_label' v-if='!item.isRename' @click='changeGroup(item.id)'>{{ item.label }}</div>
        <el-input v-else v-model.trim="item.editLabel" placeholder="请输入" @blur='submitRename(item, index)' maxlength='10'></el-input>
        <div id='operaIcon' class='opera_icon' :class='{ "disabled": !item.id }' @click.stop='operaGround(item, index)'>
          <i class='iconfont icon-xiala' v-if='!item.showOpera'></i>
          <i class='iconfont icon-tongyong-Icontubiao-Line-left' v-else></i>
        </div>
        <div v-show='item.showOpera' class='opera_btn' id='operaBtn'>
          <div class='btn' :class='{ "can_opera": item.id }' @click='groundRename(item)'>重命名</div>
          <div class='btn' :class='{ "can_opera": item.id }' @click='delGround(item, index)'>删除</div>
        </div>
      </div>
      <div class='add_ground' :class='{ "disabled": isNewAdd }' @click='addGroup'>新建分组</div>
    </div>
    <div class='feature_list'>
      <TableGrid
        v-if='!featLoad'
        ref='tableGrid'
        :key='refreshKey'
        :haveIndex='true'
        :multiple='true'
        :tableColumns="tableColumns"
        :btnRender="btnRender"
        :inputPlaceholder='"请输入"'
        :isSearchTime='false'
        :haveSearchInput='false'
        :rightBtnList='[]'
        :loadingColor='"--bg-color-3"'
        :url='"/monitor/features/list"'
        :reqMethod='"post"'
        :myPageSize='9'
        @getSpecialParams="handleBeforeLoad"
        @getDataSuccess='getDataSuccess'
        @select='choiceFeature'
        @select-all='choiceAllFeature'
      >
        <div class='search_input' slot='dateLeft'>
          <el-input
            v-model.trim="searchName"
            @keyup.enter.native="searchClick"
            :placeholder="'请输入姓名'"
          >
            <template slot="suffix">
              <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
            </template>
          </el-input>
        </div>
        <div class='edit_btn' slot='rightBtn'>
          <div class='blank_button' @click='batchDel' :class='{ "is-disabled": !choiceFRules.length }'>批量删除</div>
          <div
            class='blank_button'
            @click='batchChangeGroup'
            :class='{ "is-disabled": !choiceFRules.length || !tabList.length || (tabList.length === 1 && !tabList[0].label) }'
          >变更分组</div>
          <el-button type="primary" @click='addNewFeature'>添加</el-button>
        </div>
        <div class='feature_img' slot='featureImg' slot-scope='{ row }'>
          <el-image
            v-for='(img, index) in row.featureImg' :key='index'
            class="el-image"
            :src="origin + img"
            :preview-src-list="[ origin + img ]"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class='iconfont icon-jiazaishibai'></i>
            </div>
          </el-image>
        </div>
      </TableGrid>
    </div>
  </div>
  <div class='feature_dialog'>
<!--    添加或者修改特征规则弹窗-->
    <pop
      :pop.sync="pop"
      @beforeClose="hideDetail"
      @beforeOpen="showDetail"
      :dataCenterDetail="true"
    >
      <AddFeature
        ref='addFeature'
        @delImg='delImg'
        @hideDetail='hideDetail'
        @showFDialog='showFDialog'
        @addFeature='addFeature'
        @delFeatureItem='delFeatureItem'
        @addUploadImg='addUploadImg'
        @handleChoiceFTree='handleChoiceFTree'
        @refreshTable='refreshTable'
        :form='form'
        :featureList='featureList'
        :tabList='tabList'
        :upLoadImgList='upLoadImgList'
        :controlId='editInfo.id'
        :canFastType='canFastType'
        :featureOptions='featureOptions'
        :editId='editId'
        :oldSearchIdCard='oldSearchIdCard'
        :oldSearchList='oldSearchList'
        :canFastEnToCn='canFastEnToCn'
      ></AddFeature>
    </pop>
  </div>

<!--  根据身份证选择特征弹窗-->
  <pop
    :pop.sync="featurePop"
    @beforeClose="closeFDialog"
    @beforeOpen="showFDialog"
    :dataCenterDetail="true"
  >
    <ChoiceFeature
      @closeFDialog='closeFDialog'
      @choiceFSubmit='choiceFSubmit'
      :choiceFeatureTree='choiceFeatureTree'
      :isChoiceFeature='isChoiceFeature'
    ></ChoiceFeature>
  </pop>
<!--  变更分组弹窗-->
  <pop
    :pop.sync="changeGroupPop"
    @beforeClose="closeCGDialog"
    @beforeOpen="showCGDialog"
    :dataCenterDetail="true"
  >
    <ChangeGroup
      :tabList='tabList'
      :choiceFRules='choiceFRules'
      :configId='editInfo.id'
      @closeCGDialog='closeCGDialog'
      @refreshTable='refreshTable'
    ></ChangeGroup>
  </pop>
</div>
</template>

<script>
import OperaHeader from '@/views/common/system-setting/records-manage/opera-header/index.vue'
import TableGrid from '@/components/VisualComponents/TableGrid'
import Pop from '@/components/VisualComponents/PopDialog'
import AddFeature from '../add-feature'
import ChoiceFeature from '../choice-feature'
import ChangeGroup from '../change-group'
import {
  getFeatureGroup,
  addFeatureGroup,
  updateFeatureGroup,
  delFeatureGroup,
  batchDelFeature,
  delFeatureApi,
  getFeatureOptionsApi
} from '@/api/warnControl.js'
import { featureReg } from '../../config.js'

const TABLE_COLUMNS = [
  { label: '姓名', prop: 'name', minWidth: '5.53%' },
  { label: '身份证', prop: 'cerNumber', minWidth: '11.67%' },
  { label: '特征', prop: 'featuresString', minWidth: '36.89%' },
  { label: '人脸', prop: 'featureImg', minWidth: '11.39%', haveSlot: true },
  { label: '分组', prop: 'ruleGroupName', minWidth: '6.74%' },
  { label: '联系警员', prop: 'contactPolice', minWidth: '6.74%' },
  { label: '警员手机', prop: 'contactPolicePhone', minWidth: '8.35%' },
]

export default {
  name: 'FeatureSet',
  components: {
    OperaHeader,
    TableGrid,
    Pop,
    AddFeature,
    ChoiceFeature,
    ChangeGroup
  },
  props: {
    editInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      activeGroup: 'all', // 当前激活的分组
      breadcrumbList: [
        { tabName: '布控设置', canOpera: true }
      ],
      tableColumns: Object.freeze(TABLE_COLUMNS),
      btnRender: [
        {
          label: '编辑',
          icon: 'icon-bianji',
          btnEvent: this.editFeature,
          alt: '编辑'
        },
        {
          label: '删除',
          icon: 'icon-delete',
          btnEvent: this.delFeature,
          alt: '删除'
        }
      ],
      tabList: [
        // { label: '测试', editLabel: '测试', canEdit: true, isRename: false, showOpera: false }
      ], // 分组列表
      oldOperaEdit: '', // 记录分组操作前一个操作的分组
      pop: { show: false, title: '添加特征', width: '478px' },
      featurePop: { show: false, title: '选择特征', width: '726px' },
      changeGroupPop: { show: false, title: '变更分组', width: '416px' },
      form: {
        name: '',
        cerNumber: '',
        contactPolice: '',
        contactPolicePhone: '',
        groupId: 'all'
      }, // 新增特征规则的数据
      oldSearchIdCard: null,
      oldSearchList: [],
      featureList: [
        { type: '', value: '', needReg: false, regRule: null, isSatisfy: true }
      ], // 新增特征规则的数据
      upLoadImgList: [],
      searchName: '',
      refreshKey: new Date().getTime(),
      choiceFeatureTree: [],
      isChoiceFeature: [],
      featureOptions: [],
      canFastType: {},
      canFastEnToCn: {},
      editId: null,
      featLoad: true,
      choiceFRules: [],
      groupLoad: true,
      optionLoad: true,
      loadingText: '数据加载中',
      loadingBg: '--bg-color-3'
    }
  },
  computed: {
    isNewAdd () {
      return this.tabList.some(item => !item.id)
    },
    origin () {
      return window.location.origin + '/'
    },
    loading () {
      return this.groupLoad || this.optionLoad
    },
    treeHaveAvaUrl () {
      if (this.choiceFeatureTree.length && this.choiceFeatureTree[0].children.length) {
        let index = this.choiceFeatureTree[0].children.findIndex(item => item.type === 'entity_person')
        return index > -1 && this.choiceFeatureTree[0].children[index].children.length
      }
      return false
    }
  },
  watch: {
    'upLoadImgList.length': {
      handler (newVal) {
        this.$nextTick(() => {
          let dom = document.querySelector('.pop_dialog')
          if (!dom) return
          if (newVal === 0) {
            dom.style.width = this.$pxToRem(478)
            this.pop.width = '478px'
          } else if (newVal === 1) {
            if(document.body.scrollWidth<1300){
              dom.style.width = this.$pxToRem(580)
              this.pop.width = '580px'
            }else{
              dom.style.width = this.$pxToRem(550)
              this.pop.width = '550px'
            }
          } else if (newVal === 2 || newVal === 3) {
            if(document.body.scrollWidth<1300){
              dom.style.width = this.$pxToRem(710)
              this.pop.width = '710px'
            }else{
              dom.style.width = this.$pxToRem(680)
              this.pop.width = '680px'
            }

          }
          if (this.treeHaveAvaUrl) {
            let index = this.choiceFeatureTree[0].children.findIndex(item => item.type === 'entity_person')
            if (newVal === 3) {
              this.choiceFeatureTree[0].children[index].children.forEach(item => {
                item.disabled = true
              })
            } else {
              this.choiceFeatureTree[0].children[index].children.forEach(item => {
                item.disabled = false
              })
            }
          }
        })
      }
    }
  },
  created () {
    let info = '特征设置'
    if (this.editInfo.name) info = `${info}（${this.editInfo.name}）`
    this.breadcrumbList.push({ tabName: info })
  },
  mounted () {
    document.addEventListener('click', this.bodyClick)
    this.getGroup(this.editInfo.id)
    this.getFeatureOptions()
  },
  methods: {
    delImg (ind) {
      this.upLoadImgList.splice(ind, 1)
    },
    // 勾选单个特征规则
    choiceFeature (selection) {
      this.choiceFRules = selection.map(item => item.id)
    },
    choiceAllFeature (selection) {
      this.choiceFRules = selection.map(item => item.id)
    },
    // 查询接口前对查询条件的一个添加
    handleBeforeLoad (req, callback) {
      req.data.nameLike = this.searchName
      req.data.configId = this.editInfo.id
      req.data.groupId = this.activeGroup
      if (this.activeGroup === 'all') {
        req.data.groupId = ''
      }
      callback(req)
    },
    // 获取列表数据成功后对数据进行处理
    getDataSuccess (data, params, callback) {
      data.forEach(item => {
        if (!item.groupId) {
          item.ruleGroupName = '全部'
        } else {
          item.ruleGroupName = item.groupName
        }
        let resultFeatures = (item.featuresList || []).filter(item => item.labelNameEn !== 'cer_number')
        let list = []
        item.featureImg = []
        resultFeatures.forEach(feature => {
          if (feature.labelNameEn === 'avatar_url') {
            item.featureImg.push(feature.features)
          } else {
            if (feature.labelNameEn && this.canFastEnToCn[feature.labelNameEn]) {
              list.push(`${this.canFastEnToCn[feature.labelNameEn]}/${feature.features || ''}`)
            } else {
              list.push(`${feature.features || ''}`)
            }
          }
        })
        item.featuresString = list.join('、')
      })
      callback(data)
    },
    // 搜索框事件
    searchClick () {
      this.$nextTick(() => {
        this.$refs.tableGrid.searchClick()
      })
    },
    // 切换tab栏分组
    changeGroup (id) {
      this.activeGroup = id
      this.refreshTable()
    },
    refreshTable () {
      this.refreshKey = new Date().getTime()
    },
    // 获取分组列表
    getGroup (id) {
      let selfPromise = this.getGroupFun(id)
      selfPromise.then(result => {
        result.forEach(item => {
          this.tabList.push({
            id: item.id,
            label: item.groupName,
            editLabel: item.groupName,
            // canEdit: true,
            isRename: false,
            showOpera: false
          })
        })
        this.groupLoad = false
      }).catch(() => {
        this.groupLoad = false
      })
    },
    // 获取分组接口的Promise
    getGroupFun (id) {
      let params = new FormData()
      params.append('configId', id)
      return new Promise((resolve, reject) => {
        getFeatureGroup(params).then(res => {
          let result = res || []
          resolve(result)
        }).catch(() => {
          reject()
        })
      })
    },
    // 批量删除特征规则
    batchDel () {
      if (!this.choiceFRules.length) return
      this.$policeComfirm('确定批量删除特征吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('featuresConfigIdList', this.choiceFRules)
        params.append('configId', this.editInfo.id)
        batchDelFeature(params).then(() => {
          this.$message.success('批量删除成功！')
          this.refreshTable()
          this.choiceFRules = []
        }).catch(() => {
          this.$message.error('批量删除失败！')
        })
      })
    },
    // 变更分组
    batchChangeGroup () {
      if (!this.choiceFRules.length || !this.tabList.length || (this.tabList.length === 1 && !this.tabList[0].label)) return
      this.showCGDialog()
    },
    bodyClick (e) {
      let operaDiv = document.getElementById('operaIcon')
      if (operaDiv && operaDiv.contains(e.target)) return
      if (this.oldOperaEdit) {
        this.tabList[+this.oldOperaEdit].showOpera = false
        this.tabList[+this.oldOperaEdit].isRename = false
        this.oldOperaEdit = ''
      }
    },
    callBack () {
      this.$emit('toControlList')
    },
    // 编辑特征
    editFeature (row) {
      for (let key in this.form) {
        this.form[key] = row[key] || ''
      }
      if (!this.form.groupId) {
        this.form.groupId = 'all'
      }
      let featureList = row.featuresList || []
      let imgNum = 0
      if (featureList.length) {
        this.featureList = []
      }
      featureList.forEach(item => {
        if (item.labelNameEn === 'avatar_url') {
          if (!this.featureList.some(img => img.type === 'avatar_url')) {
            this.featureList.push({
              type: item.labelNameEn,
              value: ''
            })
          }
          this.upLoadImgList.push(item.features)
          imgNum += 1
        } else {
          this.featureList.push({
            type: item.labelNameEn,
            value: item.features,
            id: item.id,
            needReg: !!featureReg[item.labelNameEn],
            regRule: featureReg[item.labelNameEn],
            isSatisfy: item.features && featureReg[item.labelNameEn] ?
              featureReg[item.labelNameEn].test(item.features) :
              true
          })
        }
      })
      this.pop.title = '编辑特征'
      this.editId = row.id
      this.showDetail()
      this.$nextTick(() => {
        this.$refs.addFeature.uploadLimit -= imgNum
      })
    },
    // 删除特征
    delFeature (row) {
      this.$policeComfirm('确定删除该特征吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('featuresConfigId', row.id)
        params.append('configId', this.editInfo.id)
        delFeatureApi(params).then(() => {
          this.$message.success('删除成功！')
          this.refreshTable()
        }).catch(() => {
          this.$message.error('删除失败！')
        })
      })
    },
    // 点击分组下拉栏
    operaGround (item, index) {
      if (!item.id) return
      if (item.showOpera) {
        item.showOpera = false
        this.oldOperaEdit = ''
        return
      }
      if (this.oldOperaEdit) {
        this.tabList[+this.oldOperaEdit].showOpera = false
        this.tabList[+this.oldOperaEdit].isRename = false
      }
      this.oldOperaEdit = index + ''
      item.showOpera = true
    },
    // 分组重命名
    groundRename (item) {
      item.editLabel = item.label
      item.isRename = true
      item.showOpera = false
      this.oldOperaEdit = ''
    },
    // 分组新增或重命名
    submitRename (item, ind) {
      if (!item.id) {
        if (item.editLabel) { // 新增分组
          this.loadingText = '添加分组中'
          this.loadingBg = '--loading-color-1'
          this.groupLoad = true
          addFeatureGroup({
            configId: this.editInfo.id,
            groupName: item.editLabel
          }).then(() => {
            this.$message.success('添加分组成功！')
            this.addGroupSuccess()
          }).catch(() => {
            // this.$message.error('添加分组失败！')
            this.groupLoad = false
          })
        } else {
          this.tabList.pop()
        }
        return
      }
      if (item.editLabel !== item.label) { // 分组重命名
        this.loadingText = '分组重命名中'
        this.loadingBg = '--loading-color-1'
        this.groupLoad = true
        updateFeatureGroup({
          configId: this.editInfo.id,
          groupName: item.editLabel,
          id: item.id
        }).then(() => {
          this.$message.success('分组重命名成功！')
          this.updateGroupSuccess(item.id, ind)
        }).catch(() => {
          this.groupLoad = false
          this.$message.error('分组重命名失败！')
        })
      }
      item.isRename = false
    },
    // 新增分组成功之后更新显示
    addGroupSuccess () {
      let selfPromise = this.getGroupFun(this.editInfo.id)
      selfPromise.then(result => {
        this.tabList.pop()
        let newItem = result[result.length - 1]
        this.tabList.push({
          id: newItem.id,
          label: newItem.groupName,
          editLabel: newItem.groupName,
          isRename: false,
          showOpera: false
        })
        this.groupLoad = false
      }).catch(() => {
        this.groupLoad = false
      })
    },
    // 更新分组成功的方法
    updateGroupSuccess (id, ind) {
      let selfPromise = this.getGroupFun(this.editInfo.id)
      selfPromise.then(result => {
        let updateIndex = result.findIndex(item => item.id === id)
        if (updateIndex > -1) {
          this.tabList[ind].label = result[updateIndex].groupName
          this.tabList[ind].editLabel = result[updateIndex].groupName
        }
        this.groupLoad = false
      }).catch(() => {
        this.groupLoad = false
      }).finally(() => {
        this.refreshTable()
      })
    },
    // 删除分组时
    delGround (item, ind) {
      this.$policeComfirm('确定删除该分组吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('groupId', item.id)
        params.append('configId', this.editInfo.id)
        this.groupLoad = true
        delFeatureGroup(params).then(() => {
          this.$message.success('删除分组成功！')
          this.tabList.splice(ind, 1)
          this.groupLoad = false
          if (this.activeGroup === item.id) {
            this.activeGroup = 'all'
          }
          this.refreshTable()
        }).catch(() => {
          this.groupLoad = false
          this.$message.error('删除分组失败！')
        })
      })
    },
    // 点击添加分组的时候
    addGroup () {
      if (this.isNewAdd) return
      this.tabList.push({
        label: '',
        editLabel: '',
        isRename: true,
        showOpera: false
      })
    },
    // 新建或编辑特征时，添加特征项
    addFeature () {
      this.featureList.push({ type: '', value: '', needReg: false, regRule: null, isSatisfy: true })
    },
    // 新建或编辑特征时，删除特征项
    delFeatureItem (index) {
      this.featureList.splice(index, 1)
    },
    showDetail () {
      this.pop.show = true
    },
    hideDetail () {
      this.pop.show = false
      this.pop.width = '478px'
      this.form = {
        name: '',
        cerNumber: '',
        contactPolice: '',
        contactPolicePhone: '',
        groupId: 'all'
      }
      this.featureList = [
        { type: '', value: '', needReg: false, regRule: null, isSatisfy: true }
      ]
      this.upLoadImgList = []
      this.choiceFeatureTree = []
      this.isChoiceFeature = []
      this.oldSearchIdCard = null
      this.oldSearchList = null
      this.editId = null
    },
    // 添加新的特征规则
    addNewFeature () {
      this.pop.title = '添加特征'
      this.showDetail()
    },
    // 特征设置弹出的关闭
    closeFDialog () {
      this.featurePop.show = false
      this.pop.show = true
    },
    // 特征设置弹出的打开
    showFDialog () {
      this.featurePop.show = true
      this.$nextTick(() => {
        this.pop.show = false
      })
    },
    // 变更分组弹出的关闭
    closeCGDialog (isSubmit = false) {
      if (isSubmit) {
        this.choiceFRules = []
      }
      this.changeGroupPop.show = false
    },
    // 变更分组弹出的打开
    showCGDialog () {
      this.changeGroupPop.show = true
    },
    addUploadImg (imgUrl) {
      this.upLoadImgList.push(imgUrl)
    },
    handleChoiceFTree (list = []) {
      this.oldSearchList = list
      this.oldSearchIdCard = this.form.cerNumber
      this.choiceFeatureTree = list
      this.isChoiceFeature = []
    },
    choiceFSubmit (list) {
      this.isChoiceFeature = list
      let resultList = []
      let imgNum = 0
      this.isChoiceFeature.forEach(item => {
        if (this.canFastType[item.type] && this.canFastType[item.type]['type']) {
          let type = this.canFastType[item.type]['type']
          if (type === 'avatar_url' && this.upLoadImgList.length < 3) {
            if (!this.featureList.some(feature => feature.type === 'avatar_url')) {
              resultList.push({
                type: type,
                value: ''
              })
            }
            if (!this.upLoadImgList.some(img => img === item.label)) {
              this.upLoadImgList.push(item.label)
              imgNum += 1
            }
          } else {
            let filterList = this.featureList.filter(feature => feature.type === type && feature.value === item.label)
            if (!filterList.length) {
              resultList.push({
                type: type,
                value: item.label,
                needReg: !!featureReg[type],
                regRule: featureReg[type],
                isSatisfy: item.label && featureReg[type] ? featureReg[type].test(item.label) : true
              })
            }
          }
        }
      })
      if (resultList.length) {
        this.featureList = this.featureList.filter(item => item.type || item.value)
        this.featureList = [...this.featureList, ...resultList]
      }
      this.$nextTick(() => {
        this.$refs.addFeature.uploadLimit -= imgNum
      })
    },
    getFeatureOptions () {
      getFeatureOptionsApi().then(res => {
        this.featureOptions = (res || []).filter(item => item.labelNameEn !== 'cer_number')
        this.featureOptions.forEach(item => {
          if (item.entityNameEn) {
            this.canFastType[item.entityNameEn] = {
              name: item.labelName || '',
              type: item.labelNameEn || ''
            }
          }
          if (item.labelNameEn) this.canFastEnToCn[item.labelNameEn] = item.labelName || ''
        })
      }).finally(() => {
        this.featLoad = false
        this.optionLoad = false
      })
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyClick)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.feature_set_wrap {
  width: 100%;
  height: 100%;
  .feature_content {
    width: 100%;
    height: calc(100% - 52px);
    margin-top: 1px;
    background: var(--bg-color-3);
    .ground_bar {
      display: flex;
      width: 100%;
      padding: 8px 24px 0;
      .tab {
        position: relative;
        border-bottom: 1px solid rgba(81, 92, 124, .5);
        min-width: 104px;
        &.active {
          border-bottom-color: var(--active-color);
        }
        .tab_label {
          padding: 8px 36px;
          font-size: 16px;
          line-height: 21px;
          color: var(--base-text-color-to-666666);
          cursor: pointer;
          text-align: center;
        }
        /deep/.el-input {
          margin-right: 4px;
          .el-input__inner {
            border: 0;
            height: 37px;
            line-height: 37px;
            padding: 0 12px;
          }
        }
        .opera_icon {
          position: absolute;
          right: 8px;
          top: 10px;
          cursor: pointer;
          &.disabled {
            cursor: not-allowed;
          }
          i {
            font-size: 16px;
            line-height: 16px;
            color: var(--base-text-color-to-666666)
          }
        }
        .opera_btn {
          background: var(--datapicker-shijian-xiala-bg-color);
          border: 1px solid var(--border-color-1);
          position: absolute;
          right: 0;
          top: 42px;
          z-index: 10;
          .btn {
            min-width: 84px;
            padding: 9px 0;
            font-size: 14px;
            line-height: 14px;
            text-align: center;
            color: var(--record-library-tree-opera);
            cursor: not-allowed;
            &.can_opera {
              color: var(--base-text-color-2);
              cursor: pointer;
              &:hover {
                background: var(--datapicker-in-range-bg-color);
                color: var(--base-text-color-1);
              }
            }
          }
        }
      }
      .add_ground {
        font-size: 16px;
        line-height: 21px;
        color: var(--active-color);
        margin-left: 16px;
        margin-top: 8px;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
        }
      }
    }
    .feature_list {
      height: calc(100% - 46px);
      /deep/.w_table {
        .w_table_grid_header {
          background: transparent;
          padding-top: 20px;
          padding-bottom: 16px;
          margin-bottom: 0;
        }
        .table_loading {
          padding: 0 24px 16px;
          height: calc(100% - 92px);
        }
      }
      .edit_btn {
        display: flex;
        .blank_button {
          margin-right: 16px;
        }
      }
    }
  }
}
/deep/.w_table_wrap .el-table .el-table__body-wrapper .el-table__row .el-table__cell:first-child .cell {
  padding-left: 32px;
}
/deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell {
  padding: 10px 0 9px;
  height: 56px;
}
.feature_img {
  display: flex;
  /deep/.el-image {
    margin-right: 16px;
    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 36px;
      background: var(--warn-error-image-bg);
      color: var(--base-text-color-2);
      i {
        font-size: 16px;
      }
    }
    img {
      width: 30px;
      height: 36px;
    }
  }
}
</style>
