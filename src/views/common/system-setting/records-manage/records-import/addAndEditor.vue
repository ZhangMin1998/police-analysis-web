<template>
<div class='add_and_editor'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='cancelOpera'></OperaHeader>
  <div
    class='wrap_content'
    v-p-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="loadingBg"
  >
    <el-form :model="form" ref="form" :rules='rules'>
      <div class='import_base_info'>
        <el-form-item prop="dataName" label="数据名称：">
          <el-input
            :class='{ "no_submit": dataNRepeat }'
            v-model.trim="form.dataName"
            placeholder='请输入'
            :maxlength='7'
            @change='changeName'
          ></el-input>
          <div v-if='dataNRepeat' class='name_repeat'>"数据名称"已存在</div>
        </el-form-item>
        <el-form-item prop="tableName" label="表名称：">
          <el-input
            :class='{ "no_submit": tableNRepeat }'
            v-model.trim="form.tableName"
            placeholder='请输入'
            :disabled='isEditor'
            @input='isChi'
            @change='changeTable'
          ></el-input>
          <div v-if='tableNRepeat' class='name_repeat'>"表名称"已存在</div>
        </el-form-item>
        <el-form-item prop="fileType" label="文件格式：">
          <el-select v-model="form.fileType" placeholder="请选择">
            <el-option label="csv" :value="'csv'"></el-option>
            <el-option label="zip" :value="'zip'"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class='import_opera'>
        <div class='btn'>
          <div class='opera' @click='addItem'>
            <i class='iconfont icon-tianjia'></i>
            <div class='tip'>添加</div>
          </div>
          <div class='opera' @click='delItem'>
            <i class='iconfont icon-shanchu'></i>
            <div class='tip'>删除</div>
          </div>
          <el-upload
            :action="'#'"
            :http-request="uploadRequest"
            accept='.sql'
            :multiple="false"
            :auto-upload="true"
            :on-error="unError"
            :show-file-list="false">
            <div id='upload'>
            </div>
          </el-upload>
          <div class='opera' @click='importSql'>
            <i class='iconfont icon-daoru'></i>
            <div class='tip'>导入SQL</div>
          </div>
        </div>
        <div class='import_tip'>
          <i class='iconfont icon-zhushi'></i>
          <div>”中文名“和“字段名”命名不可重复或为空</div>
        </div>
      </div>
      <div class='import_item_table'>
        <div class='item_table_header'>
          <div class='item' :style='{ "min-width": "7.462%" }'>
            <div class='checkbox' :class='{ "active": isCheckAll }' @click='checkAll'></div>
            <div class='label'>序号</div>
          </div>
          <div
            class='item'
            v-for='(value, key) in tableColumns'
            :key='key'
            :style='{ "min-width": value.width }'
          >
            <div class='label'>{{ value.label }}</div>
          </div>
        </div>
        <div class='item_table_content' id='table_content'>
          <div :id='`content_row_${index}`' class='content_row' v-for='(item, index) in form.itemList' :key='index'>
            <div class='content content_index' :style='{ "min-width": "7.462%" }'>
              <div class='checkbox' :class='{ "active": item.isCheck }' @click='checkItem(item)'></div>
              <div class='value'>{{ index + 1 }}</div>
            </div>
            <div class='content' :style='{ "min-width": tableColumns.chiName.width }'>
              <div
                :class='{
                  "is_repeat": item.chiName.isRepeat,
                  "no_input": true,
                  "no_value": !item.chiName.value,
                  "is_empty": haveEmpty && index < haveEmpty && !item.chiName.value
                }'
                v-show='!item.chiName.isFocus'
                @click='changeInput(item, "chiName")'>
                <div class='input_value'>{{ item.chiName.value ? item.chiName.value : '请输入' }}</div>
              </div>
              <el-input
                v-show='item.chiName.isFocus'
                :class='{
                  "is_repeat": item.chiName.isRepeat,
                  "is_empty": haveEmpty && index < haveEmpty && !item.chiName.value
                }'
                placeholder='请输入'
                v-model.trim='item.chiName.value'
                @blur='haveRepeat(item, "chiName")'
              ></el-input>
            </div>
            <div class='content' :style='{ "min-width": tableColumns.itemName.width }'>
              <div
                :class='{
                  "is_repeat": item.itemName.isRepeat || item.itemName.isKeyword || isAllNumber(item.itemName.value),
                  "no_input": true,
                  "no_value" : !item.itemName.value,
                  "item_name": true,
                  "is_empty": haveEmpty && index < haveEmpty && (!item.itemName.value || item.itemName.value === "create_time")
                }'
                v-show='!item.itemName.isFocus'
                @click='changeInput(item, "itemName")'>
                <div class='input_value'>{{ item.itemName.value ? item.itemName.value : '仅支持数字、小写字母、下划线' }}</div>
              </div>
              <el-input
                v-show='item.itemName.isFocus'
                :class='{
                  "is_repeat": item.itemName.isRepeat || item.itemName.isKeyword || isAllNumber(item.itemName.value),
                  "is_empty": haveEmpty && index < haveEmpty && (!item.itemName.value || item.itemName.value === "create_time")
                }'
                placeholder='仅支持数字、小写字母、下划线'
                v-model.trim='item.itemName.value'
                @blur='haveRepeat(item, "itemName")'
                @input='isEng(item)'
              ></el-input>
            </div>
            <div class='content' :style='{ "min-width": tableColumns.itemType.width }'>
              <el-cascader
                v-model="item.itemType"
                :options="options"
                :props="{ expandTrigger: 'hover', label: 'typeCn' }"
                :separator='"："'
                :class='{ "is_empty": haveEmpty && index < haveEmpty && !item.itemType }'
                @change="(value) => choiceType(value, item)"
              ></el-cascader>
