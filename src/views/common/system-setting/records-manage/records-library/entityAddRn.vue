<template>
<div class='entity_add_rn'>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <div class='belong_to'>
      <div class='label'>所属：</div>
      <div class='value'>{{ operaEntityData.way === 'add' ? operaEntityData.label : operaEntityData.parentLabel }}</div>
    </div>
    <el-form-item prop="entityName">
      <div class='label'>名称：</div>
      <el-input placeholder="请输入" v-model.trim="form.entityName"></el-input>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { operaEntity } from '@/api/sysSetting'
import { validate } from './config.js'

export default {
  name: 'EntityAddRn',
  props: {
    operaEntityData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: {
        entityName: ''
      },
      rules: {
        entityName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.operaEntityData.id && this.operaEntityData.way === 'rename') {
      this.form.entityName = this.operaEntityData.label || ''
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            entityName: this.form.entityName
          }
          let way = 'insert'
          if (this.operaEntityData.way === 'add') {
            if (this.operaEntityData.id) {
              params['fatherEntityId'] = +this.operaEntityData.id
            }
          } else {
            if (this.operaEntityData.id) {
              params['id'] = +this.operaEntityData.id
              way = 'update'
            }
          }
          operaEntity(params, way).then(() => {
            if (this.operaEntityData.way === 'rename') {
              this.$message.success('修改成功！')
            } else {
              this.$message.success('新建成功！')
            }
            this.$emit('closeDialog', true)
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
.entity_add_rn {
  .belong_to {
    display: flex;
    color: var(--base-text-color-1);
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 16px;
    .label {
      color: var(--base-text-color-to-999999);
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
  /deep/.el-form-item {
    .el-form-item__content {
      display: flex;
      margin-left: 0 !important;
      line-height: 32px;
      .label {
        font-size: 16px;
        white-space: nowrap;
      }
      .el-input {
        width: 386px;
        .el-input__inner {
          height: 32px;
          line-height: 30px;
          //border: 1px solid #515C7C;
          border-radius: 2px;
          padding: 0 12px;
        }
      }
      .el-form-item__error {
        left: 48px;
        color: @font-color-4;
      }
    }
  }
}
</style>
