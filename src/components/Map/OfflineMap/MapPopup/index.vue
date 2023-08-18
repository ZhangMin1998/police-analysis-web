<template>
  <!-- 弹窗 start -->
  <div ref="mapPopup" class="map-popup-all" v-show="popupShow">
    <div class="map-popup-closer" @click="closePopup">+</div>
    <div id="popup-content">
      <slot>{{ content }}</slot>
    </div>
  </div>
  <!-- 弹窗 end -->
</template>
<script>
// 弹窗组件
export default {
  name: 'MapPopup',
  inject: ['addOverlay'],
  props: {
    position: { type: Array },
    className: { type: String },
    mapShow: { type: Boolean },
    title: { type: String },
    offset: { type: Array },
    content: { type: String }
  },
  data () {
    return {
      popupShow: true,
      dialogOverlay: null
    }
  },
  watch: {
    position: {
      handler () {
        this.reload()
      },
      deep: true
    },
    mapShow: {
      handler (val) {
        this.popupShow = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.reload()
    })
  },
  methods: {
    reload () {
      // eslint-disable-next-line
      this.dialogOverlay = new ol.Overlay({
        element: this.$refs.mapPopup,
        name: this.title,
        stopEvent: false,
        offset: this.offset || [0, 0],
        className: this.className || 'map-popup',
        autoPanAnimation: {
          duration: 250
        }
      })
      this.dialogOverlay.setPosition(this.position)
      this.addOverlay(this.dialogOverlay)
    },
    closePopup () {
      this.$emit('close', this.content)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.map-popup-all {
  white-space: nowrap;
  position: absolute;
  z-index: 400;
  left: 22px;
  bottom: 0px;
  min-width: 200px;
  max-width: 550px;
  padding: 24px 40px 24px 24px;
  // background: url('~@/assets/components/MapPopup_bg.png') no-repeat;
  background: var(--icon-map-dialog-pic) no-repeat;
  background-size: 100% 100%;
  // color: var(--base-text-color-1);
  color: var(--base-text-color-1);
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  word-break: break-all;
  #popup-content ul{
  max-height: 200px;
  overflow: auto;
}
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
