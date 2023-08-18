<template>
  <div class="CusDrawerBottom" v-if="CusDrawerBottom.show" :style="curStyle">
    <div class="CusDrawerBottom_header">
      <list-title :title="CusDrawerBottom.title || '标题'"></list-title>

      <div class="CusDrawerBottom_header_close" @click="CusDrawerBottom.handleClose">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="CusDrawerBottom_header_contain">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CusDrawerBottom',
  props: {
    CusDrawerBottom: {
      type: Object,
      default: () => {}
    },
    curStyle: {
      type: Object,
      default: () => {
        return {
          width: 'calc(100vw - 215px)'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.CusDrawerBottom {
  position: absolute;
  bottom: 8px;
  left: 0px;
  min-height: 230px;
  // background: rgba(32, 43, 63, 0.95);
  background: var(--map-point-info-dialog-bg);
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
  z-index: 999;
  .CusDrawerBottom_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    .CusDrawerBottom_header_close {
      cursor: pointer;
      font-size: 32px;
      color: #656f81;
      &:hover {
        color: #177ddc;
      }
    }
  }
  .CusDrawerBottom_header_contain {
  }
}
</style>
