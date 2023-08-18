<template class="not_change_rem">
<div class='edit_algorithm_wrap'>
  <div class='alg_option'>
    <div
      v-for='item in algOptions'
      :key='item.value'
      :class='{
        "alg_item": true,
        "active": item.value === activeAlg
      }'
      @click='changeAlg(item)'
    >
      <EllipsisPop :content='item.label'></EllipsisPop>
    </div>
  </div>
  <div class='form_wrap' :key='contentKey'>
    <div class='tip'>
      <i class='iconfont icon-zhushi'></i>
      <div class='text'>{{ tipInfo }}</div>
    </div>
    <div class='alg_form'>
      <el-form :model='ruleForm' :rules='rules' ref='ruleForm' :label-width='formLabelWidth + "px"' label-position='left'>
        <el-form-item
          v-for='item in formItemConfigs'
          :key='item.prop'
          :label="item.label + '：'"
          :prop="item.prop"
        >
          <el-input
            v-if='item.formType === "input"'
            v-model="ruleForm[item.prop]"
            :type='item.inputType || "text"'
            :placeholder="item.placeholder"
          ></el-input>
          <template v-if='item.formType === "select"'>
            <el-select
              v-if='item.multiple'
              v-model="ruleForm[item.prop]"
              :placeholder="item.placeholder"
              multiple
              collapse-tags
            >
              <el-option
                v-for='item in item.fieldType ? canEditField.filter(field => field.fieldType === item.fieldType) : canEditField'
                :key='item.value'
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-else-if='item.normal'
              v-model="ruleForm[item.prop]"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for='item in item.options'
                :key='item.value'
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <EditSelect
              v-else
              :modelValue.sync='ruleForm[item.prop]'
              :placeholder="item.placeholder"
              :options='item.fieldType ? canEditField.filter(field => field.fieldType === item.fieldType) : canEditField'
            ></EditSelect>
          </template>
        </el-form-item>

      </el-form>
    </div>
    <div class='floor'>
      <div class='blank_button' @click='closeDialog'>取消</div>
      <el-button type="primary" @click='submit'>确定</el-button>
    </div>
  </div>
</div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import EditSelect from './editSelect.vue'
import {
  addModuleAlgApi,
  updateModuleAlgApi
} from '@/api/analysisJudgment'
import { ALG_OPTIONS, ALG_FORM_INFO } from './config.js'

