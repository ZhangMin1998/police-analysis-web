<template>
<div class='edit_format_time_wrap'>
  <el-form ref='form' :rules='rules' :model="form" label-position='left' label-width="92px">
    <el-form-item label="列名称：" prop="colName">
      <el-input v-model.trim="form.colName" placeholder="请输入列名称" maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="转换列：" prop='formatCol'>
      <EditSelect
        :modelValue.sync='form.formatCol'
        :placeholder='"请选择转换列"'
        :options='formatColOptions'
      ></EditSelect>
<!--      <el-select v-model="form.formatCol" placeholder="请选择转换列">
        <el-option
          v-for='item in formatColOptions'
          :key='item.value'
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
    </el-form-item>
    <el-form-item label="转换时间：" prop='formatType'>
      <el-select v-model="form.formatType" placeholder="请选择转换时间">
        <el-option
          v-for='item in formatTypeOptions'
          :key='item.value'
          :label="item.label"
          :value="item.value"
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
  addModuleTimeApi,
  updateModuleTimeApi
} from '@/api/analysisJudgment'
import { toPinYin } from './config.js'

const FORMAT_OPTIONS = [
  { label: '年份', value: 'yyyy' },
  // { label: '季度', value: '2' },
  // { label: '月份', value: '3' },
  // { label: '月日', value: '4' },
  { label: '星期', value: 'EEEE' },
  // { label: '日', value: '6' },
  // { label: '周数', value: '7' },
  { label: '时', value: 'H' },
  // { label: '分', value: '9' },
  // { label: '秒', value: '10' },
  { label: '年季度', value: 'yyyy-Q' },
  { label: '年月', value: 'yyyy-MM' },
  { label: '年周数', value: 'yyyy-w' },
  { label: '年月日', value: 'yyyy-MM-dd' },
  { label: '年月日时', value: 'yyyy-MM-dd HH' },
  { label: '年月日时分', value: 'yyyy-MM-dd HH:mm' },
  { label: '年月日时分秒', value: 'yyyy-MM-dd HH:mm:ss' }
]

export default {
  name: 'EditFormatTime',
  components: {
    EditSelect
  },
  inject: [
    'successOpera',
    'closeDialog',
    'editModuleInfo'
  ],
  props: {
    editInfo: {
      type: Object
    },
    canEditField: {
      type: Array,
      default: () => []
    },
    operaPerRecordId: {
      type: Number
    }
  },
  data () {
    return {
      form: {
        colName: '',
        formatCol: '',
        formatType: ''
      }, // 汇总表单信息
      rules: {
        colName: [
          { required: true, message: '列名称不可为空', trigger: 'change' }
        ],
        formatCol: [
          { required: true, message: '转换列不可为空', trigger: 'change' }
        ],
        formatType: [
          { required: true, message: '转换时间不可为空', trigger: 'change' }
        ]
      },
      formatColOptions: [], // 转换列选项
      formatTypeOptions: Object.freeze(FORMAT_OPTIONS), // 汇总方式的选项
    }
  },
  mounted () {
    this.formatColOptions = this.canEditField.filter(item => item.type === 'time')
    if (this.editInfo) {
      this.form.colName = this.editInfo.timeConversionFieldCn
      this.form.formatCol = this.editInfo.timeConversionColumn
      this.form.formatType = this.editInfo.timeConversionType
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let requestApi = addModuleTimeApi
          let successTip = '添加'
          let params = {
            containerId: +this.editModuleInfo.i,
            timeConversionColumn: this.form.formatCol,
            timeConversionFieldCn: this.form.colName,
            timeConversionType: this.form.formatType,
            perRecordId: this.operaPerRecordId
          }
          if (this.editInfo) {
            requestApi = updateModuleTimeApi
            successTip = '编辑'
            params['id'] = this.editInfo.id
            params['recordId'] = this.editInfo.recordId
            params['timeConversionFieldEn'] = this.editInfo.timeConversionFieldEn
          } else {
            params['timeConversionFieldEn'] = toPinYin(this.form.colName)
          }
          requestApi(params).then(() => {
            this.$message.success(`${successTip}时间转换成功！`)
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
.edit_format_time_wrap {
  width: 100%;
  height: 100%;
  .floor {
    margin-top: 196px;
  }
}
</style>
