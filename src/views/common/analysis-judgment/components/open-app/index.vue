<template>
<div class='open_app_wrap'>
  <div class='fill_item'>
    <div class='label'>权限设置：</div>
    <el-select
      v-model="openRoleLists"
      placeholder="请选择"
      multiple
      collapse-tags
    >
      <el-option
        v-for='item in roleOptions'
        :key='item.id'
        :label="item.roleName"
        :value="item.id"
      ></el-option>
    </el-select>
    <div v-if='haveError && (!openRoleLists || !openRoleLists.length)' class='error_tip'>权限设置不可为空</div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import {
  getAllRoleApi,
  openAppApi
} from '@/api/analysisJudgment'

export default {
  name: 'OpenApp',
  props: {
    editInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      openRoleLists: [], // 选中的角色
      roleOptions: [], // 全部角色数据
      haveError: false
    }
  },
  mounted () {
    this.getAllRole()
  },
  methods: {
    // 获取全部角色
    getAllRole () {
      getAllRoleApi().then(res => {
        this.roleOptions = res || []
      })
    },
    submit () {
      if (!this.openRoleLists || !this.openRoleLists.length) {
        this.haveError = true
        return
      }
      openAppApi({
        appId: this.editInfo.id,
        roleIdList: this.openRoleLists
      }).then(() => {
        this.$message.success(`${this.editInfo.appName}公开成功！`)
        this.$emit('closeDialog', true)
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.open_app_wrap {
  width: 100%;
  height: 100%;
  .fill_item {
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 12px;
    .label {
      flex: none;
      font-size: 16px;
      line-height: 32px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
      margin-right: 12px;
      &.label_line {
        line-height: 32px;
      }
    }
    .error_tip {
      position: absolute;
      bottom: -16px;
      left: 92px;
      font-size: 12px;
      line-height: 12px;
      color: @font-color-4;
    }
    /deep/.el-input {
      height: 32px;
      line-height: 32px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        border-color: var(--border-color-input);
        font-size: 14px;
        &:hover {
          border-color: var(--border-color-input-hover);
        }
      }
      .el-input__suffix {
        height: 30px;
      }
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
  .error_tip {
    position: absolute;
    bottom: -12px;
    left: 92px;
    font-size: 12px;
    line-height: 12px;
    color: @font-color-4;
  }
  /deep/.el-select .el-tag {
    max-width: 65%;
  }
}
</style>
