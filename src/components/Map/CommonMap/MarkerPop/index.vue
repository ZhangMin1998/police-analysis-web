<template>
  <div
    ref="popupShow"
    class="map-popup-all"
  >
    <slot />
  </div>
</template>
<script>


export default {
  name: 'MarkerPop',
  inject: ['addOverlay', 'removeOverlay'],
  props: {
    position: { type: Array },
    id: {
      type: [Number, String],
      default: 1
    }
  },
  data () {
    return {
      dialogOverlay: null,
    }
  },
  watch: {
    position (val) {
      console.log('val', val)
    }
  },
  methods: {
    init () {
      if (!this.dialogOverlay) {
        // eslint-disable-next-line
        this.dialogOverlay = new ol.Overlay({
          id: this.id,
          element: this.$refs['popupShow'],
          stopEvent: false,
          offset: [0, -10],
          className: 'map-popup',
          autoPanAnimation: {
            duration: 250
          }
        })
        this.refresh(this.position)
        this.addOverlay(this.dialogOverlay)
      }
    },
    refresh (pos) {
      this.dialogOverlay.setPosition(pos)
    }
  },
  mounted () {
    this.init()
  }
}

</script>
<style scoped lang="less">
.map-popup-all {
  white-space: nowrap;
  position: absolute;
  z-index: 400;
  left: 22px;
  bottom: 0px;
  min-width: 200px;
  max-width: 450px;
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
  // left: 50%;
  // transform: translateX(-50%);
}
</style>
