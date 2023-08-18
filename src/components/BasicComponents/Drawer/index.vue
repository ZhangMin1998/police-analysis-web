<template>
  <div
    :class="[
      'DrawerContainer',
      {
        show: drawer.isShow
      }
    ]"
    :style="{ ...cusStyle, left: !drawer.isShow ? moveLeft : oldLeft }"
  >
    <div class="DrawerWrapper" :style="{ width: width }">
      <div class="title" v-if="drawer.title">
        <list-title :title="drawer.title"></list-title>
      </div>
      <div class="DrawerSlot">
        <slot></slot>
      </div>
    </div>
    <div class="icon-con" v-if="canTraction" @click="handleClick">
      <i :class="drawer.isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
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
    moveLeft: {
      type: String,
      default: '-374px'
    },
    oldLeft: {
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
    }
  },

  methods: {
    handleClick () {
      this.$emit('handleClick')
    }
  }
}
</script>

<style lang="less" scoped>
.DrawerContainer {
  position: absolute;
  top: 19px;
  left: 19px;
  z-index: 11;
  display: flex;
  height: 96%;
  &.show {
    transition: all 1.5s ease 0s;
    transform: translateX(0px);
  }
  .icon-con {
    box-sizing: border-box;
    width: 30px;
    height: 45px;
    text-align: center;
    line-height: 56px;
    // background: #202b3f;
    // background: var(--bg-color-2);
    background: var(--car-right-chuangkou-hearder-bg);
    opacity: 0.87;
    border: 2px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    i {
      font-size: 28px;
      color: #8a98be;
    }
    &:hover i {
      color: #5288d8;
    }
  }
}
.DrawerWrapper {
  // background: #26334b;
  // background: var(--bg-color-2);
  background: var(--car-right-chuangkou-hearder-bg);
  // opacity: 0.96;
  border: 2px solid rgba(255, 255, 255, 0.1);
  min-height: 94%;
  //width: 374px;
  padding: 24px 16px 0;
  box-sizing: border-box;
  .title {
    margin-bottom: 16px;
  }
  .DrawerSlot {
    height: 98%;
  }
}
</style>
