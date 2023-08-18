<template>
<div class='entity_opera_attr'>
  <el-form ref='form' :model="form" :rules="rules" label-position='left' label-width="86px">
    <el-form-item label="标签名称：" prop="labelName">
      <el-input v-model.trim="form.labelName" placeholder="请输入" maxlength="10"></el-input>
    </el-form-item>
    <el-form-item label="标准：" prop="dataStandardId" class='standard'>
      <el-select
        v-model="form.dataStandardId"
        placeholder="请选择"
        popper-class='standard_detail'
        @visible-change='showSelect'
        clearable
        multiple
        collapse-tags
      >
        <div
          class='my_option'
          v-for='item in standardList'
          :key='item.id'
          @mouseover='handleStandard(true, item)'
          @mouseout='handleStandard(false)'
        >
          <el-option :label="item.standardName" :value="item.id"></el-option>
        </div>
      </el-select>
      <div class='detail_table' v-show='showStandardDialog' :style='{ left: $pxToRem(132 + sTableWidth) }'>
        <el-table
          :data='detailData'
        >
          <el-table-column
            prop="standardCode"
            label="代码"
            min-width="19.33%"
            :show-overflow-tooltip="true"
            :resizable="true"
          >
            <span slot-scope='{ row }'>{{ row.standardCode || '--' }}</span>
          </el-table-column>
          <el-table-column
            prop="standardName"
            label="名称"
            min-width="43.13%"
            :show-overflow-tooltip="true"
            :resizable="true"
          >
            <span slot-scope='{ row }'>{{ row.standardName || '--' }}</span>
          </el-table-column>
          <el-table-column
            prop="standardDescription"
            label="说明"
            min-width="37.54%"
            :show-overflow-tooltip="true"
            :resizable="true"
          >
            <span slot-scope='{ row }'>{{ row.standardDescription || '--' }}</span>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <el-form-item label="是否唯一：" prop='mainLabel'>
      <div v-if='!editOnly' class='is_only'>是</div>
      <el-select v-else v-model="form.mainLabel" placeholder="请选择">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述：" prop="labelDescription">
      <el-input type="textarea" v-model.trim="form.labelDescription" maxlength="50" show-word-limit placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { operaEntityAttr } from '@/api/sysSetting'
