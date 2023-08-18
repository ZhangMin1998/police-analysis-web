<template class="not_change_rem">
<div class='change_group_wrap'>
  <el-form ref='form' :rules='rules' :model="form" label-position='left' label-width="50px">
    <el-form-item label="分组：" prop='groups'>
      <el-select
        v-model="form.groups"
        placeholder="请选择分组"
      >
        <el-option
          v-for='(item) in groupOptions'
          :key='item.id'
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeCGDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { changeGroup } from '@/api/warnControl.js'
export default {
  name: 'ChangeGroup',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    choiceFRules: {
      type: Array,
      default: () => []
    },
    configId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      form: {
        groups: ''
      },
      rules: {
        groups: [
          { required: true, message: '分组不可为空', trigger: 'change' }
        ]
      },
      groupOptions: []
    }
  },
  mounted () {
    this.groupOptions = this.tabList.filter(item => item.id)
    this.groupOptions.unshift({
      id: 'all',
      label: '全部'
    })
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changeGroup({
            featuresConfigIdList: this.choiceFRules,
            groupId: this.form.groups === 'all' ? 0 : this.form.groups,
            configId: this.configId
          }).then(() => {
            this.$message.success('变成分组成功！')
            this.$emit('refreshTable')
            this.$emit('closeCGDialog', true)
          }).catch(() => {
            this.$message.error('变成分组失败！')
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
.change_group_wrap {
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
    .blank_button {
      margin-right: 16px;
    }
  }
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
        line-height: 32px;
        .el-form-item__error {
          color: #FF106E;
        }
      }
      .el-select {
        width: 100%;
      }
      .el-input {
        .el-input__inner {
          height: 32px;
          line-height: 30px;
          padding: 0 12px;
        }

        .el-input__suffix {
          height: 30px;
        }
      }
    }
  }
}
</style>
