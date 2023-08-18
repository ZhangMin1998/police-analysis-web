<template>
<div class='edit_merge_wrap'>
  <template v-if='!showOtherTable'>
    <div class='merge_list_wrap'>
      <div class='title'>
        <div class='tip'>合并表：</div>
        <div class='opera' @click='showChoiceDialog'>选择</div>
      </div>
      <div class='list_item'>
        <div class='list_name'>{{ listName }}</div>
        <div class='list_field'>
          <div
            v-for='(item, index) in isCheckField'
            :key='index'
            class='field'
          >
            <i :class='["iconfont", item.icon]'></i>
            <div class='field_cn'>{{ item.fieldNameCn || '' }}</div>
          </div>
        </div>
      </div>
    </div>
<!--    <div class='merge_way_wrap'>
      <div class='label'>合并方式：</div>
      <el-radio-group v-model="mergeWay" class='app_type'>
        <el-radio label="left">左合并：</el-radio>
        <el-radio label="right">右合并：</el-radio>
      </el-radio-group>
    </div>-->
    <div class='merge_col_wrap'>
      <div class='tip'>合并列：</div>
      <div class='list_info'>
        <div class='list'>
          <div class='tip'>左表：</div>
          <div class='name'>{{ leftTableName }}</div>
        </div>
        <div class='list'>
          <div class='tip'>右表：</div>
          <div class='name'>{{ listName.slice(0, -1) }}</div>
        </div>
      </div>
      <div v-for='(item, index) in mergeColLists' :key='index' class='col_info'>
        <div
          :class='{
            "is_error": item.leftItem && item.rightItem && item.leftType !== item.rightType || (isError && !item.leftItem),
            "col_select": true
          }'
        >
          <EditSelect
            :modelValue.sync='item.leftItem'
            :options='canEditField'
            @handleItem='(opt) => changeItem(opt, item, "leftType")'
          ></EditSelect>
        </div>
        <div class='division'>=</div>
        <div
          :class='{
            "is_error": (item.leftItem && item.rightItem && item.leftType !== item.rightType) || (isError && !item.rightItem),
            "col_select": true
          }'
        >
          <EditSelect
            :modelValue.sync='item.rightItem'
            :options='isCheckField'
            @handleItem='(opt) => changeItem(opt, item, "rightType")'
          ></EditSelect>
        </div>
        <i class='iconfont icon-delete' title='删除' @click='delMergeCol(index)'></i>
      </div>
      <div class='add_btn' @click='addMergeCol'>
        <i class='iconfont icon-tianjia'></i>
        <div class='name'>添加</div>
      </div>
    </div>
    <div class='floor'>
      <div class='blank_button' @click='closeDialog'>取消</div>
      <el-button type="primary" @click='submit'>确定</el-button>
    </div>
  </template>
  <template v-else>
    <div class='up_way_wrap'>
      <div
        :class='{
        "active": operaWay === "kudu",
        "way_item": true
      }'
        @click='handleMergeWay("kudu")'
      >系统数据</div>
      <div
        :class='{
        "active": operaWay === "csv",
        "way_item": true
      }'
        @click='handleMergeWay("csv")'
      >本地csv文件上传</div>
      <div
        :class='{
        "active": operaWay === "container",
        "way_item": true
      }'
        @click='handleMergeWay("container")'
      >容器数据</div>
    </div>
    <div v-show='operaWay === "kudu"' class='table_wrap'>
      <div class='left_table common'>
