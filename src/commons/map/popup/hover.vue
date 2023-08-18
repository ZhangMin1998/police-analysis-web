<template>
  <div v-if="isHoverShow && hoverContent" class="popup" ref="hoverpop">
    <div class="content">{{ hoverContent }}</div>
  </div>
</template>

<script>
const LAYER_NAME = 'marker' // 标注图层属性，为了区分多个标注在同一经纬度

export default {
  props: {
    topOffset: {
      type: Number,
      default: -50
    }
  },
  data () {
    return {
      hoverPopUp: null, // hover 标志
      isHoverShow: false,
      hoverContent: ''
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap1
    }
  },
  mounted () {
    if (this.map) {
      this.pointermove()
    } else {
      setTimeout(() => {
        this.pointermove()
      }, 300)
    }
  },
  methods: {
    pointermove () {
      this.map.on('pointermove', e => {
        let pixel = this.map?.getEventPixel(e.originalEvent)
        let feature = this.map?.forEachFeatureAtPixel(pixel, f => f)
        if (feature) {
          // WARNING: 矢量地图才有
          if (feature.id_) {
            this.map.getTargetElement().style.cursor = 'auto'
            this.hoverPopUp = null
            this.isHoverShow = false
            return
          }
          const curFeatures = feature.get('features')
          if (feature.get('layerType') === LAYER_NAME) {
            // 如果已经 hover 了，就取消当次 Hover
            if (this.hoverPopUp) return
            const curFeature = curFeatures[0]
            this.hoverContent = curFeature.get('hoverName')
            const coordinates = feature.getGeometry().getCoordinates()
            // eslint-disable-next-line
            this.hoverPopUp = new ol.Overlay({
              element: this.$el,
              positioning: 'bottom-center',
              stopEvent: false,
              offset: [0, this.topOffset],
              population: 4000,
              rainfall: 500
            })
            this.isHoverShow = true
            this.map.addOverlay(this.hoverPopUp)
            this.$nextTick(() => {
              this.hoverPopUp.setPosition(coordinates)
            })
          }
        } else {
          if (this.hoverPopUp) {
            this.map.removeOverlay(this.hoverPopUp)
            this.isHoverShow = false
            this.hoverPopUp = null
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
