<template>
  <div class="tabs-c">
    <el-tabs v-model="tabs.activeName" @tab-click="handleClick">
      <template v-for="(item, index) in tabs.list">
        <el-tab-pane
          v-if="item.isShow == 'undefined' ? true : item.isShow"
          :key="index + '_' + item.name"
          :label="item.label"
          :name="item.name"
        >
          <slot :name="item.name"></slot>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Object
    }
  },

  methods: {
    handleClick (tab) {
      this.$emit('handleClick', tab)
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-c {
  color: var(--base-text-color-to-999999);
}

/deep/.el-tabs__nav-wrap::after {
  height: 0px !important;
}
/deep/.el-tabs__item {
  color: var(--base-text-color-to-999999) !important;
  font-size: 16px !important;
}
</style>
