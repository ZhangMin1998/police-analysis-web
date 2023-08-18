<template>
<div class='no_empty_wrap'>
  <img :src='require("@/assets/img/no-data.png")' alt=''>
  <div class='tip'>{{ emptyTip }}</div>
</div>
</template>

<script>
export default {
  name: 'NoEmpty',
  props: {
    emptyTip: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.no_empty_wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    width: 80px;
    height: 80px;
    margin-top: 8px;
  }
  .tip {
    font-size: 16px;
    color: var(--base-text-color-to-666666);
  }
}
</style>
