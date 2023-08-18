<template class="not_change_rem">
  <div class='edit_container'>
    <div class='return_wrap'>
      <div class='return' @click='$emit("toEdit")'>
        <i class='iconfont icon-fanhui'></i>
        <span>返回</span>
      </div>
    </div>
    <div
      v-p-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="loadBg"
      class='edit_page_wrap'
    >
      <div class='edit_header'>
        <div class='header_left'>
          <div
            v-for='(item, index) in operaOptions'
            :key='index'
            class='opera_wrap'
          >
            <div
              v-for='opt in item'
              :key='opt.type'
              class='opera_item'
            >
              <div
                :class='{
                  "opera": true,
                  "is_mode": opt.type === lastResultMode,
                  "is_disabled": !canEdit ||
                   (currentModeOpera[lastResultMode] && !currentModeOpera[lastResultMode].includes(opt.type)) ||
                   !recordInfo.length ||
                   recordInfo.some(record => record.operatorType === "link" && record.status === "normal") ||
                   sourceError ||
                   haveErrorRecord ||
                   recordInfo.some(record => record.operatorType === "algorithm" && algorithmType.includes(record.algorithmType) && record.status === "normal")
                }'
                @click='handleOpera(opt)'
              >
                <i :class='[ "iconfont", opt.icon ]'></i>
                <div class='label'>{{ opt.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class='header_right'>
          <div
            :class='{
              "is_disabled": !canEdit || !canAddSource || sourceError,
              "record_origin":true
            }'
            @click='handleSource'
          >数据源</div>
        </div>
      </div>
      <div class='edit_content'>
        <div class='content_left'>
          <template v-if='!showNeedRun'>
            <BinaryTree
              v-if='isBinaryTree'
              :treeData='algorithmData'
              :key='binaryKey'
            ></BinaryTree>
            <EditTable
              v-else-if='currentMode === "list"'
              :fieldList='resultField'
              :listData='resultData'
              :total='resultCount'
              :linkInfo='resultLink'
              :recordList='normalRecordInfo'
              @getCanEditParam='getCanEditField'
            ></EditTable>
            <EditDetail
              v-else-if='currentMode === "detail"'
              :colFieldInfo='resultField'
              :listData='resultData'
              :linkInfo='resultLink.text'
            ></EditDetail>
            <ChartResult
              v-else-if='currentMode === "chart" && editUpdated'
              :fieldList='resultField'
              :listData='resultData'
              :chartInfo='{
                "chartType": resultDisplayInfo.displayChartType,
                "chartConfig": JSON.parse(resultDisplayInfo.displayCoordinate)
              }'
              :moduleId='editModuleInfo.id'
            ></ChartResult>
          </template>
          <NoEmpty v-else emptyTip='该步骤需运行后方可展示数据'></NoEmpty>
        </div>
        <div class='content_right'>
          <EditRecord
            :activeRecordId='resultRecordId'
            :recordInfo='recordInfo'
            @editOpera='editOpera'
            @getRecord='getRecord'
            @getResultData='getResultData'
            @needRunTip='needRunTip'
          ></EditRecord>
        </div>
      </div>
      <Pop
        :pop.sync="dialog"
        dialogClass='add_app_dialog'
        @beforeClose="closeDialog"
        @beforeOpen="openDialog"
        :dataCenterDetail="true"
      >
        <!--    数据源-->
        <EditSource
          v-if='activeOpera === "source"'
          :sourceList='sourceList'
        ></EditSource>
        <!--    汇总-->
        <EditCollect
          v-if='activeOpera === "aggregate"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditCollect>
        <EditAlgorithm
          v-if='activeOpera === "algorithm"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditAlgorithm>
        <!--    分组-->
        <EditGroup
          v-if='activeOpera === "group"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditGroup>
        <!--    时间转换-->
        <EditFormatTime
          v-if='activeOpera === "time_conversion"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditFormatTime>
        <!--    排序-->
        <EditSort
          v-if='activeOpera === "sort"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditSort>
        <!--    过滤-->
        <EditFilter
          v-if='activeOpera === "filter"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditFilter>
        <!--    字段设置-->
        <EditItemSet
          v-if='activeOpera === "field"'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
          :dataSourceName='dataSourceInfo.recordName || ""'
        ></EditItemSet>
        <!--    左右合并-->
        <EditMerge
          ref='editMerge'
          v-if='activeOpera === "merge"'
          :dataSourceInfo='dataSourceInfo'
          :canEditField='operaFieldOptions'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
          :sourceList='sourceList'
          @mergeShowTable='mergeShowTable'
        ></EditMerge>
        <!--    图表-->
        <EditChart
          v-if='activeOpera === "chart"'
          :fieldList='operaFieldOptions'
          :listData='resultData'
          :operaPerRecordId='operaPerRecordId'
          :editInfo='editInfo'
        ></EditChart>
        <!--    链接-->
        <EditLink
          v-if='activeOpera === "link"'
          :currentMode='lastResultMode'
          :pageInfo='{
            canEditField: operaFieldOptions,
            page: pageInfo
          }'
          :editInfo='editInfo'
          :operaPerRecordId='operaPerRecordId'
        ></EditLink>
      </Pop>
    </div>
  </div>