<!--              <el-select
                v-model='item.itemType'
                placeholder="请选择"
                filterable
                :filter-method='optionsFilter'
                :class='{ "is_empty": haveEmpty && index < haveEmpty && !item.itemType }'
                @visible-change='isFilterOpt = ""'
              >
                <div class='type_list' v-for='(value, key) in typeOptions' :key='key'>
                  <div class='entity_name'>{{ key }}</div>
                  <el-option
                    v-for="(opt) in value"
                    :key="opt.entityLabelId || opt.typeEn"
                    :label="`${key}：${opt.typeCn}`"
                    @click.native='choiceType(item, key)'
                    :value="key !== '其他' ? opt.entityLabelId : opt.typeEn">
                    <span>{{ opt.typeCn }}</span>
                  </el-option>
                </div>
              </el-select>-->
            </div>
            <div class='content partition' :style='{ "min-width": tableColumns.timePartition.width }'>
              <div
                class='checkbox'
                :class='{
                  "active": item.timePartition,
                  "no_click": ((isTimePartition || !timeTypeList.includes(item.itemType)) && !item.timePartition) || item.hashPartition
                }'
                @click='timeCheck(item)'
              ></div>
            </div>
            <div class='content time_range' :style='{ "min-width": tableColumns.partitionRange.width }'>
              <el-select
                v-model="item.partitionRange"
                placeholder="请选择"
                :disabled='!item.timePartition'
              >
                <el-option
                  v-for="item in timeRangeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class='content partition' :style='{ "min-width": tableColumns.hashPartition.width }'>
              <div
                class='checkbox'
                :class='{
                  "active": item.hashPartition,
                  "no_click": (isHashPartition && !item.hashPartition) || item.timePartition
                }'
                @click='hashCheck(item)'
              ></div>
            </div>
            <div class='content' :style='{ "min-width": tableColumns.partitionNumber.width }'>
              <el-input
                placeholder='请输入'
                v-model.trim='item.partitionNumber'
                @input='(value) => hashNumber(item, value)'
                :disabled='!item.hashPartition'
                :class='{ "is_repeat": item.hashPartition && !item.partitionNumber }'
              ></el-input>
            </div>

            <div class='content' :style='{ "min-width": tableColumns.isKey.width }'>
              <div
                class='key_input'
                @click='setPrimaryKey(item)'
                :class='{
                  "no_click": item.timePartition || item.hashPartition
                }'
              >
                <i class='iconfont icon-yuechi' v-show='item.isKey'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class='floor'>
<!--      <div class='total'>{{ `总数：${total}` }}</div>-->
      <div class='opera_btn'>
        <div class='blank_button' @click='cancelOpera'>取消</div>
        <el-button type="primary" @click='submit'>提交</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import { recImpCreate, recImpUpdate, getRecImpType, recImpUploadSql } from '@/api/sysSetting'
