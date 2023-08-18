<template>
  <div class="CusDrawerRight" v-if="CusDrawerRight.show">
    <div class="CusDrawerBottom_header">
      <div class="img-box">
        <i class='iconfont icon-guiji'></i>
      </div>
      <div class="place">
        <!-- {{CusDrawerRight.title || '--'}} -->
        <EllipsisPop :content='CusDrawerRight.title'></EllipsisPop>
        </div>
      <div class="close-btn" @click="CusDrawerRight.handleClose">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="CusDrawerBottom_contain">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  components: {
    EllipsisPop
  },
  props:{
    CusDrawerRight: {
      type: Object,
      default: () => {}
    },
  }
}
</script>

<style lang="less" scoped>
.CusDrawerRight {
  position: absolute;
  right: 16px;
  top: 70px;
  min-width: 320px;
  height: calc(100vh - 200px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  // background: var(--car-right-chuangkou-bg);
  background: var(--car-right-chuangkou-bg);
  padding: 16px;
  box-sizing: border-box;
  z-index: 999;
  .CusDrawerBottom_header {
    display: flex;
    justify-content: flex-start;
    // align-items: center;
    height: 32px;
    line-height: 32px;
    padding-left: 8px;
    padding-right: 12px;
    background-color: var(--car-right-chuangkou-hearder-bg);
    box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
    .img-box{
      display:flex;
      align-items: center;
      i {
        font-size: 16px;
        color: var(--base-text-color-to-999999);
      }
    }
    .place{
      width: 215px;
      margin-left: 12px;
      flex: 1;
    }
    .close-btn {
      cursor: pointer;
      font-size: 20px;
      color: #656f81;
      &:hover {
        // color: #177ddc;
        color: var(--active-color);
      }
    }
  }
  .CusDrawerBottom_contain{

  }
}
</style>
