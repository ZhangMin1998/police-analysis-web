<template>
  <div class="seach">
    <slot name="form"></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.seach {
  background: var(--table-head-bg-color);
  margin-bottom: 16px;
  padding: 12px;
  box-sizing: border-box;
  min-height: 56px;
}
</style>