<!--        <el-input
          v-model.trim="tableName"
          @keyup.enter.native="searchClick"
          placeholder="请输入"
        >
          <template slot="suffix">
            <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
          </template>
        </el-input>-->
        <div class='record_wrap'>
          <div
            v-for='item in sourceList'
            :key='item.srcNameEn'
            :class='{
              "record_item": true,
              "is_choice": choiceData.srcNameEn && item.srcNameEn === choiceData.srcNameEn
            }'
            @click='choiceSource(item)'
          >{{ item.srcNameCn }}</div>
        </div>
      </div>
      <div class='right_table_field common'>
        <div v-show='choiceFiled.length'>
          <div class='table_info'>
            <div class='item_info'>
              <div class='checkbox' :class='[kuduFieldCheckStatus]' @click='isChoiceAllField("kuduFieldCheckStatus", "choiceFiled")'></div>
              <div class='item_label'>{{ choiceData.srcNameCn || '' }}</div>
            </div>
          </div>
          <div
            v-for='(item, index) in choiceFiled'
            :key='index'
            class='field_info'
          >
            <div class='item_info'>
              <div class='checkbox' :class='{ "active": item.isCheck }' @click='isChoiceField(item)'></div>
              <i :class='[ "iconfont", item.icon ]'></i>
              <div class='item_label'>{{ item.fieldNameCn || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show='operaWay === "csv"' class='upload_wrap'>
      <el-upload
        v-if='!uploadFileInfo.url'
        class='upload_window'
        :action="'#'"
        :http-request="uploadRequest"
        accept='.csv'
        :multiple="false"
        :auto-upload="true"
        :on-error="unError"
        :show-file-list="false"
        :before-upload="beforeUpload">
        <div class='upload_tip'>
          <div class='upload_text'>
            <div>请选择文件</div>
          </div>
          <div class='text_tip'>支持上传csv文件，且不超过10MB</div>
        </div>
      </el-upload>
      <div v-else class='upload_result'>
        <div class='file_info'>
          <div class='file_type'>
            <img :src='require(`@/assets/img/${$themeColor("--upload-file-bg")}.png`)' alt=''>
          </div>
          <EllipsisPop class='file_name' :content='uploadFileInfo.name'>
            <div>{{ uploadFileInfo.name }}</div>
          </EllipsisPop>
        </div>
        <div class='upload_data_name'>
          <div class='label'>表名：</div>
          <el-input v-model.trim="uploadFileInfo.tableName" placeholder="请输入表名" maxlength='7'></el-input>
        </div>
      </div>
    </div>

    <div v-show='operaWay === "container"' class='module_source_wrap'>
      <div class='common module_list'>
        <el-tree
          class="filter-tree el-tree-addordel"
          :data="moduleTreeData"
          show-checkbox
          highlight-current
          :check-on-click-node="true"
          node-key="id"
          default-expand-all
          :props="treeProps"
          ref="tree"
          @check='handleCheck'
        >
        <span class="custom-tree-node" slot-scope="{ node }">
          <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
        </span>
        </el-tree>

      </div>
      <div class='right_table_field common'>
        <div v-show='moduleField.length'>
          <div class='table_info'>
            <div class='item_info'>
              <div class='checkbox' :class='[moduleFieldCheckStatus]' @click='isChoiceAllField("moduleFieldCheckStatus", "moduleField")'></div>
              <div class='item_label'>{{ moduleData.containerName || '' }}</div>
            </div>
          </div>
          <div
            v-for='(item, index) in moduleField'
            :key='index'
            class='field_info'
          >
            <div class='item_info'>
              <div class='checkbox' :class='{ "active": item.isCheck }' @click='isChoiceField(item)'></div>
              <i :class='[ "iconfont", item.icon ]'></i>
              <div class='item_label'>{{ item.fieldNameCn || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='floor'>
      <div class='blank_button' @click='cancelTable'>取消</div>
      <el-button type="primary" @click='submitTable'>确定</el-button>
    </div>
  </template>
</div>
</template>

<script>
import EditSelect from './editSelect.vue'
import {
  uploadFileApi,
  moduleMergeTableFiled,
  moduleMergeTableFiledCsv,
  addModuleMergeApi,
  updateModuleMergeApi,
  getCanEditFieldApi,
  getAppPagesModulesApi
} from '@/api/analysisJudgment'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { toPinYin } from './config.js'

export default {
  name: 'EditMerge',
  components: {
    EditSelect,
    EllipsisPop
  },
  inject: [
    'successOpera',
    'closeDialog',
    'editModuleInfo'
  ],
  props: {
    // 已有数据源的信息
    dataSourceInfo: {
      type: Object,
      default: () => {}
    },
    canEditField: {
      type: Array,
      default: () => []
    },
    operaPerRecordId: {
      type: Number
    },
    // 编辑时的相关信息
    editInfo: {
      type: Object
    },
    sourceList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      /*moduleTreeData: [
        {
          "id": 3,
          "appId": 3,
          "pageName": "应用-小小",
          "label": "应用-小小",
          "homePageFlag": true,
          "disabled": true,
          "children": [
            {
              "id": 767,
              "appId": 3,
              "pageId": 3,
              "containerName": "模块1",
              "label": "模块1",
              "containerCoordinate": "0,0,4,4",
              "operatorFlag": true,
              "maxRecordId": 2623,
              "refreshFlag": false,
              "runningFlag": false,
              "disabled": false,
            },
            {
              "id": 783,
              "appId": 3,
              "pageId": 3,
              "containerName": "模块2",
              "label": "模块2",
              "containerCoordinate": "0,4,4,4",
              "operatorFlag": true,
              "maxRecordId": 2809,
              "refreshFlag": true,
              "runningFlag": false,
              "disabled": false,
            }
          ]
        },
        {
          "id": 142,
          "appId": 3,
          "pageName": "应用-小小2",
          "label": "应用-小小2",
          "homePageFlag": false,
          "disabled": true,
        },
        {
          "id": 465,
          "appId": 3,
          "pageName": "应用-小小3",
          "label": "应用-小小3",
          "homePageFlag": false,
          "disabled": true,
          "children": [
            {
              "id": 978,
              "appId": 3,
              "pageId": 465,
              "containerName": "模块1",
              "label": "模块1",
              "containerCoordinate": "0,0,4,4",
              "operatorFlag": true,
              "maxRecordId": 3165,
              "refreshFlag": false,
              "runningFlag": false,
              "disabled": false,
            }
          ]
        }
      ],*/
      moduleTreeData: [],
      treeProps: {
        children: 'children',
        label: 'label'
      },
      moduleData: {},
      moduleField: [],
      moduleDataField: {},
      showOtherTable: false, // 是否展示选择表
      // mergeWay: 'left', // 合并方式
      mergeColLists: [], // 合并列信息数组
      operaWay: 'kudu', // 合并表的方式
      // tableName: '', // 合并表的搜索栏绑定的值
      choiceData: {}, // 系统数据选中数据
      choiceDataFiled: {}, // 系统数据选中数据的字段
      choiceFiled: [], // 系统数据选中数据的字段
      uploadFileInfo: {
        url: '',
        name: '',
        tableName: '',
        tableField: []
      }, // 上传csv文件的路径
      tableResult: {
        choiceData: {},
        choiceFiled: [],
        moduleData: {},
        moduleField: [],
        uploadFileInfo: {
          url: '',
          name: '',
          tableName: '',
          tableField: []
        },
        operaWay: '',
      }, // 提交合并表的数据
      isError: false
    }
  },
  computed: {
    currentAppId () {
      return this.$route.query.appId
    },
    // 当前容器操作表的中文名
    leftTableName () {
      return this.dataSourceInfo.recordName || '--'
    },
    // 除当前容器操作表外的kudu表信息
    /*otherSource () {
      return this.sourceList.filter(item => item.tableName !== this.dataSourceInfo.tableName)
    },*/
    // kud选择字段选中状态
    kuduFieldCheckStatus () {
      const isCheckList = this.choiceFiled.filter(item => item.isCheck)
      if (!isCheckList.length) return ''
      if (isCheckList.length === this.choiceFiled.length) {
        return 'active'
      } else {
        return 'indeterminate'
      }
    },
    // 容器数据选择字段选中状态
    moduleFieldCheckStatus () {
      const isCheckList = this.moduleField.filter(item => item.isCheck)
      if (!isCheckList.length) return ''
      if (isCheckList.length === this.moduleField.length) {
        return 'active'
      } else {
        return 'indeterminate'
      }
    },
    isCheckField () {
      if (this.tableResult.operaWay === 'kudu')
        return this.tableResult.choiceFiled.filter(item => item.isCheck)
      else if (this.tableResult.operaWay === 'csv')
        return this.tableResult.uploadFileInfo.tableField
      else if (this.tableResult.operaWay === 'container')
        return this.tableResult.moduleField.filter(item => item.isCheck)
      return []
    },
    listName () {
      if (this.tableResult.operaWay === 'kudu' && this.tableResult.choiceData.srcNameCn)
        return this.tableResult.choiceData.srcNameCn + '：'
      if (this.tableResult.operaWay === 'csv')
        return this.tableResult.uploadFileInfo.tableName + '：'
      if (this.tableResult.operaWay === 'container' && this.tableResult.moduleData.containerName)
        return this.tableResult.moduleData.containerName + '：'
      return ''
    }
  },
  created () {
    if (!this.editInfo) {
      this.mergeColLists.push({
        leftItem: '',
        rightItem: '',
        leftType: '',
        rightType: ''
      })
    }
  },
  mounted () {
    if (!this.editInfo) return
    this.tableResult.operaWay = this.editInfo.rightDatabase
    // this.mergeWay = this.editInfo.mergeType
    if (this.editInfo.rightDatabase === 'kudu') {
      let choiceData = this.sourceList.find(item => item.tableName === this.editInfo.rightTable)
      this.tableResult.choiceData = choiceData || {}
      if (choiceData) {
        this.getKuduField(choiceData.srcNameEn).then(res => {
          this.choiceDataFiled[choiceData.srcNameEn] = res
          let leftType = {}
          let rightType = {}
          this.canEditField.forEach(item => {
            leftType[item.fieldNameEn] = item.fieldType
          })
          res.forEach(item => {
            rightType[item.fieldNameEn] = item.fieldType
          })
          this.choiceDataFiled[choiceData.srcNameEn].forEach(item => {
            const ind = this.editInfo.fieldList.findIndex(field => field.fieldNameEn === item.fieldNameEn)
            if (ind === -1)
              item.isCheck = false
            else
              item.id = this.editInfo.fieldList[ind].id
          })
          this.tableResult.choiceFiled = this.choiceDataFiled[choiceData.srcNameEn]
          this.editInfo.list.forEach(item => {
            let rightItem = item.rightTableField.split('_').slice(0, -1).join('_')
            this.mergeColLists.push({
              id: item.id,
              mergeId: item.mergeId,
              leftItem: item.leftTableField,
              rightItem: rightItem,
              leftType: leftType[item.leftTableField],
              rightType: rightType[rightItem]
            })
          })
        })
      }
    } else if (this.editInfo.rightDatabase === 'csv') {
      this.tableResult.uploadFileInfo.url = this.editInfo.rightCsvUrl
      this.tableResult.uploadFileInfo.name = this.editInfo.rightTableNameCn + '.csv'
      this.tableResult.uploadFileInfo.tableName = this.editInfo.rightTableNameCn
      this.getCsvField(this.editInfo.rightCsvUrl).then(res => {
        this.tableResult.uploadFileInfo.tableField = res
        let leftType = {}
        let rightType = {}
        this.canEditField.forEach(item => {
          leftType[item.fieldNameEn] = item.fieldType
        })
        res.forEach(item => {
          rightType[item.fieldNameEn] = item.fieldType
        })
        this.editInfo.list.forEach(item => {
          let rightItem = item.rightTableField.split('_').slice(0, -1).join('_')
          this.mergeColLists.push({
            id: item.id,
            mergeId: item.mergeId,
            leftItem: item.leftTableField,
            rightItem: rightItem,
            leftType: leftType[item.leftTableField],
            rightType: rightType[rightItem]
          })
        })
      })
    } else {
      this.getAppPagesModule().then(() => {
        if (!this.moduleTreeData.length) return
        let allModuleInfo = this.moduleTreeData.map(item => item.children || []).flat(1)
        if (!allModuleInfo.length) return
        let updateModuleData = allModuleInfo.find(item => item.id === +this.editInfo.rightTable)
        if (!updateModuleData) return
        this.tableResult.moduleData = updateModuleData
        this.getModuleField(+this.editInfo.rightTable).then(res => {
          let result = res || []
          this.moduleDataField[this.editInfo.rightTable] = result
          let leftType = {}
          let rightType = {}
          this.canEditField.forEach(item => {
            leftType[item.fieldNameEn] = item.fieldType
          })
          result.forEach(item => {
            rightType[item.fieldNameEn] = item.fieldType
          })
          this.moduleDataField[this.editInfo.rightTable].forEach(item => {
            const ind = this.editInfo.fieldList.findIndex(field => field.fieldNameEn === item.fieldNameEn)
            if (ind === -1)
              item.isCheck = false
            else
              item.id = this.editInfo.fieldList[ind].id
          })
          this.tableResult.moduleField = this.moduleDataField[this.editInfo.rightTable]
          this.editInfo.list.forEach(item => {
            let rightItem = item.rightTableField.split('_').slice(0, -1).join('_')
            let isRightMatch = result.some(match => match.fieldNameEn === rightItem)
            this.mergeColLists.push({
              id: item.id,
              mergeId: item.mergeId,
              leftItem: item.leftTableField,
              rightItem: isRightMatch ? rightItem : '',
              leftType: leftType[item.leftTableField],
              rightType: isRightMatch ? rightType[rightItem] : ''
            })
          })
        })
      })
    }
  },
  methods: {
    // 切换合并表源的方式
    handleMergeWay (way) {
      this.operaWay = way
      if (way === 'container' && !this.moduleTreeData.length) {
        this.getAppPagesModule()
      }
    },
    // 当为容器数据时，容器选择时
    handleCheck (item, check) {
      if (!item.containerName) return
      if (check.checkedKeys.length) {
        const algorithmType = ['decision_tree','random_forest']
        if (item.algorithmFlag && algorithmType.includes(item.algorithmType)) {
          this.$message.warning('不支持关联涉及复杂算法模块')
          if (this.moduleData.id) {
            this.$refs.tree.setCheckedKeys([this.moduleData.id])
          } else {
            this.$refs.tree.setCheckedKeys([])
            this.moduleData = {}
            this.moduleField = []
          }
          return
        }
        this.$refs.tree.setCheckedKeys([item.id])
        this.moduleData = item
        const moduleId = item.id + ''
        if (this.moduleDataField[moduleId]) {
          this.moduleDataField[moduleId].forEach(field => {
            field.isCheck = true
          })
          this.moduleField = this.moduleDataField[moduleId]
        } else {
          this.getModuleField(+moduleId).then(res => {
            this.moduleDataField[moduleId] = res
            this.moduleField = this.moduleDataField[moduleId]
          })
        }
      } else {
        this.moduleData = {}
        this.moduleField = []
      }
    },
    // 获取容器的字段
    getModuleField (moduleId) {
      return new Promise((resolve, reject) => {
        getCanEditFieldApi({
          containerId: moduleId,
          recordId: ''
        }).then(res => {
          let result = res || []
          result.forEach(item => {
            item.isCheck = true
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
          resolve(result)
        }).catch(() => {
          reject([])
        })
      })
    },
    // 获取容器数据
    getAppPagesModule () {
      return new Promise((resolve, reject) => {
        getAppPagesModulesApi({
          appId: this.currentAppId
        }).then(res => {
          let result = res || []
          result.forEach(item => {
            item.id = `page_${item.id}`
            item.disabled = true
            item.label = item.pageName
            item.children = Array.isArray(item.children) ? item.children : []
            item.children.forEach(module => {
              module.label = module.containerName
              if (module.errorFlag || !module.operatorFlag || module.id === +this.editModuleInfo.i) {
                module.disabled = true
              }
            })
          })
          this.moduleTreeData = result
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 搜索合并表
    // searchClick () {},
    // 选中系统数据
    choiceSource (item) {
      this.choiceData = item
      const dataEn = item.srcNameEn
      if (this.choiceDataFiled[dataEn]) {
        this.choiceDataFiled[dataEn].forEach(field => {
          field.isCheck = true
        })
        this.choiceFiled = this.choiceDataFiled[dataEn]
        return
      }
      this.getKuduField(dataEn).then(res => {
        this.choiceDataFiled[dataEn] = res
        this.choiceFiled = this.choiceDataFiled[dataEn]
      })
    },
    // 获取kudu数据字段
    getKuduField (dataEn) {
      return new Promise((resolve, reject) => {
        let params = new FormData()
        params.append('tableName', dataEn)
        moduleMergeTableFiled(params).then(res => {
          let result = res || []
          result.forEach(item => {
            item.isCheck = true
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
          resolve(result)
        }).catch(() => {
          reject([])
        })
      })
    },
    // 上传文件调用接口
    uploadRequest (file) {
      const type = file.file.type === 'text/csv' ? 'csv' : 'setting'
      let uploadFile = new FormData()
      uploadFile.append('multipartFile', file.file)
      uploadFile.append('type', type)
      uploadFileApi(uploadFile).then(res => {
        this.uploadFileInfo.url = res || ''
        this.uploadFileInfo.name = file.file.name
        this.uploadFileInfo.tableName = file.file.name.split('.')[0].slice(0, 7)
        this.getCsvField(res || '').then(fieldRes => {
          this.uploadFileInfo.tableField = fieldRes
        })
      })
    },
    getCsvField (url) {
      return new Promise((resolve, reject) => {
        let params = new FormData()
        params.append('csvUrl', url)
        moduleMergeTableFiledCsv(params).then(fieldRes => {
          let result = fieldRes || []
          /*const fieldEn = result.map(item => item.fieldNameEn)
          for (let i = 0; i < fieldEn.length; i++) {
            if (!(/^[a-z_\d]+$/.test(fieldEn[i]))) {
              this.$message.error('字段名不符合规则，请修改csv文件后重试！')
              return
            }
          }*/
          let list = []
          result.forEach((item) => {
            list.push({
              fieldNameEn: item.fieldNameEn,
              fieldNameCn: item.fieldNameCn,
              label: item.fieldNameCn,
              value: item.fieldNameEn,
              fieldType: 'STRING',
              type: 'text',
              icon: 'icon-a-zu5742'
            })
          })
          resolve(list)
        }).catch(() => {
          reject([])
        })
      })
    },
    // 文件上传失败
    unError (fileList) {
      this.$message.error(fileList[0].msg)
    },
    // 文件上传前
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt10M
    },
    // 添加合并列
    addMergeCol () {
      this.mergeColLists.push({
        leftItem: '',
        rightItem: '',
        leftType: '',
        rightType: ''
      })
    },
    // 删除合并列
    delMergeCol (ind) {
      this.mergeColLists.splice(ind, 1)
    },
    // 点击合并表的选择时
    showChoiceDialog () {
      if (this.tableResult.operaWay === 'kudu') {
        this.choiceData = JSON.parse(JSON.stringify(this.tableResult.choiceData))
        this.choiceFiled = this.tableResult.choiceFiled.slice()
      } else if (this.tableResult.operaWay === 'csv') {
        this.operaWay = 'csv'
        this.uploadFileInfo = JSON.parse(JSON.stringify(this.tableResult.uploadFileInfo))
      } else if (this.tableResult.operaWay === 'container') {
        this.operaWay = 'container'
        this.moduleData = JSON.parse(JSON.stringify(this.tableResult.moduleData))
        this.moduleField = JSON.parse(JSON.stringify(this.tableResult.moduleField))
      }
      this.$emit('mergeShowTable','选择合并表', '730px')
      this.showOtherTable = true
      if (this.operaWay === 'container' && this.moduleData) {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([this.moduleData.id])
        })
      }
    },
    // 选择合并表点击取消
    cancelTable () {
      this.$emit('mergeShowTable','左右合并', '580px')
      this.showOtherTable = false
      this.choiceData = {}
      this.choiceFiled = []
      this.moduleData = {}
      this.moduleField = []
      this.uploadFileInfo = {
        url: '',
        name: '',
        tableName: '',
        tableField: []
      }
      this.operaWay = 'kudu'
      this.tableName = ''
    },
    // 选择合并表点击确定
    submitTable () {
      if (this.tableResult.operaWay && this.tableResult.operaWay !== this.operaWay) {
        this.mergeColLists = []
      }
      if (this.operaWay === 'kudu') {
        if (!this.choiceData.srcNameEn) {
          this.$message.error('请选择系统数据！')
          return
        }
        if (!this.choiceFiled.some(item => item.isCheck)) {
          this.$message.error('请选择合并字段！')
          return
        }
        if (
          this.tableResult.choiceData.srcNameEn &&
          this.tableResult.choiceData.srcNameEn !== this.choiceData.srcNameEn
        ) {
          this.mergeColLists = []
        }
        this.tableResult.choiceData = JSON.parse(JSON.stringify(this.choiceData))
        this.tableResult.choiceFiled = this.choiceFiled.slice()
        this.tableResult.operaWay = 'kudu'
        this.tableResult.moduleData = {}
        this.tableResult.moduleField = {}
        this.tableResult.uploadFileInfo = {
          url: '',
          name: '',
          tableName: '',
          tableField: []
        }
      } else if (this.operaWay === 'csv') {
        if (!this.uploadFileInfo.url) {
          this.$message.error('请上传csv文件！')
          return
        }
        if (!this.uploadFileInfo.tableName) {
          this.$message.error('请输入表名！')
          return
        }
        if (
          this.tableResult.uploadFileInfo.url &&
          this.tableResult.uploadFileInfo.url !== this.uploadFileInfo.url
        ) {
          this.mergeColLists = []
        }
        this.tableResult.choiceData = {}
        this.tableResult.choiceFiled = []
        this.tableResult.moduleData = {}
        this.tableResult.moduleField = {}
        this.tableResult.operaWay = 'csv'
        this.tableResult.uploadFileInfo = JSON.parse(JSON.stringify(this.uploadFileInfo))
      } else {
        if (!this.moduleData.id) {
          this.$message.error('请选择容器数据！')
          return
        }
        if (!this.moduleField.some(item => item.isCheck)) {
          this.$message.error('请选择合并字段！')
          return
        }
        if (
          this.tableResult.moduleData.id &&
          this.tableResult.moduleData.id !== this.moduleData.id
        ) {
          this.mergeColLists = []
        }
        this.tableResult.moduleData = JSON.parse(JSON.stringify(this.moduleData))
        this.tableResult.moduleField = this.moduleField.slice()
        this.tableResult.operaWay = 'container'
        this.tableResult.choiceData = {}
        this.tableResult.choiceFiled = []
        this.tableResult.uploadFileInfo = {
          url: '',
          name: '',
          tableName: '',
          tableField: []
        }
      }
      this.mergeColLists.length && this.mergeColLists.forEach(item => {
        if (!this.isCheckField.some(field => field.fieldNameEn === item.rightItem)) {
          item.rightItem = ''
          item.rightType = ''
        }
      })
      this.cancelTable()
    },
    // 选择合并表字段是否选择
    isChoiceField (item) {
      item.isCheck = !item.isCheck
    },
    // 选择合并表是否选中全部字段
    isChoiceAllField (judgmentItem, fieldList) {
      if (!judgmentItem || !fieldList) return
      let result = true
      if (this[judgmentItem] === 'active') {
        result = false
      }
      this[fieldList].forEach(item => {
        item.isCheck = result
      })
    },
    changeItem (opt, item, way) {
      item[way] = opt.fieldType
    },
    submit () {
      if (
        !this.tableResult.operaWay ||
        (this.tableResult.operaWay === 'kudu' && !this.tableResult.choiceData.srcNameEn) ||
        (this.tableResult.operaWay === 'csv' && (!this.tableResult.uploadFileInfo.url || !this.tableResult.uploadFileInfo.tableName)) ||
        (this.tableResult.operaWay === 'container' && !this.tableResult.moduleData.id)
      ) {
        this.$message.error('请添加合并表！')
        return
      }
      if (!this.mergeColLists.length) {
        this.$message.error('请添加合并列！')
        return
      }
      if (
        this.mergeColLists.some(item => item.leftItem && item.rightItem && item.leftType !== item.rightType) ||
        this.mergeColLists.some(item => !item.leftItem || !item.rightItem)
      ) {
        this.isError = true
        return
      }
      const fieldInfo = this.isCheckField.slice()
      let fieldList = []
      let list = []
      let requestApi = addModuleMergeApi
      let successTip = '添加'
      fieldInfo.forEach(item => {
        fieldList.push({
          fieldNameCn: item.fieldNameCn,
          fieldNameEn: item.fieldNameEn,
          fieldType: item.fieldType
        })
      })
      this.mergeColLists.forEach(item => {
        let value = {
          leftTableField: item.leftItem,
          rightTableField: item.rightItem
        }
        if (item.id && item.mergeId) {
          value.id = item.id
          value.mergeId = item.mergeId
        }
        list.push(value)
      })
      let params = {
        containerId: +this.editModuleInfo.i,
        fieldList,
        leftTable: this.dataSourceInfo.tableName,
        list,
        mergeType: 'left',
        perRecordId: this.operaPerRecordId
      }
      if (this.tableResult.operaWay === 'kudu') {
        params.rightCsvUrl = ''
        params.rightDatabase = 'kudu'
        params.rightTable = this.tableResult.choiceData.tableName
        params.rightTableNameCn = ''
      } else if (this.tableResult.operaWay === 'csv') {
        params.rightCsvUrl = this.tableResult.uploadFileInfo.url
        params.rightDatabase = 'csv'
        params.rightTable = toPinYin(this.tableResult.uploadFileInfo.tableName)
        params.rightTableNameCn = this.tableResult.uploadFileInfo.tableName
      } else {
        params.rightCsvUrl = ''
        params.rightDatabase = 'container'
        params.rightTable = this.tableResult.moduleData.id
        params.rightTableNameCn = this.tableResult.moduleData.containerName
      }
      if (this.editInfo) {
        requestApi = updateModuleMergeApi
        successTip = '编辑'
        params.id = this.editInfo.id
        params.recordId = this.editInfo.recordId
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}左右合并成功！`)
        this.successOpera()
      })
    },
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_merge_wrap {
  width: 100%;
  height: 100%;
  .merge_list_wrap {
    width: 100%;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      line-height: 20px;
      color: var(--base-text-color-to-666666);
      margin-bottom: 12px;
      .tip {
        float: left;
      }
      .opera {
        color: var(--active-color);
        cursor: pointer;
      }
    }
    .list_item {
      display: flex;
      width: 100%;
      height: 68px;
      padding: 6px 12px;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      overflow-y: auto;
      .list_name {
        flex: none;
        font-size: 16px;
        line-height: 21px;
        color: var(--base-text-color-to-666666);
      }
      .list_field {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        .field {
          display: flex;
          font-size: 14px;
          line-height: 21px;
          color: var(--base-text-color-1);
          margin-right: 24px;
          i {
            font-size: 14px;
            color: var(--base-text-color-to-666666);
            margin-right: 4px;
          }
        }
      }
    }
  }
  .merge_way_wrap {
    display: flex;
    margin-bottom: 24px;
    .label {
      flex: none;
      margin-right: 12px;
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
    }
    /deep/.el-radio-group {
      display: flex;
      .el-radio {
        display: flex;
        align-items: center;
        color: var(--base-text-color-1);
        margin-right: 16px;
        .el-radio__label {
          font-size: 16px;
          line-height: 21px;
          padding-left: 8px;
        }
        .el-radio__inner {
          width: 16px;
          height: 16px;
          border-color: var(--base-text-color-to-666666);
          &:hover {
            border-color: var(--active-color);
          }
          &::after {
            background-color: var(--active-color);
          }
        }
        .el-radio__input.is-checked .el-radio__inner {
          border-color: var(--active-color);
        }
      }
    }
  }
  .merge_col_wrap {
    width: 100%;
    font-size: 16px;
    line-height: 21px;
    color: var(--base-text-color-to-666666);
    .tip {
      margin-bottom: 16px;
    }
    .list_info {
      display: flex;
      padding: 0 8px 0 16px;
      margin-bottom: 12px;
      .list {
        flex: 1;
        white-space: nowrap;
        font-size: 16px;
        line-height: 20px;
        color: var(--base-text-color-1);
        .tip {
          float: left;
          margin-right: 12px;
          margin-bottom: 0;
          color: var(--base-text-color-to-666666);
        }
      }
    }
    .col_info {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 8px 0 16px;
      margin-bottom: 12px;
      .col_select {
        width: calc((100% - 50px) / 2);
      }
      /deep/.sort_item {
        margin-right: 0;
      }
      .division {
        flex: none;
        font-size: 16px;
        margin: 0 8px;
      }
      i {
        flex: none;
        font-size: 16px;
        line-height: 16px;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .add_btn {
      width: 52px;
      font-size: 14px;
      line-height: 19px;
      color: var(--active-color);
      cursor: pointer;
      white-space: nowrap;
      padding: 0 8px 0 16px;
      i {
        font-size: 16px;
        color: var(--active-color);
        margin-right: 8px;
        float: left;
      }
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    .blank_button {
      margin-right: 16px;
    }
  }
  .up_way_wrap {
    display: flex;
    position: relative;
    top: -8px;
    margin-bottom: 8px;
    .way_item {
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-2);
      white-space: nowrap;
      padding: 0 20px 8px;
      border-bottom: 1px solid var(--border-color-2);
      cursor: pointer;
      &.active {
        color: var(--active-color);
        border-bottom-color: var(--active-color);
      }
    }
  }
  .common {
    flex: 1;
    height: 610px;
    background: var(--bg-color-2);
  }
  .right_table_field {
    padding: 10px 0;
    overflow-y: auto;
    .table_info {
      padding: 0 24px;
    }
    .field_info {
      padding-left: 48px;
      padding-right: 24px;
    }
    .item_info {
      display: flex;
      align-items: center;
      height: 32px;
      .checkbox {
        flex: none;
        position: relative;
        width: 16px;
        height: 16px;
        border: 1px solid var(--checkbox-border);
        border-radius: 2px;
        margin-right: 8px;
        cursor: pointer;
        &.active {
          background: var(--active-color);
          border: 1px solid var(--active-color);
          &::after {
            content: '';
            box-sizing: content-box;
            border: 1px solid #FFFFFF;
            border-left: 0;
            border-top: 0;
            height: 7px;
            width: 3px;
            transform: rotate(45deg) scaleY(1);
            position: absolute;
            top: 2px;
            left: 5px;
          }
        }
        &.indeterminate {
          background: var(--active-color);
          border: 1px solid var(--active-color);
          &::after {
            position: absolute;
            left: 3px;
            top: 7px;
            display: block;
            content: '';
            width: 8px;
            height: 1px;
            background: #FFFFFF;
          }
        }
      }
      i {
        font-size: 14px;
        line-height: 14px;
        color: var(--base-text-color-to-666666);
        margin-right: 4px;
      }
      .item_label {
        font-size: 14px;
        line-height: 20px;
        color: var(--base-text-color-1);
      }
    }
  }
  .module_source_wrap {
    display: flex;
    width: 100%;
    .module_list {
      margin-right: 16px;
      /deep/.el-tree {
        height: calc(100% - 32px);
        margin-top: 16px;
        overflow-y: auto;
        .el-tree__empty-text {
          color: var(--base-text-color-to-666666);
        }
      }
    }
  }
  .table_wrap {
    display: flex;
    .left_table {
      margin-right: 16px;
      /deep/.el-input {
        width: calc(100% - 48px);
        margin: 14px 24px 0;
        .el-input__inner {
          height: 26px;
          line-height: 26px;
          font-size: 14px;
          border: 0;
          border-bottom: 1px solid;
          border-color: var(--border-color-input);
          &::placeholder {
            font-size: 14px;
          }
          &:hover {
            border-color: var(--border-color-input-hover);
          }
        }
        .icon-sousuo {
          font-size: 14px;
          line-height: 26px;
          color: var(--base-text-color-to-666666);
          cursor: pointer;
        }
      }
      .record_wrap {
        height: calc(100% - 32px);
        margin-top: 16px;
        overflow-y: auto;
        .record_item {
          width: 100%;
          font-size: 14px;
          line-height: 32px;
          color: var(--base-text-color-1);
          padding: 0 24px;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            background: var(--record-library-tree);
          }
          &.is_choice {
            background: var(--record-library-tree);
          }
        }
      }
    }
  }
  .upload_wrap {
    width: 650px;
    height: 368px;
    background: var(--app-upload-bg);
    border: 1px dashed var(--app-upload-border);
    border-radius: 8px;
  }
  .upload_window {
    width: 100%;
    height: 100%;
    /deep/.el-upload {
      width: 100%;
      height: 100%;
    }
    /deep/.el-upload-dragger {
      height: 368px;
      border-color: rgba(61, 110, 255, 0.56);
      border-radius: 0;
    }
    .upload_tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .upload_text {
      display: flex;
      font-size: 18px;
      line-height: 24px;
      color: var(--active-color);
      margin-bottom: 16px;
      div {
        color: var(--active-color);
        margin-right: 6px;
      }
    }
    .text_tip {
      font-size: 14px;
      line-height: 19px;
      color: var(--base-text-color-to-666666);
    }
  }
  .upload_result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .file_info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(100% - 32px);
      .file_type {
        position: relative;
        margin-bottom: 8px;
        img {
          width: 80px;
          height: 80px;
        }
        &::after {
          display: block;
          content: 'CSV';
          position: absolute;
          top: 34px;
          left: 14px;
          width: 36px;
          height: 21px;
          font-size: 14px;
          line-height: 21px;
          white-space: nowrap;
          text-align: center;
          color: var(--base-text-color-2);
          border-radius: 2px;
          background: #FFFFFF;
        }
      }
      .file_name {
        width: 100%;
        text-align: center;
        font-size: 14px;
        line-height: 19px;
        color: var(--base-text-color-to-666666);
      }
    }
    .upload_data_name {
      display: flex;
      margin-top: 32px;
      .label {
        font-size: 18px;
        line-height: 32px;
        margin-top: 6px;
        color: var(--base-text-color-1);
      }
      /deep/.el-input {
        width: 240px;
        .el-input__inner {
          font-size: 18px;
          border-width: 0;
          border-bottom-width: 1px;
          padding: 0;
        }
      }
    }
  }
  .is_error {
    /deep/.el-select {
      .el-input__inner {
        border-color: var(--border-color-input-error) !important;
        color: #FF106E;
      }
    }
  }
}
/deep/.el-tree {
  padding: 0 18px;
}
.custom-tree-node {
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .em-tree-text {
    display: inline-block; //block一样
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
  }
}
/deep/.el-tree .el-tree-node.is-current > .el-tree-node__content,
/deep/.el-tree .el-tree-node__content:hover {
  background: transparent;
}
/deep/.el-tree .el-tree-node__content {
  height: auto;
  min-height: 32px;
}
/deep/.el-tree .el-tree-node__children {
  .el-tree-node__content .el-checkbox.is-disabled {
    display: inline-block;
    .el-checkbox__inner {
      display: inline-block;
      background: transparent;
    }
  }
}
</style>