</template>

<script>
import Pop from '@/components/VisualComponents/PopDialog'
import EditDetail from './editDetail.vue'
import EditTable from './editTable.vue'
import EditSource from './editSource.vue' // 数据源组件
import EditCollect from './editCollect.vue' // 汇总表单组件
import EditAlgorithm from './editAlgorithm.vue' // 算法组件
import EditGroup from './editGroup.vue' // 分组组件
import EditRecord from './editRecord.vue' // 操作记录弹窗
import EditFormatTime from './editFormatTime.vue' // 时间转换表单组件
import EditSort from './editSort.vue' // 排序组件
import EditFilter from './editFilter.vue' // 过滤组件
import EditItemSet from './editItemSet.vue' // 字段设置组件
import EditMerge from './editMerge.vue' // 左右合并组件
import EditChart from './editChart.vue' // 图表
import EditLink from './editLink.vue' // 链接
import ChartResult from '../chart-result/index.vue' // 图表结果
import BinaryTree from '../binary-tree/index.vue' // 决策树组件
import NoEmpty from '@/components/BasicComponents/NoEmpty/index.vue'
import {
  getRecordApi,
  getCanEditFieldApi,
  findModuleOperaApi,
  addModuleModeApi,
  // scannerCloseApi,
  getModuleDataApi,
  getDataSourceApi
} from '@/api/analysisJudgment'
import { OPERA_TYPE, OPERA_OPTIONS, LINK_ICON_OPTIONS } from './config.js'
import { countFieldWidth, fieldSort, formatTime, formatBinaryTreeData } from '../../config/config.js'
const algorithmType = ['decision_tree','random_forest']
export default {
  name: 'EditPage',
  components: {
    Pop,
    EditTable,
    EditRecord,
    EditSource,
    EditCollect,
    EditAlgorithm,
    EditGroup,
    EditFormatTime,
    EditSort,
    EditFilter,
    EditItemSet,
    EditMerge,
    EditChart,
    EditLink,
    EditDetail,
    ChartResult,
    NoEmpty,
    BinaryTree
  },
  provide () {
    return {
      closeDialog: this.closeDialog,
      successOpera: this.successOpera,
      editModuleInfo: this.editModuleInfo
    }
  },
  props: {
    // 编辑模块信息
    editModuleInfo: {
      type: Object,
      default: () => {}
    },
    // 页面信息
    pageInfo: {
      type: Object
    }
  },
  data () {
    return {
      operaOptions: Object.freeze(OPERA_OPTIONS), // 操作按钮配置
      dialog: { show: false, title: '', width: '' }, // 弹窗配置
      activeOpera: null, // 当前的操作
      currentModeOpera: {
        list: ['aggregate', 'algorithm', 'group', 'time_conversion', 'sort', 'filter', 'field', 'merge', 'chart', 'list', 'detail', 'link'],
        detail: ['time_conversion', 'field', 'list', 'detail', 'link']
      },
      recordInfo: [], // 操作记录信息
      canEditField: [], // 最后一步操作可编辑的字段
      canEdit: false, // 是否可编辑当前页面的所以操作
      operaPerRecordId: null, // 操作的新增或编辑时的参数的perRecordId
      editInfo: null,
      editCanEditField: [], // 编辑时可编辑的字段
      dataSourceInfo: {},
      currentMode: '', // 当前展示数据的类型
      lastResultMode: '', // 数据结果展示的方式list,detail,chart
      resultField: [], // 数据结果展示的字段
      resultData: [], // 数据结果
      resultCount: 0,
      resultRecordId: null,
      resultLink: {
        icon: [],
        text: []
      }, // 查询数据结果的链接信息
      resultDisplayInfo: null, // 查询数据结果的展示方式信息，用于图表显示
      sourceList: [], // 可以选择的数据源数据
      sourceListObj: {}, // 可以选择的数据源数据
      sourceError: false, // 获取数据源是否失败
      loading: false,
      loadBg: '--bg-color-3',
      editUpdated: true,
      showNeedRun: false,
      algorithmType: '', // 算法的类型
      algorithmData: null, // 算法的数据
      binaryKey: new Date().getTime()
    }
  },
  computed: {
    // 是否可添加或者编辑数据源
    canAddSource () {
      return (
        (this.normalRecordInfo.length === 1 && this.normalRecordInfo[0].type === 'add_datasource') ||
        !this.recordInfo.length ||
        !this.normalRecordInfo.length
      )
    },
    // 操作弹窗选择字段的选项
    operaFieldOptions () {
      return this.editInfo ? this.editCanEditField : this.canEditField
    },
    // 正常的操作记录
    normalRecordInfo () {
      let errorIndex = this.recordInfo.findIndex(item => item.status === 'error')
      if (errorIndex > -1) {
        return this.recordInfo.slice(0, errorIndex).filter(item => item.status === 'normal')
      }
      return this.recordInfo.filter(item => item.status === 'normal')
    },
    haveErrorRecord () {
      return this.recordInfo.findIndex(item => item.status === 'error') !== -1
    },
    // 当前查看操作记录的信息
    currentRecord () {
      return this.recordInfo.find(item => item.id === this.resultRecordId)
    },
    isBinaryTree () {
      // console.log(this.currentRecord);
      // console.log(this.currentRecord.operatorType);
      // console.log(this.algorithmType);
      return this.currentRecord && this.currentRecord.operatorType === "algorithm" && algorithmType.includes(this.algorithmType)
    }
  },
  created () {
    this.loading = true
  },
  mounted () {
    this.getDataSource()
  },
  methods: {
    // 获取数据源
    getDataSource () {
      getDataSourceApi().then(res => {
        this.sourceList = res || []
        this.sourceList.forEach(item => {
          this.sourceListObj[item.tableName] = item.srcNameCn
        })
        this.getRecord()
      }).catch(() => {
        this.loading = false
        this.$message.error('获取数据源失败，请刷新后重试！')
        this.sourceError = true
      })
    },
    // 获取操作记录
    getRecord (recordId, needField = true) {
      getRecordApi({
        containerId: +this.editModuleInfo.i
      }).then(res => {
        let result = res || []
        let recordList = []
        result.forEach((item, index) => {
          const type = item.operatorType === 'display' ? item.displayType : item.operatorType
          let value = {
            ...item,
            recordName: OPERA_TYPE[type].name,
            icon: OPERA_TYPE[type].icon,
            type
          }
          if (index > 0) {
            value.preRecordId = result[index - 1].id
          }
          if (type === 'add_datasource' && item.dataSourceVO) {
            this.dataSourceInfo = item.dataSourceVO
            if (item.dataSourceVO.database === 'kudu') {
              value.recordName = this.sourceListObj[item.dataSourceVO.tableName] || ''
            } else {
              value.recordName = item.dataSourceVO.tableNameCn || ''
            }
            this.dataSourceInfo.recordName = value.recordName
          }
          recordList.push(value)
        })
        this.recordInfo = recordList
        let getDataList = []
        let afterAlgNoRun = this.recordInfo.findIndex(item =>
          item.status === 'normal' &&
          item.type === 'algorithm'
        )
        if (this.normalRecordInfo.length) {
          const data = this.normalRecordInfo.slice(-1)[0]
          this.showNeedRun = afterAlgNoRun !== -1 && data.state !== 'completed'
          getDataList.push(this.getResultData(data.containerId, data.id))
        }
        if (needField) {
          const searchFieldId = recordId ?
            recordId : this.normalRecordInfo.length ?
              this.normalRecordInfo[this.normalRecordInfo.length - 1].id : null
          searchFieldId && getDataList.push(this.getCanEditField(searchFieldId))
        }
        Promise.all(getDataList.map(item => item.catch(() => []))).then(() => {
          this.loading = false
        })
        this.canEdit = true
      }).catch(() => {
        this.loading = false
        this.canEdit = false
        this.$message.error('请刷新页面！')
      })
    },
    // 获取数据结果
    getResultData (moduleId, recordId, setMode = true) {
      return new Promise((resolve, reject) => {
        getModuleDataApi({
          containerId: moduleId,
          recordId: recordId,
          state: 'incomplete',
          conditionList: []
        }).then(res => {
          this.resultLink = {
            icon: [],
            text: []
          }
          console.log(res);
          this.resultRecordId = recordId
          let result = res || {}
          let timeField = []
          let data = result.dataVOList || []
          this.resultDisplayInfo = result.displayVO
          this.algorithmType = result.algorithmType
          result.dataStr && (this.algorithmData = formatBinaryTreeData(JSON.parse(result.dataStr)))
          this.binaryKey = new Date().getTime()
          const fieldList = fieldSort(result.fieldVOList || [])
          const linkList = result.linkVOs || []
          const mode = result.displayVO && result.displayVO.displayType ? result.displayVO.displayType : 'list'
          if (setMode) this.lastResultMode = this.isBinaryTree ? 'chart' : mode
          this.resultField = mode !== 'chart' ? countFieldWidth(fieldList) : fieldList
          this.resultField.forEach(field => {
            if (field.fieldType === 'TIMESTAMP') timeField.push(field.fieldNameEn)
          })
          if (timeField.length) {
            data.forEach(item => {
              timeField.forEach(field => {
                item[field] && (item[field] = formatTime(item[field]))
              })
            })
          }
          this.resultData = data
          this.resultCount = result.dataVOCount || 0
          linkList.forEach(link => {
            if (link.keyType === 'icon') {
              const iconInfo = LINK_ICON_OPTIONS.find(item => item.value === link.keyIcon)
              this.resultLink.icon.push({
                label: iconInfo.label,
                icon: iconInfo.icon
              })
            } else {
              link.list && link.list.forEach(item => {
                this.resultLink.text.push(item.currentField)
              })
            }
          })
          this.currentMode = mode
          resolve()
          this.editUpdated = false
        }).catch(() => {
          this.resultRecordId = null
          this.resultField = []
          this.resultData = []
          this.resultCount = 0
          this.resultLink = {
            icon: [],
            text: []
          }
          reject()
        }).finally(() => {
          this.editUpdated = true
        })
      })
    },
    needRunTip (bool) {
      this.showNeedRun = bool
    },
    // 点击操作栏时
    handleOpera (option) {
      if (!this.canEdit ||
        !this.recordInfo.length ||
        (option.type === this.lastResultMode && this.lastResultMode !== 'chart') ||
        (this.currentModeOpera[this.lastResultMode] && !this.currentModeOpera[this.lastResultMode].includes(option.type)) ||
        this.recordInfo.some(record => record.operatorType === "link" && record.status === "normal") ||
        this.sourceError ||
        this.haveErrorRecord ||
        this.recordInfo.some(record => record.operatorType === "algorithm" && record.algorithmType === "decision_tree" && record.status === "normal")
      ) return
      const preRecordId = this.normalRecordInfo[this.normalRecordInfo.length - 1].id
      if (['list', 'detail'].includes(option.type)) {
        this.changeMode(option.type, preRecordId)
      } else {
        this.dialog.title = option.popTitle
        this.dialog.width = option.popWidth
        this.activeOpera = option.type
        this.operaPerRecordId = preRecordId
        this.openDialog()
      }
    },
    // 列表和详情切换时
    changeMode (type, perRecordId) {
      this.loading = true
      this.loadBg = '--loading-color-1'
      addModuleModeApi({
        containerId: +this.editModuleInfo.i,
        displayChartType: '',
        displayCoordinate: '',
        displayType: type,
        perRecordId: perRecordId
      }).then(() => {
        this.getRecord(false, false)
      }).catch(() => {
        this.loading = false
      })
    },
    // 操作数据源
    handleSource () {
      if (!this.canEdit || !this.canAddSource || this.sourceError) return
      this.dialog.title = this.recordInfo.length ? '编辑数据源' : '添加数据源'
      this.dialog.width = '730px'
      this.activeOpera = 'source'
      this.openDialog()
    },
    // 操作成功之后更新操作记录
    successOpera () {
      this.closeDialog()
      this.loading = true
      this.loadBg = '--loading-color-1'
      this.getRecord()
    },
    // 获取可编辑的字段
    getCanEditField (recordId, itemName = 'canEditField') {
      return new Promise((resolve, reject) => {
        getCanEditFieldApi({
          containerId: +this.editModuleInfo.i,
          recordId: recordId
        }).then(res => {
          let result = res || []
          result.forEach(item => {
            item.label = item.fieldNameCn
            item.value = item.fieldNameEn
            item.type = ''
            item.icon = ''
            if (item.fieldType === 'STRING') {
              item.type = 'text'
              item.icon = 'icon-a-zu5742'
            } else if (item.fieldType === 'BIGINT') {
              item.type = 'number'
              item.icon = 'icon-a-zu5757'
            } else if (item.fieldType === 'TIMESTAMP') {
              item.type = 'time'
              item.icon = 'icon-a-zu5759'
            }
          })
          this[itemName] = result
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 操作记录点击编辑时
    editOpera (item) {
      const operaInfo = OPERA_TYPE[item.type]
      const findInfo = new Promise((resolve, reject) => {
        findModuleOperaApi(operaInfo.editApi, {
          containerId: +this.editModuleInfo.i,
          recordId: item.id
        }).then(res => {
          this.editInfo = res || null
          resolve()
        }).catch(() => {
          reject()
        })
      })
      Promise.all([
        findInfo,
        this.getCanEditField(item.preRecordId, 'editCanEditField')
      ]).then(() => {
        this.dialog.title = operaInfo.name
        this.dialog.width = operaInfo.popWidth
        this.activeOpera = item.type
        this.operaPerRecordId = item.preRecordId
        this.openDialog()
      }).catch(() => {
        this.$message.error('操作超时，请点击重试！')
      })
    },
    // 左右合并点击选择表时
    mergeShowTable (title, popWidth) {
      this.dialog.title = title
      this.dialog.width = popWidth
    },
    openDialog () {
      this.dialog.show = true
    },
    closeDialog () {
      if (this.dialog.title === '选择合并表') {
        this.$refs.editMerge.cancelTable()
        return
      }
      this.dialog.show = false
      this.dialog.title = ''
      this.dialog.width = ''
      this.activeOpera = null
      this.operaPerRecordId = null
      this.editInfo = null
      this.editCanEditField = []
    }
  },
  beforeDestroy () {
    /*let params = new FormData()
    params.append('containerId', +this.editModuleInfo.i)
    scannerCloseApi(params)*/
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_container {
  width: 100%;
  height: 100%;
  .return_wrap {
    display: flex;
    justify-content: flex-end;
    line-height: 19px;
    padding: 32px 32px 16px;
    .return {
      flex: none;
      cursor: pointer;
    }
    i {
      font-size: 16px;
      color: var(--primary-menu-text-color);
      margin-right: 8px;
    }
    span {
      float: right;
      font-size: 14px;
      font-weight: bold;
      color: var(--base-text-color-1);
    }
  }
}
.edit_page_wrap {
  width: calc(100% - 64px);
  height: calc(100vh - 228px);
  background: var(--bg-color-3);
  margin: 0 32px 0;
  padding: 24px 0 16px;
  .edit_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 24px;
    .header_left {
      display: flex;
      .opera_wrap {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding: 0 4px;
        .opera_item {
          display: flex;
          padding: 0 24px;
          .opera {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            line-height: 20px;
            color: var(--base-text-color-to-666666);
            white-space: nowrap;
            cursor: pointer;
            i {
              font-size: 32px;
              line-height: 32px;
              color: var(--base-text-color-to-666666);
              margin-bottom: 8px;
            }
            &.is_mode {
              color: var(--active-color);
              i {
                color: var(--active-color);
              }
            }
            &.is_disabled {
              opacity: 0.4;
              cursor: not-allowed;
            }
          }
        }
        &::after {
          position: absolute;
          right: 0;
          bottom: 2px;
          display: block;
          content: '';
          width: 1px;
          height: 16px;
          background: var(--division);
        }
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
    .header_right {
      display: flex;
      align-items: center;
      margin-right: 24px;
      .record_origin {
        font-size: 18px;
        line-height: 24px;
        color: var(--active-color);
        cursor: pointer;
        &.is_disabled {
          color: var(--base-text-color-9);
          cursor: not-allowed;
        }
      }
    }
  }
  .edit_content {
    display: flex;
    width: 100%;
    height: calc(100% - 84px);
    padding-left: 24px;
    .content_left {
      flex: 1;
      width: calc(100% - 280px);
      height: 100%;
      overflow-y: auto;
      padding-right: 16px;
      border-right: 1px solid var(--border-color-4);
    }
    @media screen and (min-width: 1024px) and (max-width:1365px){
      .content_left{
        overflow-y: hidden;
      }
    }
    .content_right {
      flex: none;
      width: 280px;
      height: 100%;
      overflow-y: auto;
    }
  }
}
/deep/.data_center_detail .el-dialog__wrapper .el-dialog .el-dialog__body {
  padding: 24px 32px 32px 32px !important;
}
</style>