import { validate, sqlKeyword } from './config.js'
export default {
  name: 'AddAndEditor',
  components: {
    OperaHeader
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    isGetDetail: {
      type: Boolean,
      default: false
    },
    isHandler: {
      type: Boolean,
      default: false
    },
  },
  data () {
    const TABLE_COLUMNS = {
      chiName: { label: '中文名', width: '16.949%' },
      itemName: { label: '字段名', width: '18.109%' },
      itemType: { label: '类型', width: '15.275%' },
      timePartition: { label: '时间分区', width: '7%' },
      partitionRange: { label: '时间分区类型', width: '10%' },
      hashPartition: { label: '哈希分区', width: '7%' },
      partitionNumber: { label: '哈希分区数', width: '10%' },
      isKey: { label: '主键', width: '8.203%' },
    }
    const TIME_RANGE = [
      { label: '天', value: 'day' },
      { label: '周', value: 'week' },
      { label: '月', value: 'month' },
      { label: '季度', value: 'season' },
      { label: '半年', value: 'halfOfYear' },
      { label: '年', value: 'year' }
    ]
    return {
      tableColumns: Object.freeze(TABLE_COLUMNS),
      timeRangeOptions: Object.freeze(TIME_RANGE),
      options: [], // 字段类型标签数据
      form: {
        dataName: '',
        tableName: '',
        fileType: '',
        itemList: [
          {
            chiName: { isFocus: false, isRepeat: false, value: '', oldValue: '' },
            itemName: { isFocus: false, isRepeat: false, isKeyword: false, value: '', oldValue: '' },
            itemType: '',
            timePartition: false,
            partitionRange: '',
            hashPartition: false,
            partitionNumber: '',
            isKey: false,
            isCheck: false,
            typeOther: true
          }
        ]
      },
      rules: {
        dataName: [
          { required: true, message: '数据名称不可为空', trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: '表名称不可为空', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        fileType: [
          { required: true, message: '文件格式不可为空', trigger: 'change' }
        ],
      },
      loading: false,
      loadingText: '提交中',
      loadingBg: '--loading-color-1',
      haveEmpty: 0, // 提交时，是否有字段数据为空
      defaultType: '', // 默认的字段类型
      dataNRepeat: false, // 提交时判断数据名称是否重复
      tableNRepeat: false, // 提交时判断表名称是否重复
      breadcrumbList: [
        { tabName: '数据导入', canOpera: true }
      ],
      isFilterOpt: '',
      typeOptIdList: [],
      successGetType: false,
      timeTypeList: []
    }
  },

  watch: {
    isSuccess: {
      handler (newVal) {
        if (newVal && this.row.id) {
          this.form.dataName = this.row.srcNameCn
          this.form.tableName = this.row.srcNameEn
          this.form.fileType = this.row.fileType || ''
          let fileRules = []
          this.row.fileRules.forEach(item => {
            let obj = {}
            obj.chiName = { isFocus: false, isRepeat: false, value: item.fieldNameCn, oldValue: item.fieldNameCn }
            obj.itemName = { isFocus: false, isRepeat: false, isKeyword: sqlKeyword.includes(item.fieldNameEn.toUpperCase()), value: item.fieldNameEn, oldValue: item.fieldNameEn }
            obj.isKey = item.mainField
            obj.isCheck = false
            obj.id = item.id
            obj.timePartition = item.timePartition || false
            obj.hashPartition = item.hashPartition || false
            obj.partitionNumber = item.partitionNumber || ''
            obj.partitionRange = item.partitionRange || ''
            if (!item.entityLabelId) {
              obj.itemType = item.attrType
              obj.typeOther = true
            } else {
              if (this.typeOptIdList.includes(+item.entityLabelId)) {
                obj.itemType = item.entityLabelId
                obj.typeOther = false
              } else {
                obj.itemType = this.defaultType
                obj.typeOther = true
              }
            }
            fileRules.push(obj)
          })
          this.form.itemList = fileRules
        }
        if (newVal) {
          this.loading = false
          this.loadingText = '提交中'
          this.loadingBg = '--loading-color-1'
        }
      }
    },
    isGetDetail: {
      handler (newVal) {
        if (newVal && this.isHandler) {
          this.getType()
          this.breadcrumbList = [
            ...this.breadcrumbList,
            ...[
              { tabName: this.row.srcNameCn || '' },
              { tabName: '编辑' }
            ]
          ]
        }
      }
    }
  },
  computed: {
    isTimePartition () {
      return this.form.itemList.length && this.form.itemList.some(item => item.timePartition)
    },
    isHashPartition () {
      return this.form.itemList.length && this.form.itemList.some(item => item.hashPartition)
    },
    // 是否选中全部
    isCheckAll () {
      return this.form.itemList.length && this.form.itemList.every(item => item.isCheck)
    },
    // 统计总数
    // total () {
    //   return this.form.itemList.length
    // },
    // 判断是否为编辑
    isEditor () {
      return this.row && !!this.row.id
    },
    isSuccess () {
      return this.isGetDetail && this.successGetType
    }
    // typeOptions () {
    //   if (this.isFilterOpt) {
    //     let result = {}
    //     for (let key in this.options) {
    //       let arr = []
    //       this.options[key].forEach(item => {
    //         if (item.typeCn.includes(this.isFilterOpt)) {
    //           arr.push(item)
    //         }
    //       })
    //       if (arr.length) {
    //         result[key] = arr
    //       }
    //     }
    //     return result
    //   } else {
    //     return this.options
    //   }
    // }
  },
  created () {
    if (!this.isHandler) {
      this.getType()
      this.breadcrumbList.push({ tabName: '新建' })
      this.form.fileType = 'csv'
    } else {
      this.loadingText = '数据加载中'
      this.loadingBg = '--bg-color-3'
      this.loading = true
    }
  },
  methods: {
    isAllNumber (value) {
      return /^[\d]+$/.test(value)
    },
    timeCheck (item) {
      if (((this.isTimePartition || !this.timeTypeList.includes(item.itemType)) && !item.timePartition) || item.hashPartition) return
      item.timePartition = !item.timePartition
      if (item.timePartition) {
        item.partitionRange = 'year'
      } else {
        item.partitionRange = ''
      }
      item.isKey = true
    },
    hashCheck (item) {
      if ((this.isHashPartition && !item.hashPartition) || item.timePartition) return
      item.hashPartition = !item.hashPartition
      item.isKey = true
      if (item.hashPartition) {
        item.partitionNumber = '10'
      } else {
        item.partitionNumber = ''
      }
    },
    hashNumber (item, value) {
      item.partitionNumber = value.replace(/\D/g, '')
    },
    optionsFilter (value) {
      this.isFilterOpt = value
    },
    choiceType (value, item) {
      if (value[0] !== '其他') {
        item.typeOther = false
      } else {
        item.typeOther = true
        if (value[1] === 'BOOLEAN') {
          item.isKey = false
        }
      }
      item.itemType = value[1]
      if (!this.timeTypeList.includes(item.itemType)) {
        item.timePartition = false
      }
      // if (key !== '其他') {
      //   item.typeOther = false
      // } else {
      //   item.typeOther = true
      // }
    },
    cancelOpera () {
      this.$emit("toList", "list", {}, true)
    },
    // 是否设置为主键
    setPrimaryKey (item) {
      if (item.timePartition || item.hashPartition) return
      if (item.itemType === 'BOOLEAN') {
        this.$message.warning('"BOOLEAN"不可设置为主键!')
      } else {
        item.isKey = !item.isKey
      }
    },
    // 数据名称发生修改的时候
    changeName () {
      this.dataNRepeat = false
    },
    // 表名称发生改变的时候
    changeTable () {
      this.tableNRepeat = false
    },
    // 获取字段类型标签数据
    getType () {
      getRecImpType({}, '.add_and_editor', !this.isHandler).then(res => {
        let result = res || {}
        // this.options = res
        for (let key in result) {
          result[key].forEach(item => {
            item.value = key !== '其他' ? item.entityLabelId : item.typeEn
            this.typeOptIdList.push(+item.entityLabelId)
          })
          this.options.push({
            typeCn: key,
            value: key,
            children: result[key]
          })
        }
        if (!this.row.id) {
          this.form.itemList[0].itemType = 'STRING'
        }
        let timeResult = result['时间'] || []
        this.timeTypeList = timeResult.map(item => item.entityLabelId)
        this.defaultType = 'STRING'
      }).finally(() => {
        this.successGetType = true
      })
    },
    // 判断输入的是否为数字和中文和字母
    isChi (value) {
      this.form.tableName = value.replace(/[A-Z.\u4E00-\u9FA5]/g, '').trim()
    },
    // 判断输入的内容是否为字母和下划线
    isEng (item) {
      item.itemName.value = item.itemName.value.replace(/[^a-z_\d]/g, '')
    },
    // 导入sql
    importSql (e) {
      let showTip = this.form.itemList.some(item => item.chiName.value || item.itemName.value || item.isKey)
      if (showTip) {
        e.stopPropagation()
        this.$policeComfirm('此操作将覆盖当前表，您确定要继续操作吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          document.getElementById('upload').click()
        })
      } else {
        document.getElementById('upload').click()
      }
    },
    unError (fileList) {
      this.$message.error(fileList[0].msg)
    },
    // 导入SQL时的方法
    uploadRequest (file) {
      let uploadFile = new FormData()
      uploadFile.append('file', file.file)
      recImpUploadSql(uploadFile).then(res => {
        this.form.itemList = []
        if (!this.row.id) {
          this.form.tableName = res.srcNameEn
        }
        let itemObj = {
          chi: {},
          eng: {}
        }
        let itemList = []
        res.sqlFieldRuleParams.forEach((item, index) => {
          if (item.fieldComment) {
            if (itemObj.chi[item.fieldComment]) {
              itemObj.chi[item.fieldComment].push(index)
            } else {
              itemObj.chi[item.fieldComment] = [index]
            }
          }
          if (item.fieldName) {
            if (itemObj.eng[item.fieldName]) {
              itemObj.eng[item.fieldName].push(index)
            } else {
              itemObj.eng[item.fieldName] = [index]
            }
          }
        })
        res.sqlFieldRuleParams.forEach(item => {
          let obj = {}
          obj.chiName = {
            isFocus: false,
            isRepeat: item.fieldComment && itemObj.chi[item.fieldComment] && itemObj.chi[item.fieldComment].length > 1,
            value: item.fieldComment ? item.fieldComment : '',
            oldValue: item.fieldComment ? item.fieldComment : ''
          }
          obj.itemName = {
            isFocus: false,
            isRepeat: item.fieldName && itemObj.eng[item.fieldName] && itemObj.eng[item.fieldName].length > 1,
            value: item.fieldName ? item.fieldName : '',
            oldValue: item.fieldName ? item.fieldName : ''
          }
          obj.itemName.isKeyword = sqlKeyword.includes(obj.itemName.value.toUpperCase())
          obj.itemType = item.fieldType ? item.fieldType : ''
          obj.isKey = res.mainFileds.includes(item.fieldName)
          obj.isCheck = false
          obj.typeOther = true
          obj.timePartition = false
          obj.hashPartition = false
          obj.partitionNumber = ''
          obj.partitionRange = ''
          itemList.push(obj)
        })
        this.form.itemList = itemList
      })
    },
    // 添加字段
    addItem () {
      this.form.itemList.push({
        chiName: { isFocus: false, isRepeat: false, value: '', oldValue: '' },
        itemName: { isFocus: false, isRepeat: false, isKeyword: false, value: '', oldValue: '' },
        itemType: this.defaultType,
        timePartition: false,
        partitionRange: '',
        hashPartition: false,
        partitionNumber: '',
        isKey: false,
        isCheck: false,
        typeOther: true
      })
      if (document.getElementById('table_content').scrollHeight > document.getElementById('table_content').clientHeight) {
        this.$nextTick(() => {
          document.getElementById(`content_row_${this.form.itemList.length - 1}`).scrollIntoView()
        })
      }
    },
    // 删除字段
    delItem () {
      if (this.isCheckAll) {
        this.form.itemList = []
        this.haveEmpty = 0
      } else if (this.form.itemList.some(item => item.isCheck)) {
        let itemObj = {
          chi: {},
          eng: {}
        }
        this.form.itemList = this.form.itemList.filter(item => {
          if (!item.isCheck) {
            if (item.chiName.value) {
              if (itemObj.chi[item.chiName.value]) {
                itemObj.chi[item.chiName.value] += 1
              } else {
                itemObj.chi[item.chiName.value] = 1
              }
            }
            if (item.itemName.value) {
              if (itemObj.eng[item.itemName.value]) {
                itemObj.eng[item.itemName.value] += 1
              } else {
                itemObj.eng[item.itemName.value] = 1
              }
            }
          }
          return !item.isCheck
        })
        this.form.itemList.forEach(item => {
          item.chiName.isRepeat = item.chiName.value && itemObj.chi[item.chiName.value] && itemObj.chi[item.chiName.value] > 1
          item.itemName.isRepeat = item.itemName.value && itemObj.eng[item.itemName.value] && itemObj.eng[item.itemName.value] > 1
        })
      } else {
        this.$message.warning('请选择字段！')
      }
    },
    // 当行数据的选择
    checkItem (item) {
      item.isCheck = !item.isCheck
    },
    // 全选
    checkAll () {
      let check = !this.isCheckAll
      this.form.itemList.forEach(item => {
        item.isCheck = check
      })
    },
    // 第一次点击时输入框显示
    changeInput (item, check) {
      this.form.itemList.forEach(info => {
        info.chiName.isFocus = false
        info.itemName.isFocus = false
      })
      item[check].isFocus = true
    },
    // 判断是否有重复
    haveRepeat (item, opera) {
      if (opera === 'itemName') {
        if (sqlKeyword.includes(item.itemName.value.toUpperCase())) {
          item.itemName.isKeyword = true
        } else {
          item.itemName.isKeyword = false
        }
      }
      if (item[opera].value === item[opera].oldValue) return
      if (item[opera].isRepeat && item[opera].oldValue) {
        let oldIndex = []
        this.form.itemList.forEach((info, ind) => {
          if (info[opera].value === item[opera].oldValue) {
            oldIndex.push(ind)
          }
        })
        if (oldIndex.length === 1) {
          this.form.itemList[oldIndex[0]][opera].isRepeat = false
        }
      }
      if (item[opera].value) {
        let filterIndex = []
        this.form.itemList.forEach((info, ind) => {
          if (info[opera].value === item[opera].value) {
            filterIndex.push(ind)
          }
        })
        if (filterIndex.length > 1) {
          filterIndex.forEach(info => {
            this.form.itemList[info][opera].isRepeat = true
          })
        } else {
          item[opera].isRepeat = false
        }
      } else {
        item[opera].isRepeat = false
      }
      item[opera].oldValue = item[opera].value
    },
    submit () {
      this.haveEmpty = 0
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.itemList.length) {
            this.$policeComfirm('表不可为空！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          for (let index = 0; index < this.form.itemList.length; index++) {
            if (
              !this.form.itemList[index].chiName.value ||
              !this.form.itemList[index].itemName.value ||
              !this.form.itemList[index].itemType
            ) {
              this.$policeComfirm('请将表信息补充完整！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              this.haveEmpty = this.form.itemList.length
              return
            }
            if (this.isAllNumber(this.form.itemList[index].itemName.value)) {
              this.$policeComfirm('字段名不可全为数字！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              return
            }
            if (this.form.itemList[index].itemName.value === 'create_time') {
              this.$policeComfirm('字段名不可为“create_time”,请修改后重试！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              this.haveEmpty = this.form.itemList.length
              return
            }
          }
          let isRepeat = this.form.itemList.every(item => !item.chiName.isRepeat && !item.itemName.isRepeat)
          if (!isRepeat) {
            this.$policeComfirm('“中文名”或“字段名”存在重复，请检查后重试！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          if (this.form.itemList.some(item => item.itemName.isKeyword)) {
            this.$policeComfirm('“字段名”存在与数据库保留字段相同，请更改后重试！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          if (this.isHashPartition) {
            let ind = this.form.itemList.findIndex(item => item.hashPartition)
            if (!this.form.itemList[ind].partitionNumber) {
              this.$policeComfirm('“哈希分区数”不可为空！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              return
            }
          }
          let keySuccess = true
          let isKeyList = this.form.itemList.filter(item => item.isKey)
          if (isKeyList.length) keySuccess = false
          isKeyList.forEach(item => {
            if (!this.timeTypeList.includes(item.itemType) && item.itemType !== 'INT') {
              keySuccess = true
            }
          })
          if (!keySuccess) {
            this.$policeComfirm('“至少存在一个非日期、时间戳、INT类型的主键', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }

          let formatParams = () => {
            let params = {}
            let fileRules = []
            if (this.row && this.row.id) {
              params.id = this.row.id
            } else {
              params.urlPath = 'from-record-import'
              params.component = 'common/data-center/from-record-import'
              params.pathName = 'from-record-import'
              params.meta = JSON.stringify({
                common: true,
                hidden: false,
                belong: '',
                icon: 'icon-WIFIredian'
              })
            }
            params.dataName = this.form.dataName
            params.tableName = this.form.tableName
            params.fileType = this.form.fileType
            this.form.itemList.forEach((item, index) => {
              let obj = {}
              obj['fieldNameEn'] = item.itemName.value
              obj['fieldNameCn'] = item.chiName.value
              obj['mainField'] = item.isKey
              obj['id'] = item.id
              obj['fieldSort'] = index
              obj['timePartition'] = item.timePartition
              obj['partitionRange'] = item.partitionRange
              obj['hashPartition'] = item.hashPartition
              obj['partitionNumber'] = item.partitionNumber
              if (item.typeOther) {
                obj['fieldType'] = item.itemType
              } else {
                obj['entityLabelId'] = item.itemType
              }
              // fileRules[index + ''] = obj
              fileRules.push(obj)
            })
            params.fileRules = JSON.parse(JSON.stringify(fileRules))
            return params
          }
          let params = formatParams()
          let requestApi = params.id ? recImpUpdate : recImpCreate
          let fun = (message, startPage) => {
            this.loading = true
            requestApi(params).then(() => {
              // if (res) {
              //   this.$message.success(params.id ? '修改成功' : '新建成功')
              //   this.loading = false
              //   this.$emit('toList', "list", {}, params.id ? true : false)
              // } else {
              //   this.loading = false
              // }
              this.$message.success(message)
              this.loading = false
              this.$emit('toList', "list", {}, startPage)
            }).catch((error) => {
              if (error.message === '"表名称"已存在') {
                this.tableNRepeat = true
              } else if (error.message === '"数据名称"已存在') {
                this.dataNRepeat = true
              }
              this.loading = false
            })
          }
          if (params.id) {
            this.$policeComfirm('修改前，请删除该数据表！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              fun('修改成功！', true)
            })
          } else {
            fun('新建成功！', false)
          }
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.add_and_editor {
  height: 100%;
  .wrap_content {
    height: calc(100% - 52px);
    padding: 24px;
    background: var(--bg-color-3);
    margin-top: 1px;
    /deep/.el-form {
      display: flex;
      flex-direction: column;
      height: calc(100% - 56px);
      .import_base_info {
        display: flex;
        flex: none;
        .el-form-item {
          display: flex;
          margin-right: 80px;
          &:last-child {
            margin-right: 0;
          }
          .el-form-item__label {
            color: var(--base-text-color-to-999999);
            font-size: 16px;
            &::before {
              display: none;
            }
          }
          .el-form-item__content {
            line-height: 38px;
            .el-select {
              .el-input__inner {
                height: 40px;
              }
            }
            .el-input {
              width: 400px;
              .el-input__inner {
                border: 1px solid var(--border-color-input) !important;
                border-radius: 2px;
                padding: 0 12px;
                line-height: 38px;
                &::placeholder {
                  font-size: 16px;
                  color: var(--input-placehold-color);
                }
              }
              &.no_submit {
                .el-input__inner {
                  border-color: var(--border-color-input-error) !important;
                }
              }
            }
            .name_repeat {
              position: absolute;
              font-size: 12px;
              color: @font-color-4;
              line-height: 12px;
              padding-top: 4px;
            }
            .el-form-item__error {
              color: @font-color-4;
            }
          }
          &.is-error {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  border-color: var(--border-color-input-error) !important;
                }
              }
            }
          }
        }
      }
      .import_opera {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 14px;
        line-height: 19px;
        color: var(--active-color);
        flex: none;
        .btn {
          display: flex;
        }
        .import_tip {
          display: flex;
          align-items: center;
          i {
            font-size: 16px;
            color: #5E86FF;
            margin-right: 4px;
          }
          div {
            color: var(--input-placehold-color);
          }
        }
        .opera {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-right: 24px;
          i {
            font-size: 16px;
            color: var(--active-color);
            margin-right: 8px;
          }
        }
      }
      .import_item_table {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: calc(100% - 92px);
        .item_table_header {
          display: flex;
          padding: 12px 22px;
          background: var(--table-head-bg-color);
          flex: none;
          .item {
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 24px;
            color: var(--base-text-color-to-999999);
            padding: 0 18px;
            border-right: 1px solid var(--table-row-border-bottom-color);
            &:last-child {
              border-right: 0;
            }
          }
        }
        .item_table_content {
          flex: 1;
          height: calc(100% - 48px);
          overflow-y: auto;
          .content_row {
            display: flex;
            padding: 8px 22px;
            background: transparent;
            border-bottom: 1px solid var(--table-row-border-bottom-color);
            .content {
              display: flex;
              align-items: center;
              padding: 0 6px;
              font-size: 16px;
              line-height: 32px;
              color: var(--base-text-color-1);
              .no_input {
                width: calc(100% - 28px);
                height: 32px;
                padding: 0 12px;
                border: 1px solid var(--border-color-input);
                border-radius: 2px;
                cursor: pointer;
                &:hover {
                  border-color: var(--border-color-input-hover);
                }
                .input_value {
                  white-space: nowrap;
                  overflow-x: hidden;
                }
                &.is_repeat {
                  border-color: var(--border-color-input-error);
                  color: @font-color-4;
                }
                &.item_name {
                  line-height: 30px;
                }
                &.no_value {
                  color: var(--input-placehold-color);
                  line-height: 30px;
                }
                &.is_empty {
                  border-color: var(--border-color-input-error);
                }
              }
              .el-input {
                width: calc(100% - 28px);
                height: 32px;
                .el-input__inner {
                  border-radius: 2px;
                  border-color: var(--border-color-input-hover) !important;
                  padding: 0 12px;
                  height: 32px;
                  line-height: 32px;
                  font-size: 16px;
                }
                &.is_repeat {
                  .el-input__inner {
                    border-color: var(--border-color-input-error) !important;
                    color: #FF106E !important;
                  }
                }
                &.is_empty {
                  .el-input__inner {
                    border-color: var(--border-color-input-error) !important;
                  }
                }
              }
              .el-select {
                width: calc(100% - 60px);
                .el-input {
                  width: 100%;
                  .el-input__inner {
                    border-color: var(--border-color-input) !important;
                    &:hover {
                      border-color: var(--border-color-input-hover) !important;
                    }
                  }
                  .el-input__suffix {
                    height: 30px;
                    .el-select__caret {
                      height: 30px;
                      line-height: 30px;
                    }
                  }
                }
                &.is_empty {
                  .el-input {
                    .el-input__inner {
                      border-color: var(--border-color-input-error) !important;
                    }
                  }
                }
              }
              .el-cascader {
                line-height: 28px;
                &.is_empty {
                  .el-input {
                    .el-input__inner {
                      border-color: rgba(255, 16, 110, .4) !important;
                    }
                  }
                }
                .el-input__suffix {
                  height: 30px;
                }
              }
              .key_input {
                width: 136px;
                height: 32px;
                padding: 0 12px;
                border: 1px solid var(--border-color-input);
                border-radius: 2px;
                cursor: pointer;
                &:hover {
                  border-color: var(--border-color-input-hover);
                }
                i {
                  font-size: 16px;
                  color: var(--active-color);
                }
                &.no_click {
                  cursor: not-allowed;
                }
              }
            }
            .partition {
              padding: 0 18px;
            }
            .time_range {
              .el-select {
                width: calc(100% - 30px);
              }
            }
            .partition {
              padding: 0 18px;
            }
            .content_index {
              padding: 0 18px;
            }
          }
        }
        .checkbox {
          position: relative;
          width: 16px;
          height: 16px;
          border: 1px solid var(--checkbox-border);
          border-radius: 2px;
          margin-right: 12px;
          cursor: pointer;
          &.no_click {
            cursor: not-allowed;
          }
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
        }
      }
    }
    .floor {
      display: flex;
      justify-content: flex-end;
      font-size: 16px;
      line-height: 32px;
      color: var(--base-text-color-to-999999);
      margin-top: 24px;
      .opera_btn {
        display: flex;
        .blank_button {
          margin-right: 16px;
        }
      }
    }
  }
}
.type_list {
  .entity_name {
    font-size: 14px;
    line-height: 31px;
    border-bottom: 1px solid rgba(81, 92, 124, 0.4);
    margin: 0 10px;
  }
}
</style>
