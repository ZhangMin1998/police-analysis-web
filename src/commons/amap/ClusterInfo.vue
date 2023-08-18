<template>
  <div ref="clusterInfoRef" class="map-popup-all">
    <div class="map-popup-closer" @click="closePopup">+</div>
    <div class="popup-content">
      <slot>{{ content }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clusterInfo',
  props: {
    position: {
      type: Array
    },
    visible: {
      type: Boolean
    },
    content: { type: String }
  },
  data () {
    return {
      dialogOverlay: null
    }
  },
  watch: {
    position (val) {
      if (this.dialogOverlay && !this.dialogOverlay.getIsOpen()) {
        this.dialogOverlay.open(this.$aMap, this.position)
        return
      }
      this.refresh(val)
      // if (this.dialogOverlay) {
      //   if (!this.dialogOverlay.getIsOpen()) {
      //     this.dialogOverlay.open(this.$aMap, this.position)
      //   }
      //   console.log('是否打开', this.dialogOverlay.getIsOpen());
      // } else {
      //   this.refresh(val)
      // }
      //
    },
    visible (val) {
      console.log('visible', val)
    }
  },
  methods: {
    init () {
      // eslint-disable-next-line
      this.dialogOverlay = new AMap.InfoWindow({
        isCustom: true,
        content: this.$refs.clusterInfoRef, //传入 dom 对象，或者 html 字符串
        // eslint-disable-next-line
        offset: new AMap.Pixel(130, -20),
        // anchor: 'mi-right',
        retainWhenClose: true,
        autoMove: true
      })
      setTimeout(() => {
        this.dialogOverlay.open(this.$aMap, this.position)
      })
    },
    closePopup () {
      this.$emit('update:visible', !this.visible)
      this.$emit('close')
      // this.dialogOverlay.close()
    },
    refresh (pos) {
      pos ? this.dialogOverlay.setPosition(pos) : this.dialogOverlay.close()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.map-popup-all {
  white-space: nowrap;
  position: relative;
  // left: 0;
  // bottom: 0px;
  z-index: 400;
  min-width: 200px;
  max-width: 450px;
  max-height: 265px;
  padding: 24px 40px 24px 24px;
  // background: url('~@/assets/components/MapPopup_bg.png') no-repeat;
  background: var(--icon-map-dialog-pic) no-repeat;
  background-size: 100% 100%;
  color: var(--base-text-color-1);
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  word-break: break-all;
  .map-popup-closer {
    position: absolute;
    right: 4px;
    top: 4px;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 30px;
    transform: rotate(45deg);
    color: #61708a;
    cursor: pointer;
  }
  .map-popup-closer:hover {
    color: #888;
  }
}
.map-popup-all::before {
  content: ' ';
  width: 30px;
  height: 74px;
  background: url('~@/assets/components/MapPopup_line.png') no-repeat;
  position: absolute;
  bottom: -0px;
  left: -28px;
}
</style>
