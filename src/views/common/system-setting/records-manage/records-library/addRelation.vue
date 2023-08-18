<template>
  <div class='entity_opera_attr'>
    <el-form ref='form' :model="form" :rules="rules" label-position='left' label-width="86px">
      <el-form-item label="关系名称：" prop="relationshipName">
        <el-input v-model.trim="form.relationshipName" placeholder="请输入" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="关系状态：" prop="dataStandardId" class='relation_state'>
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
<!--      <div class='relation_point_to'>
        <div class='label'>关系指向：</div>
        <el-form-item prop='startEntityId'>
          <el-select v-model="form.startEntityId" placeholder="请选择">
            <el-option
              v-for='item in entityLabelList'
              :key='item.id'
              :label="item.label"
              :value='+item.id'
            ></el-option>
          </el-select>
        </el-form-item>
        <i class='el-icon-right'></i>
        <el-form-item prop='endEntityId'>
          <el-select v-model="form.endEntityId" placeholder="请选择">
            <el-option
              v-for='item in entityLabelList'
              :key='item.id'
              :label="item.label"
              :value='+item.id'
            ></el-option>
          </el-select>
        </el-form-item>
      </div>-->
      <el-form-item label="描述：" prop="relationshipDescription">
        <el-input type="textarea" v-model.trim="form.relationshipDescription" maxlength="50" show-word-limit placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div class='floor'>
      <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
      <el-button type="primary" @click='submit'>确定</el-button>
    </div>
  </div>
</template>

<script>
import { operaRelation } from '@/api/sysSetting'
import { validate } from './config'

export default {
  name: 'AddRelation',
  props: {
    row: {
      type: Object,
      default: () => {}
    }, // 更新时选择的行数据
    standardList: {
      type: Array,
      default: () => []
    }, // 数据标准列表
    standardAttrDe: {
      type: Object,
      default: () => {}
    }
    // entityLabelList: {
    //   type: Array,
    //   default: () => []
    // } // 实体列表
  },
  data () {
    return {
      form: {
        relationshipName: '',
        dataStandardId: [],
        // startEntityId: '',
        relationshipDescription: '',
        // endEntityId: ''
      },
      rules: {
        relationshipName: [
          { required: true, message: '请输入关系名称', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        // startEntityId: [
        //   { required: true, message: '请选择关系指向', trigger: 'blur' },
        // ],
        // endEntityId: [
        //   { required: true, message: '请选择关系指向', trigger: 'blur' },
        // ],
      },
      detailData: [], // 数据标准详情数据
      showStandardDialog: false, // 数据标准详情弹窗
      sTableWidth: 0
    }
  },
  created () {
    if (this.row && this.row.id) {
      for (let key in this.form) {
        this.form[key] = this.row[key] || ''
      }
    }
  },
  methods: {
    // 提交
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
              this.$policeComfirm(`关系状态代码字段不可重复！`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              })
              return
            }
          }
          let params = {
            ...this.form
          }
          let way = 'insert'
          if (this.row && this.row.id) {
            params['id'] = this.row.id
            way = 'update'
          }
          operaRelation(params, way).then(() => {
            this.$emit('closeDialog')
            this.$emit('getRelation')
            this.$emit('getUseStandard')
          })
        }
      })
    },
    // 鼠标移入和移出关系状态的下拉选择项
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
      &.relation_state {
        .el-form-item__content {
          position: static;
        }
      }
      .el-input {
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
    .relation_point_to {
      display: flex;
      .label {
        position: relative;
        font-size: 16px;
        line-height: 32px;
        width: 86px;
        &::before {
          display: inline-block;
          content: '*';
          position: absolute;
          left: -12px;
          color: @font-color-4;
        }
      }
      .el-form-item__content {
        margin-left: 0 !important;
        line-height: 30px;
      }
      .el-icon-right {
        line-height: 32px;
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
.el-icon-right {
  color: rgba(81, 92, 124);
}
</style>
