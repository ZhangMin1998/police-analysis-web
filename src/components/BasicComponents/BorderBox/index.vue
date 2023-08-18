<template>
  <div class="form">
    <div v-clickout="clickout" :class="{ trendBox_item: true, isActive: isActive }">
      <div class="key"><slot name="title"></slot></div>
      <div class="val" @click.prevent.stop="clickEvent">
        <slot name="containers"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isActive: false,
    }
  },
  methods: {
    clickEvent () {
      this.isActive = true
    },
    clickout () {
      this.isActive = false
    },
  },
}
</script>

<style lang="less" scoped>
.trendBox_item {
  position: relative;
  // border: 1px solid #4e596d;
  border: 1px solid var(--border-color-input);
  padding: 10px 12px 4px 12px;
  margin-bottom: 16px;
  &.isActive {
    border: 1px solid #5288d8;
  }
  &:hover {
    border: 1px solid #5288d8;
  }
  .key {
    color: var(--base-text-color-to-999999);
  }
  &.active {
    border: 1px solid #5288d8;
  }
  .val {
    height: 40px;
    line-height: 40px;
  }
}
</style>