export default {
  name: 'EditAlgorithm',
  components: {
    EllipsisPop,
    EditSelect
  },
  inject: [
    'closeDialog',
    'editModuleInfo',
    'successOpera'
  ],
  props: {
    canEditField: {
      type: Array,
      default: () => []
    },
    // 编辑算法信息
    editInfo: {
      type: Object
    },
    operaPerRecordId: {
      type: Number
    }
  },
  data () {
    return {
      algOptions: Object.freeze(ALG_OPTIONS), // 算法的类别
      ruleForm: {}, // 表单数据
      rules: {}, // 表单规则
      formItemConfigs: [], // 表单项配置
      activeAlg: '', // 当前算法
      formLabelWidth: '',
      contentKey: new Date().getTime(),
      tipInfo: ''
    }
  },
  created () {
    if (this.editInfo) {
      let alg = this.algOptions.find(item => item.value === this.editInfo.algorithmType)
      if (!alg) return
      const size = this.formatPx(16)
      const fontSize = size < 12 ? 12 : size
      this.activeAlg = alg.value
      this.formLabelWidth = fontSize * alg.formLabelLength + 4
      const algConfig = ALG_FORM_INFO[alg.value]
      if (!algConfig) return
      let formInfo = JSON.parse(this.editInfo.algorithmParam)
      const itemConfig = algConfig.formItem || []
      itemConfig.forEach(item => {
        this.$set(this.ruleForm, item.prop, formInfo[item.prop] || '')
      })
      this.rules = algConfig.formRule || {}
      this.formItemConfigs = itemConfig
      this.tipInfo = algConfig.tip
    } else {
      this.changeAlg(this.algOptions[0])
    }
  },
  methods: {
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    // 切换算法时
    changeAlg (alg) {
      const size = this.formatPx(16)
      const fontSize = size < 12 ? 12 : size
      this.contentKey = new Date().getTime()
      this.activeAlg = alg.value
      this.formLabelWidth = fontSize * alg.formLabelLength + 4
      this.formatFormInfo(this.activeAlg)
    },
    formatFormInfo (alg) {
      this.ruleForm = {}
      this.formItemConfigs = []
      this.rules = {}
      const algConfig = ALG_FORM_INFO[alg]
      if (!algConfig) return
      const itemConfig = algConfig.formItem || []
      itemConfig.forEach(item => {
        this.$set(this.ruleForm, item.prop, item.defaultValue)
      })
      this.rules = algConfig.formRule || {}
      this.formItemConfigs = itemConfig
      this.tipInfo = algConfig.tip
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.formItemConfigs.length) {
            this.$message.error('当前算法暂无内容')
            return
          }
          let requestApi = addModuleAlgApi
          let successTip = '添加'
          let newFieldList = this.formItemConfigs.filter(item => item.isAddField)
          let fieldList = []
          newFieldList.forEach(item => {
            fieldList.push({
              fieldNameEn: item.prop,
              fieldNameCn: this.ruleForm[item.prop],
              fieldType: 'STRING'
            })
          })
          let params = {
            containerId: +this.editModuleInfo.i,
            algorithmType: this.activeAlg,
            algorithmParam: JSON.stringify(this.ruleForm),
            perRecordId: this.operaPerRecordId,
            fieldList
          }
          if (this.editInfo) {
            requestApi = updateModuleAlgApi
            successTip = '编辑'
            params.id = this.editInfo.id
            params.recordId = this.editInfo.recordId
          }
          // console.log('success', params)
          requestApi(params).then(() => {
            this.$message.success(`${successTip}算法成功！`)
            this.successOpera()
          })
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
/deep/.sort_item {
  margin-right: 0;
}
.edit_algorithm_wrap {
  display: flex;
  width: 100%;
  height: 536px;
  .alg_option {
    flex: none;
    width: 180px;
    height: 100%;
    overflow-y: auto;
    background: var(--bg-color-2);
    padding: 16px 0;
    margin-right: 16px;
    .alg_item {
      width: 100%;
      height: 32px;
      padding: 0 24px;
      font-size: 14px;
      line-height: 32px;
      color: var(--base-text-color-1);
      cursor: pointer;
      &:hover {
        background: var(--bg-leftDrawer-click);
      }
      &.active {
        background: var(--bg-leftDrawer-click);
      }
    }
  }
  .form_wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 196px);
    height: 100%;
    /deep/.el-form {
      .el-form-item {
        margin-bottom: 12px;
        .el-form-item__label {
          font-size: 16px;
          line-height: 32px;
          &::before {
            display: none;
          }
        }
        .el-form-item__content {
          position: relative;
          display: flex;
          align-items: center;
          line-height: 30px;
          .el-select {
            width: 100%;
          }
          .el-form-item__error {
            color: #FF106E;
            padding-top: 0;
          }
        }
        .el-input {
          height: 32px;
          line-height: 32px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
            padding: 0 12px;
            border-width: 1px;
            border-color: var(--border-color-input);
            font-size: 14px;
            &:hover {
              border-color: var(--border-color-input-hover);
            }
            &:focus {
              border-color: var(--active-color);
            }
          }
          .el-input__suffix {
            height: 30px;
          }
        }
      }
    }
    .tip {
      flex: none;
      display: flex;
      line-height: 20px;
      margin-bottom: 16px;
      i {
        font-size: 16px;
        color: #5E86FF;
        margin-right: 4px;
      }
      .text {
        font-size: 14px;
        color: var(--input-placehold-color);
      }
    }
    .alg_form {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .floor {
      flex: none;
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      .blank_button {
        margin-right: 16px;
      }
    }
  }
}
</style>
