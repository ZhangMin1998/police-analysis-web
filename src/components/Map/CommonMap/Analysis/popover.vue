<template>
  <div class="popover" :style="style_position">
    <div class="header">
      <slot name="title"> </slot>
      <i class="el-icon-close" @click="beforeClose"></i>
    </div>
    <div class="popover-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    style_position: {
      type: String,
      default: 'bottom: 16px;left: 0px;',
    },
  },
  mounted () {},
  beforeDestroy () {},
  methods: {
    beforeClose () {
      this.$emit('beforeClose')
    },
  },
}
</script>

<style scoped>
.popover-content {
  color: var(--base-text-color-1);
  font-size: 16px;
}
.popover {
  position: fixed;
  left: 0;
  width: 100vw;
  min-height: 230px;
  background: var(--map-point-info-dialog-bg);
  /* background: #202b3f; */
  opacity: 0.97;
  padding: 16px 32px 12px 32px;
  box-sizing: border-box;
  z-index: 999;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.popover .el-icon-close {
  font-size: 32px;
  color: #737c8b;
  cursor: pointer;
}
.popover .el-icon-close:hover {
  color: #5288d8;
}
</style>
