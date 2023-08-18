<template>
  <div class="tabs-map-list">
    <div
      v-for="item in TabList"
      :class="['common-style', item.value, { 'no_active': activeName !== item.value }]"
      @click="clickTab(item.value)"
      :key="item.label"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    TabList: {
      type: Array,
      default: () => [
        {
          label: '地图',
          value: 'map'
        },
        {
          label: '列表',
          value: 'list'
        }
      ]
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickTab (val) {
      // console.log('点击了');
      this.$emit('clickTab', val)
    },
  }

}
</script>

<style lang="less" scoped>
.tabs-map-list {
  display: flex;
  .common-style {
    font-size: 14px;
    padding: 3px 10px;
    background: var(--active-color);
    color: @font-color-3;
    border: 1px solid var(--active-color);
    cursor: pointer;
    &.no_active{
      background: transparent;
      color: var(--base-text-color-1);
      border: 1px solid var(--border-color-2);
      &:hover {
        border-color: var(--active-color);
        color: var(--active-color);
      }
    }
  }
}
</style>
