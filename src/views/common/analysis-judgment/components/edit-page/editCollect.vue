<template>
<div class='edit_collect_wrap'>
  <el-form ref='form' :rules='rules' :model="form" label-position='left' :label-width="getWidth()">
    <el-form-item label="列名称：" prop="colName">
      <el-input v-model.trim="form.colName" placeholder="请输入列名称" maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="分组字段：" prop="groupColumn">
      <el-select
        v-model="form.groupColumn"
        placeholder="请选择"
        multiple
        collapse-tags
      >
        <el-option
          v-for='item in fieldOptions'
          :key='item.value'
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="汇总列：" prop='collectCol'>
      <EditSelect
        :modelValue.sync='form.collectCol'
        :options='collectColOptions'
        :clearable='true'
        @handleItem='changeItem'
      ></EditSelect>
    </el-form-item>
    <el-form-item label="汇总方式：" prop='collectWay'>
      <el-select v-model="form.collectWay" placeholder="请选择汇总方式" :class='{ "is_error": collectWayError }'>
        <el-option
          v-for='item in collectWayOptions'
          :key='item.value'
          :label="item.label"
          :value="item.value"
          :disabled='item.disable'
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='closeDialog'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import EditSelect from './editSelect.vue'
import {
  addModuleCollectApi,
  updateModuleCollectApi
} from '@/api/analysisJudgment'
import { toPinYin } from './config.js'

export default {
  name: 'EditCollect',
  components: {
    EditSelect
  },
  inject: [
    'successOpera',
    'closeDialog',
    'editModuleInfo',
  ],
  props: {
    canEditField: {
      type: Array,
      default: () => []
    },
    // 编辑汇总信息
    editInfo: {
      type: Object
    },
    operaPerRecordId: {
      type: Number
    }
  },
  data () {
    return {
      fieldOptions: [], // 全部字段的可选项的选项
      form: {
        colName: '',
        collectCol: '',
        collectColType: '',
        collectWay: '',
        groupColumn: []
      }, // 汇总表单信息
      rules: {
        colName: [
          { required: true, message: '列名称不可为空', trigger: 'change' }
        ],
        collectCol: [
          { required: false, message: '汇总列不可为空', trigger: 'change' }
        ],
        collectWay: [
          { required: true, message: '汇总方式不可为空', trigger: 'change' }
        ],
        groupColumn: [
          { required: true, message: '分组字段不可为空', trigger: 'change' }
        ]
      },
      collectWayOptions: [
        { label: '计数', value: 'count', disable: false },
        { label: '求和', value: 'sum', disable: false }
      ], // 汇总方式的选项
    }
  },
  computed: {
    collectWayError () {
      return this.form.collectColType && this.form.collectColType !== 'number' && this.form.collectWay === 'sum'
    },
    collectColOptions () {
      if (this.form.collectWay === 'sum') {
        return this.fieldOptions.filter(item => item.fieldType === 'BIGINT')
      }
      return this.fieldOptions
    }
  },
  watch: {
    'form.collectColType': {
      handler (newVal) {
        this.collectWayOptions[1].disable = newVal !== 'number'
      }
    },
    'form.collectWay': {
      handler (newVal) {
        if (newVal === 'sum') {
          this.rules['collectCol'][0].required = true
        } else {
          this.rules['collectCol'][0].required = false
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.fieldOptions = this.canEditField.filter(item => item.type)
    if (this.editInfo) {
      this.form.colName = this.editInfo.aggregateFieldCn
      this.form.collectCol = this.editInfo.aggregateColumn
      this.form.collectWay = this.editInfo.aggregateType
      this.form.groupColumn = this.editInfo.groupColumns.split(',')
      const collectColInd = this.fieldOptions.findIndex(item => item.value === this.editInfo.aggregateColumn)
      collectColInd > -1 && (this.form.collectColType = this.fieldOptions[collectColInd].type)
    }
  },
  methods: {
    getWidth (){
      return document.body.clientWidth>1300?'92px':'62px'
    },
    // 汇总列选项点击时
    changeItem (opt) {
      this.form.collectColType = opt.type
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.collectWayError) {
            this.$message.error('汇总方式有误！')
            return
          }
          let requestApi = addModuleCollectApi
          let successTip = '添加'
          let params = {
            containerId: +this.editModuleInfo.i,
            aggregateFieldCn: this.form.colName,
            aggregateColumn: this.form.collectCol,
            aggregateType: this.form.collectWay,
            groupColumns: this.form.groupColumn.join(','),
            perRecordId: this.operaPerRecordId
          }
          if (this.editInfo) {
            requestApi = updateModuleCollectApi
            successTip = '编辑'
            params.id = this.editInfo.id
            params.aggregateFieldEn = this.editInfo.aggregateFieldEn
            params.recordId = this.editInfo.recordId
          } else {
            params.aggregateFieldEn = toPinYin(this.form.colName)
          }
          requestApi(params).then(() => {
            this.$message.success(`${successTip}汇总成功！`)
            this.successOpera()
          })
        }
      })
    },
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}

@import './formCommon.less';
.edit_collect_wrap {
  width: 100%;
  height: 100%;
  .floor {
    margin-top: 196px;
  }
  .is_error {
    /deep/.el-input__inner {
      border-color: var(--border-color-input-error) !important;
      color: #FF106E;
    }
  }
  /deep/.el-select .el-tag {
    max-width: 72%;
  }
}
</style>
