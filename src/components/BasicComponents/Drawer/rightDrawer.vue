<template>
  <div
    :class="[ 'DrawerContainer', { show: drawer.isShow} ]"
    :style="{ ...cusStyle, right: !drawer.isShow ? moveRight : oldRight }"
  >
    <!-- <div :class="{'drawerBoxOpen': drawer.isShow, 'drawerBox': !drawer.isShow}"> -->
    <div class="DrawerWrapper" :style="{ width: width }">
      <div slot="title" class="title-box">
        <div class='set'>
          <img :src='require("@/assets/img/set-bg.png")' alt=''>
          <div>{{drawer.title}}</div>
        </div>
        <i class="el-icon-close" title="关闭" @click="close"></i>
      </div>
      <div class="DrawerSlot">
        <slot></slot>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>

export default {
  props: {
    drawer: {
      type: Object
    },
    cusStyle: {
      type: Object
    },
    moveRight: {
      type: String,
      default: '-374px'
    },
    oldRight: {
      type: String,
      default: '16px'
    },
    width: {
      type: String,
      default: ''
    },
    canTraction: {
      type: Boolean,
      default: true
    },
    drawerTop: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isOpen: true
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.isOpen = !this.isOpen
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.DrawerContainer {
  overflow: hidden;
  position: absolute;
  z-index: 99999;
  &.show {
    transition: all 0.5s ease 0s;
    transform: translateX(0px);
  }
}
.DrawerWrapper {
  height: calc(100vh - 120px);
  // background: pink;
  background: var(--car-right-chuangkou-bg);
  padding: 16px 16px;
  box-sizing: border-box;
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
  .DrawerSlot {
    height: 98%;
  }
}
</style>