import { validate } from './config'
export default {
  name: 'EntityOperaAttr',
  props: {
    row: {
      type: Object,
      default: () => {}
    }, // 更新属性时，选中的行数据
    standardList: {
      type: Array,
      default: () => []
    }, // 数据标准的数据
    activeEntityId: {
      type: String,
      default: ''
    }, // 当前选中的实体id
    entityAttrLength: {
      type: Number,
      default: 0
    }, // 当前选中实体时候有属性
    standardAttrDe: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: {
        labelName: '',
        dataStandardId: [],
        labelDescription: '',
        mainLabel: false
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标准名称', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        mainLabel: [
          { required: true, message: '请选择是否唯一', trigger: 'blur' },
        ],
      },
      detailData: [], // 数据标准详情表格数据
      showStandardDialog: false, // 是否显示数据标准详情的弹窗
      sTableWidth: 0
    }
  },
  computed: {
    editOnly () {
      if (this.row && this.row.id) {
        return this.row.index !== 0
      } else {
        return this.entityAttrLength
      }
    }
  },
  created () {
    if (this.row && this.row.id) {
      for (let key in this.form) {
        this.form[key] = this.row[key]
      }
    }
    if (!this.entityAttrLength && !this.row.id) {
      this.form.mainLabel = true
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.dataStandardId.length > 1) {
            let obj = {}
            let isRepeat = false
            this.form.dataStandardId.forEach(item => {
              let result = this.standardAttrDe[item].dataStandardRules || []
              result.forEach(res => {
                if (obj[res.standardCode]) {
                  isRepeat = true
                  return
                }
                res.standardCode && (obj[res.standardCode] = 1)
              })
              if (isRepeat) return
            })
            if (isRepeat) {
              this.$policeComfirm(`标准代码字段不可重复！`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              return
            }
          }
          let params = {
            ...this.form,
            entityId: +this.activeEntityId,
            mainLabel: this.form.mainLabel
          }
          let way = 'insert'
          if (this.row && this.row.id) {
            params['id'] = this.row.id
            way = 'update'
          }
          operaEntityAttr(params, way).then(() => {
            this.$emit('closeDialog')
            this.$emit('getEntityList')
            this.$emit('getUseStandard')
          })
        }
      })
    },
    // 标准的下拉项的鼠标移入和移出事件
    handleStandard (bool, item) {
      if (bool) {
        this.detailData = item.dataStandardRules || []
      }
      this.showStandardDialog = bool
    },
    showSelect (bool) {
      if (bool && !this.sTableWidth) {
        this.$nextTick(() => {
          let selectDom = document.querySelector('.standard_detail')
          this.sTableWidth = selectDom.clientWidth
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.entity_opera_attr {
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
  /deep/.el-form {
    .el-form-item {
      margin-bottom: 12px !important;
      .el-form-item__error {
        padding-top: 0;
        color: @font-color-4;
      }
      .el-form-item__label {
        position: relative;
        font-size: 16px;
        line-height: 32px;
        &::before {
          position: absolute;
          left: -12px;
          color: @font-color-4;
        }
      }
      .el-form-item__content {
        line-height: 30px;
        .el-select {
          width: 100%;
          .el-input__inner {
            padding-right: 32px;
          }
          .el-icon-circle-close {
            margin-top: 0 !important;
          }
        }
      }
      &.standard {
        .el-form-item__content {
          position: static;
        }
      }
      .el-input {
        line-height: 30px;
        .el-input__inner {
          height: 32px;
          line-height: 30px;
          border: 1px solid rgba(81, 92, 124, .4);
          border-radius: 2px;
          padding: 0 12px;
          font-size: 14px;
          &:hover {
            border-color: #3D4C75;
          }
          &::placeholder {
            font-size: 14px;
          }
        }
      }
      .el-textarea__inner {
        border-color: rgba(81, 92, 124, .4) !important;
        background: transparent;
        min-height: 115px !important;
        border-radius: 2px;
        padding: 7px 12px;
        &:hover {
          border-color: #3D4C75 !important;
        }
        &:focus {
          border-color: var(--active-color) !important;
        }
        &::placeholder {
          font-size: 14px;
          color: var(--input-placehold-color);
        }
      }
      .el-input__count {
        font-size: 14px;
        color: var(--base-text-color-to-666666);
        line-height: 14px;
      }
    }
  }
  .detail_table {
    position: absolute;
    //left: 298px;
    top: 178px;
    box-shadow: 0 0 6px 1px rgba(0,0,0,0.12);
    width: 357px;
    background: var(--record-library-standard);
    z-index: 10;
    border-radius: 2px;
    /deep/.el-table {
      border-radius: 2px;
      font-size: 14px;
      td.el-table__cell {
        border-bottom: 0;
      }
      .el-table__cell {
        padding: 8px 0;
        line-height: 16px;
      }
      .el-table__body-wrapper .el-table__body tbody tr .el-table__cell .cell {
        line-height: 16px;
      }
      .el-table__body-wrapper .el-table__body tbody tr .el-table__cell:first-child .cell {
        padding-left: 20px;
      }
      .el-table__header-wrapper {
        .el-table__header {
          .has-gutter {
            tr {
              .el-table__cell {
                padding: 8px 0;
                line-height: 16px;
                &:first-child {
                  .cell {
                    padding-left: 20px;
                  }
                }
              }
              th {
                &.is-leaf {
                  border-bottom: 0;
                }
                .cell {
                  line-height: 16px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.is_only {
  color: var(--base-text-color-1);
}
</style>
