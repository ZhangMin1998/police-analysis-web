<template>
  <div class="CustomTab_header">
    <div class="CustomTab">
      <div
        class="CustomTab-item"
        v-for="item in tabs.list"
        :key="item.label"
        @click="handleClick(item)"
      >
        <span :class="{ isActive: tabs.activeName === item.name }">{{ item.label }}</span>
      </div>
    </div>

    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomTab',
  props: {
    tabs: {
      type: Object,
      default: () => {}
    }
  },
  watch:{
    tabs (val){
      console.log(val);
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('handleClick', item)
    }
  }
}
</script>

<style lang="less" scoped>
.CustomTab_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .CustomTab {
    display: flex;
    color: var(--base-text-color-to-999999) !important;
    font-size: 16px !important;
    padding-top: 16px;
    .CustomTab-item {
      cursor: pointer;
      margin-right: 40px;
      & > span.isActive {
        color: var(--active-color);
        border-bottom: 2px solid var(--active-color);
        padding-bottom: 10px;
        z-index: 999;
      }
    }
  }
}
</style>
