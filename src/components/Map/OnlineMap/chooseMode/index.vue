<template>
  <div class="choose-mode">
    <ul class="choose-mode-wrapper">
      <li
        class="choose-mode-item"
        :class="{ active: item.value == value }"
        v-for="(item, idx) in list"
        :key="idx"
        @click="$emit('input', item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      list: [
        { label: '单选场所', value: 1 },
        { label: '框选场所', value: 2 }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.choose-mode {
  position: absolute;
  z-index: 100;
  top: 16px;
  left: 576px;
  box-sizing: content-box;
  width: 240px;
  height: 68px;
  background: @cur-bg;
  opacity: @cur-opacity;
  color: var(--base-text-color-1);
  &-wrapper {
    height: 68px;
    display: flex;
    justify-content: space-around;
  }
  &-item {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
