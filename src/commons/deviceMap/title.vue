<template>
  <div class="title">
    <img class="img" :src="require('@/assets/img/title-header.png')" alt="" />
    <span>
      {{ title }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  /* display: inline-block; */
  display: flex;
  min-width: 133px;
  /* height: 32px;
  line-height: 32px; */
  font-size: 18px;
  font-weight: bold;
  /* color: #c0d0e7; */
  color: var(--base-text-color-1);
  /* background: url('~@/assets/img/device-list-title-bg-little-blue.png') no-repeat; */
  /* background: url('~@/assets/img/device-list-title-bg-little-blue.png') no-repeat; */
  background-size: 100% 100%;
  position: relative;
  // padding: 0 16px 0 12px;
  box-sizing: border-box;
  .img{
    margin-right: 8px;
  }
}
</style>
