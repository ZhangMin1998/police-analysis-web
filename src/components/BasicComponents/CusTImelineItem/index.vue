<!--
 * @Descripttion: 重新封装的自定义时间线item组件
 * @version:
 * @Author: year
 * @Date: 2020-04-20 11:26:43
 * @LastEditors: year
 * @LastEditTime: 2020-04-20 11:41:47
 -->
<template>
  <li class="el-timeline-item">
    <div class="el-timeline-item__tail"></div>

    <div
      v-if="!$slots.dot"
      class="el-timeline-item__node"
      :class="[`el-timeline-item__node--${size || ''}`, `el-timeline-item__node--${type || ''}`]"
      :style="{
        backgroundColor: color
      }"
    >
      <i v-if="icon" class="el-timeline-item__icon" :class="icon"></i>
    </div>
    <div v-if="$slots.dot" class="el-timeline-item__dot">
      <slot name="dot"></slot>
    </div>

    <div class="el-timeline-item__wrapper">
      <div v-if="!hideTimestamp && placement === 'top'" class="el-timeline-item__timestamp is-top">
        {{ timestamp }}<br />
        <span class="el-timeline-item-timestamp_span">{{ timestampSpan }}</span>
      </div>

      <div class="el-timeline-item__content">
        <slot></slot>
      </div>

      <div
        v-if="!hideTimestamp && placement === 'bottom'"
        class="el-timeline-item__timestamp is-bottom"
      >
        {{ timestamp }}
      </div>

      <div
        v-if="!hideTimestamp && placement === 'left'"
        class="el-timeline-item__timestamp is-left"
      >
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'UserDefinedTimelineItem',
  props: {
    timestamp: String,
    timestampSpan: String,

    hideTimestamp: {
      type: Boolean,
      default: false
    },

    placement: {
      type: String,
      default: 'bottom'
    },

    type: String,

    color: String,

    size: {
      type: String,
      default: 'normal'
    },

    icon: String
  }
}
</script>

<style scoped>
.is-left {
  position: absolute;
  top: 2px;
  left: -3px;
  color: var(--base-text-color-1);
}
.el-timeline-item__wrapper {
  padding-left: 100px;
}
.el-timeline-item__node--normal {
  width: 7px;
  height: 7px;
  left: 80px;
  background-color: var(--base-text-color-to-999999);
}
@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .el-timeline-item__node--normal {
    left: 87px;
  }
}
.el-timeline-item__tail {
  left: 83px;
  border-left: 1px solid var(--base-text-color-to-999999);
}
@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .el-timeline-item__tail {
    left: 90px;
  }
}
.el-timeline-item__content {
  color: var(--base-text-color-1);
}
</style>
