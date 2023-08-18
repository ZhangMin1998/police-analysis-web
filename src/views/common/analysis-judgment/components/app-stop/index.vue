<template>
<div class='app_stop_wrap'>
  <div class='fill_item'>
    <div class='label'>停用倒计时：</div>
    <el-radio-group v-model="fillInfo.time" @input='timeChange'>
      <el-radio :label="1">1分</el-radio>
      <el-radio :label="2">2分</el-radio>
      <el-radio :label="5">5分</el-radio>
      <el-radio :label="10">10分</el-radio>
    </el-radio-group>
  </div>
  <div class='fill_item'>
    <div class='label fill_content'>通知内容：</div>
    <el-input
      type="textarea"
      placeholder="请输入内容"
      v-model.trim="fillInfo.content"
      maxlength='200'
      @input='contentInput'>
    </el-input>
    <div v-if='haveError' class='error_tip'>通知内容不可为空</div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { stopAppApi } from '@/api/analysisJudgment'

export default {
  name: 'AppStop',
  props: {
    // 当前停用app信息
    appInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      fillInfo: {
        time: 1,
        content: ''
      },
      haveError: false, // 是否有未填信息
      isInputContent: false, // 是否自己输入通知内容
    }
  },
  computed: {
    ...mapState('User', {
      userInfo: 'userInfo'
    }),
    defaultContent () {
      return `用户“${this.userInfo.username}”分享的应用“${this.appInfo.appName || ''}”将于${this.fillInfo.time}分钟后下架，请合理安排功能的使用。`
    }
  },
  created () {
    this.fillInfo.content = this.defaultContent
  },
  methods: {
    // 通知内容输入
    contentInput (value) {
      this.isInputContent = true
      if (this.haveError && value) this.haveError = false
    },
    // 停用倒计时改变时
    timeChange () {
      if (this.isInputContent) return
      this.fillInfo.content = this.defaultContent
    },
    submit () {
      if (!this.fillInfo.content) {
        this.haveError = true
        return
      }
      stopAppApi({
        appId: this.appInfo.id,
        deactivationWaitTime: this.fillInfo.time,
        deactivateNotification: this.fillInfo.content
      }).then(() => {
        this.$message.success(`应用“${this.appInfo.appName || ''}”将在${this.fillInfo.time}分钟之后停用！`)
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
.app_stop_wrap {
  width: 100%;
  .fill_item {
    position: relative;
    display: flex;
    margin-bottom: 16px;
    padding-right: 8px;
    .label {
      flex: none;
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
      margin-right: 12px;
      &.fill_content {
        margin-right: 28px;
        padding-top: 6px;
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
    /deep/.el-radio-group {
      display: flex;
      .el-radio {
        display: flex;
        align-items: center;
        color: var(--base-text-color-1);
        margin-right: 24px;
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
    /deep/.el-textarea__inner {
      background-color: transparent;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      min-height: 120px !important;
      &::placeholder {
        color: var(--input-placehold-color);
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
}
</style>
