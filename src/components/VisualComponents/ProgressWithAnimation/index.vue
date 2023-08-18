<template>
  <div class='w-progress-wrap'>
    <div class='tip-info' v-if='tipInfo'>{{ tipInfo }}</div>
    <slot name='tipInfo'></slot>
    <div class='w-progress'>
      <div class='w-progress-outer' :style='{ "background-color": outerColor }'>
        <div
          class='w-progress-inner'
          :style='{
            "background": innerColor,
            "width": `${percentage}%`,
            "animation": `${animationName} ${animationDuration}s linear`
          }'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WProgress',
  props: {
    // 提示信息
    tipInfo: {
      type: String,
      default: ''
    },
    // 进度条百分比
    percentage: {
      type: Number,
      default: 0
    },
    // 进度条外颜色
    outerColor: {
      type: String,
      default: 'rgba(0, 0, 0, .16)'
    },
    // 进度条内颜色
    innerColor: {
      type: String,
      default: '#5C8EFD'
    },
    // 动画名字
    animationName: {
      type: String,
      default: ''
    },
    // 动画完成时间，单位：秒
    animationDuration: {
      type: Number,
      default: 2
    }
  },
  watch: {
    percentage: {
      handler () {
        this.$nextTick(() => {
          if (this.animationName) {
            document.styleSheets[0].insertRule(`@keyframes ${this.animationName} {
              from {
                width: 0;
              }
              to {
                width: ${this.percentage}%;
              }
              }`, 0)
          }
        })
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang='less' scoped>
.w-progress-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  .tip-info {
    font-size: 16px;
    color: #888888;
  }
  .w-progress {
    display: flex;
    align-items: center;
    width: 100%;
    height: 27px;
    .w-progress-outer {
      position: relative;
      width: 100%;
      height: 9px;
      border-radius: 1px;
      .w-progress-inner {
        position: absolute;
        height: 9px;
        border-radius: 1px;
      }
    }
  }
}
</style>
