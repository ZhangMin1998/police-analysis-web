<template>
  <div class="card-title" :style="curStyle">
    <span class="title" v-if="title">{{ title }}</span>
    <img v-if="isShowImg" class="title-suffix" src="@/assets/img/icon-title-square.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '这是标题'
    },
    curStyle: {
      type: Object,
      default: () => {
        return {
          'margin-bottom': '16px'
        }
      }
    },
    isShowImg: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.card-title {
  display: flex;
  align-items: center;
  .title {
    display: inline-block;
    margin-right: 10px;
    color: var(--base-text-color-1);
    font-size: 16px;
    font-weight: bold;
  }
  .title-suffix {
    display: inline-block;
  }
}
</style>
