<template>
  <div class="rightDialog" v-if="rightDialog.show">
    <div slot="title" class="title-box">
      <div class='set'>
        <img :src='require("@/assets/img/set-bg.png")' alt=''>
        <div>{{rightDialog.title}}</div>
      </div>
      <i class="el-icon-close" @click="rightDialog.handleClose" title="关闭"></i>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    rightDialog: {
      type: Object,
      default: () => {}
    },
  }
}
</script>

<style lang="less" scoped>
.rightDialog {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 424px;
  // min-width: 424px;
  height: calc(100vh - 165px);
  background: #21283E;
  padding: 16px;
  box-sizing: border-box;
  z-index: 999;
  .title-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #3D6EFF;
    .set {
      position: relative;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      color: var(--base-text-color-1);
      font-weight: bold;
      div {
        width: max-content;
        position: absolute;
        bottom: 0;
        margin-left: 10px;
      }
      img {
        width: 65px;
        height: 8px;
        margin-top: 16px;
      }
    }
    i{
      font-size:24px;
      cursor: pointer;
    }
  }
  .main-content{

  }
}
</style>
