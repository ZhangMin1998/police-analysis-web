<template>
  <div v-if="content" style="padding: 6px 10px">
    {{ content }}
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Array,
      default: () => [112.461577, 23.0727397]
    },
    iconUrl: {
      type: String,
      default: 'icon-tab-small-1.png'
    },
    content: {
      type: String,
      default: '标注'
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['addLayer', 'addOverlay', 'removeLayer'],
  data () {
    return {
      popup: null,
      curLayer: null
    }
  },
  methods: {
    initMarker () {
      this.generateTitle()
      setTimeout(() => {
        // this.addLayer(vectorLayer)
        this.addOverlay(this.popup)
      }, 200)
    },
    generateTitle () {
      // eslint-disable-next-line
      this.popup = new ol.Overlay({
        className: 'title-marker-overlay',
        element: this.$el,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -25],
        population: 4000,
        rainfall: 500
      })
      this.addOverlay(this.popup)
      this.$nextTick(() => {
        this.popup.setPosition(this.position)
      })
    }
  },
  mounted () {
    this.initMarker()
  },
  beforeDestroy () {
    this.removeLayer(this.popup)
  }
}
</script>

<style lang="less">
.title-marker-overlay {
  // padding: 6px 10px;
  color: var(--base-text-color-1);
  font-size: 14px;
  border-radius: 2px;
  // background: rgba(53, 67, 92);
  background: var(--bg-color-2);
}
</style>
