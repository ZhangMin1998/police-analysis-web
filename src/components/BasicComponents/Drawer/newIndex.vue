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
    <div :class="{'drawerBoxOpen': isOpen, 'drawerBox': !isOpen}">
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
    // console.log(JSON.parse(JSON.stringify(this.drawerTop)))
    // console.log(JSON.parse(JSON.stringify(this.drawerTop)) === '{}');
    if (JSON.stringify(this.drawerTop) === '{}') {
      this.$nextTick(() => {
        let imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
        this.drawerTop.width = imgWidth
        this.drawerTop.height = '5px'
      })

    }
  },
  methods: {
    handleClick () {
      this.isOpen = !this.isOpen
      // if (this.drawer.isShow) {
      //   let sty = document.getElementsByClassName('drawerBoxOpen')[0]
      //   sty.setAttribute("class","drawerBox")
      // } else {
      //   let sty = document.getElementsByClassName('drawerBox')[0]
      //   sty.setAttribute("class","drawerBoxOpen")
      // }
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
  // display: flex;
  // height: 96%;
  &.show {
    transition: all 1.5s ease 0s;
    transform: translateX(0px);
  }
  .drawerBox {
    position: relative;
    display:flex;
    &::before {
      display: none;
    }
  }
  .drawerBoxOpen{
    position: relative;
    display:flex;
    &::before {
      position: absolute;
      left: 0;
      display: block;
      content: '';
      width: 100%;
      height: 6px;
      top: -6px;
      background-image: var(--drawer-top-bg);
      background-size: 100% 100%;
    }
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
    // opacity: 0.87;
    // border: 2px solid rgba(255, 255, 255, 0.06);
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
.drawerBox{
  min-height: 94%;
}
.DrawerWrapper {
  // background: #192035;
  // background: var(--bg-color-2);
  background: var(--car-right-chuangkou-hearder-bg);
  // background: var(--bg-color-3);
  // opacity: 0.96;
  // border: 2px solid rgba(255, 255, 255, 0.1);
  // min-height: 94%;
  //width: 374px;
  padding: 16px 16px;
  box-sizing: border-box;
  .title {
    margin-bottom: 16px;
  }
  .DrawerSlot {
    height: 98%;
  }
}
</style>
