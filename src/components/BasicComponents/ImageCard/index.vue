<template>
  <div :class="['ImageCard', { isActive: active }]" @click="handleCheck(item)">
    <div class="ImageCard_image"></div>
    <div class="ImageCard_info">
      <div class="ImageCard_info_name">王明</div>
      <div class="ImageCard_info_label">身份证</div>
      <div class="ImageCard_info_value">xxxxxxxxxxxxx</div>
      <div class="ImageCard_info_label">手机号</div>
      <div class="ImageCard_info_value">xxxxxxxxxxxxx</div>
    </div>
  </div>
</template>

<script>
// import { reactive, toRefs } from '@vue/composition-api'

export default {
  name: 'ImageCard',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (prop, context) {
    const handleCheck = item => {
      context.emit('handleCheck', item)
    }

    return {
      handleCheck
    }
  }
}
</script>

<style lang="less" scoped>
.ImageCard {
  display: flex;
  padding: 10px 20px 10px 10px;
  box-sizing: border-box;
  background-color: var(--table-head-bg-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  &.isActive {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0px 0px 6px #888888;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  .ImageCard_image {
    width: 80px;
    height: 115px;
    background-color: rosybrown;
    margin-right: 16px;
  }

  .ImageCard_info {
    font-size: 14px;
    line-height: 20px;
    color: var(--base-text-color-1);
    .ImageCard_info_name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .ImageCard_info_label {
      color: var(--base-text-color-to-999999);
    }
    .ImageCard_info_value {
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
