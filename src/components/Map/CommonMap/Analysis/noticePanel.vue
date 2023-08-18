<template>
  <div
    :class="`panel_container ${left ? isNotice || '' : ''} ${cls}`"
    :style="
      left ? `width: ${$pxToRem(width)};left: -${isNotice ? $pxToRem(width - 19) : $pxToRem(width)}; ` : `width: ${$pxToRem(width)};`
    "
  >
    <div :class="`showBtn`" @click="showEvent" v-if="left">
      <i :class="isNotice ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class='wrap'>
      <slot name="stepDot"></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    width: {
      type: Number,
      default: 434,
    },
    left: {
      type: Boolean,
      default: true,
    },
    isAbsolute: {
      // 右边箭头
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('analysisJudgement', {
      isNotice: 'isNotice',
    }),
    cls () {
      return this.isAbsolute ? 'panel_container-ab' : ''
    },
  },
  created () {
    if (this.left) {
      this.$store.state.analysisJudgement.isNotice = 'trans'
    }
  },
  methods: {
    //  消息面板 显示/隐藏
    showEvent () {
      // this.isNotice  trans 为显示  ''为隐藏
      this.$store.state.analysisJudgement.isNotice = this.isNotice ? '' : 'trans'
      if (this.isNotice) {
        // 消息面板显示  碰撞结果隐藏
        this.$store.state.analysisJudgement.isResult = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
.panel_container-ab {
  position: absolute;
}
.panel_container {
  // background-color: #26334b;
  // background-color: var(--bg-color-2);
  background: var(--car-right-chuangkou-hearder-bg);
  border: 2px solid rgba(255, 255, 255, 0.10196078431372549);
  // position: absolute;
  height: 97%;
  top: 12px;
  padding: 24px 16px 24px 10px;
  box-sizing: border-box;
}
.showBtn {
  width: 32px;
  height: 56px;
  text-align: center;
  line-height: 56px;
  position: absolute;
  top: -2px;
  right: -34px;
  // background-color: #202b3f;
  background-color: var(--bg-color-2);
  border: 1px solid var(--bg-color-2);
  cursor: pointer;
  font-size: 24px;
  color: var(--base-text-color-to-999999);
  box-sizing: border-box;
}
.showBtn:hover {
  color: #177ddc;
}
.trans {
  /* <!-- 过渡效果 --> */
  transition: all 1.5s ease 0s;
  transform: translateX(99%);
}
.wrap {
  height: 100%;
}
</style>
