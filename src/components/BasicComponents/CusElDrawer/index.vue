<template>
  <div>
    <el-drawer
      custom-class="custom-drawer"
      :visible.sync="Drawer.isShow"
      :direction="Drawer.direction || 'rtl'"
      :size="Drawer.size || '20%'"
      :before-close="handleClose"
    >
      <template v-slot:title>
        <div slot="title" class="title-box">
          <div class='set'>
            <img :src='require("@/assets/img/set-bg.png")' alt=''>
            <div>{{Drawer.title}}</div>
          </div>
          <i class="el-icon-close" title="关闭" @click="handleClose"></i>
        </div>
        <!-- <div>
          <list-title :title="Drawer.title"></list-title>
        </div> -->
      </template>
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    Drawer: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang="less" scoped>
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
/deep/.el-drawer__close-btn{
  display: none;
}
/deep/.el-drawer__body{
  padding: 0 24px !important;
}
/deep/.el-drawer__header{
  margin-bottom: 16px;
}
</style>
