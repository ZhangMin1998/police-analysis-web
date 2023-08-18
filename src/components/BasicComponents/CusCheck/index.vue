<template>
  <div
    class="CusCheck"
    :style="{
      borderColor: curItem.isActive ? curItem.color : '#4b576a',
      color: curItem.isActive ? curItem.color : '#C0D0E7',
      background: curItem.isActive
        ? `radial-gradient(
      circle,
      rgba(240, 63, 88, 0) 40%,
      ${curItem.color} 150%
    )`
        : '#404c61'
    }"
  >
    {{ curItem.label }}
  </div>
</template>

<script>
export default {
  name: 'CusCheck',
  props: {
    curItem: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.CusCheck {
  cursor: pointer;
  padding: 6px 20px;
  border: 1px dashed #4b576a;
  box-sizing: border-box;
  font-size: 14px;
  color: var(--base-text-color-1);
}
</style>
