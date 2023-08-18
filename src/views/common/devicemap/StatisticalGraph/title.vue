<template>
  <div class="card-title">
    <span class="title">{{ title }}</span>
    <img class="title-suffix" src="@/assets/img/icon-title-square.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '这是标题'
    }
  }
}
</script>

<style lang="less" scoped>
.card-title {
  margin-bottom: 16px;
  .title {
    display: inline-block;
    margin-right: 10px;
    color: var(--base-text-color-1);
    font-weight: bold;
    font-size: 16px;
  }
  .title-suffix {
    display: inline-block;
  }
  img {
    width: 45px;
    height: 13px;
  }
}
</style>
