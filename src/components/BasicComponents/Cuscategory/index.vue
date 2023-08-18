<template>
  <div class="Cuscategory" :style="{ color: curItem.color }">
    <div
      v-if="curItem.num || curItem.num == 0"
      class="Cuscategory_num"
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
      {{ curItem.num }}
    </div>
    <div
      class="Cuscategory_label"
      :style="{
        borderColor: curItem.isActive ? curItem.color : '#4b576a',
        color: curItem.isActive ? curItem.color : '#C0D0E7'
      }"
    >
      {{ curItem.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cuscategory',
  props: {
    curItem: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.Cuscategory {
  display: flex;
  cursor: pointer;
  .Cuscategory_num {
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    text-align: center;
    line-height: 28px;
    border: 2px solid #4b576a;
    border-right: none;
  }
  .Cuscategory_label {
    height: 32px;
    line-height: 28px;
    box-sizing: border-box;
    padding: 0 12px;
    border: 2px solid #4b576a;
  }
}
</style>
