<template>
<div>
  <div v-show='visible' class='message-box-dialog'>
    <div class='dialog'>
      <div class='dialog-header'>
<!--        <div class='header-tip'>{{ headerTip }}</div>-->
<!--        <div class='header-close' @click="handleAction()"></div>-->
        <div class='detail_title'>
          <img :src='require("@/assets/img/set-bg.png")' alt=''>
          <div>{{ headerTip }}</div>
        </div>
        <i class='header-close el-icon-close' @click="handleAction('cancel')"></i>
      </div>
      <div class='dialog-body' :class='{ "no_floor": !haveFloor }'>
        <i :class='["iconfont", contentIcon]'></i>
        <div class='body-tip'>{{ message }}</div>
      </div>
      <div v-if='haveFloor' class='dialog-floor'>
        <el-button
          v-if='showCancelButton'
          type="primary"
          @click="handleAction('cancel')"
        >
          {{ cancelButtonText }}
        </el-button>
        <div class="blank_button" @click="handleAction('confirm')">{{ confirmButtonText }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'MessageBox',
  data () {
    return {
      contentIcon: 'icon-danchuangtishi',
      headerTip: '提示',
      message: '',
      visible: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      action: '',
      callback: null,
      showCancelButton: true,
      haveFloor: true
    }
  },
  methods: {
    handleAction (action) {
      this.action = action;
      this.visible = false;
      setTimeout(() => {
        if (this.action) this.callback(this.action, this);
      })
    }
  }
}
</script>

<style lang='less' scoped>
.message-box-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background: rgba(27, 33, 50, .87);
  box-sizing: border-box;
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 502px;
    padding: 0 16px;
    color: var(--base-text-color-1);
    background: var(--bg-color-4);
    z-index: 101;
    box-sizing: border-box;
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 11px;
      box-sizing: border-box;
      border-bottom: 1px solid var(--active-color);
      .header-tip {
        width: 133px;
        height: 32px;
        padding-left: 8px;
        background: url('~@/assets/img/device-list-title-bg-2.png') no-repeat;
        background-size: 100% 100%;
        font-size: 18px;
        font-weight: bold;
        line-height: 32px;
        white-space: nowrap;
        box-sizing: border-box;
      }
      .detail_title {
        position: relative;
        height: 18px;
        line-height: 18px;
        font-size: 18px;
        color: var(--base-text-color-1);
        font-weight: bold;
        div {
          position: absolute;
          bottom: 0;
          margin-left: 10px;
        }
        img {
          width: 65px;
          height: 8px;
          margin-top: 14px;
        }
      }
      .header-close {
        font-size: 24px;
        color: var(--base-text-color-3);
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
          color: var(--active-color);
        }
      }
    }
    .dialog-body {
      display: flex;
      align-items: center;
      padding: 24px 16px;
      box-sizing: border-box;
      &.no_floor {
        padding-bottom: 48px;
        padding-top: 34px;
      }
      i {
        flex: none;
        font-size: 32px;
        color: var(--active-color);
        margin-right: 12px;
      }
      .body-tip {
        font-size: 16px;
        line-height: 25px;
        padding-right: 20px;
        flex: 1;
        box-sizing: border-box;
      }
    }
    .dialog-floor {
      display: flex;
      justify-content: flex-end;
      padding: 0px 16px 32px;
      box-sizing: border-box;
      .blank_button {
        margin-left: 16px;
      }
    }
  }
}
</style>
