<template>
  <div class="popup" ref="hoverpop">
    <div class="content">{{ content }}</div>
  </div>
</template>

<script>

export default {
  props: {
    topOffset: {
      type: Number,
      default: -50
    },
    content: {
      type: String,
      default: ''
    },
    pos: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      popup: null // hover 标志
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  mounted () {
    this.initPop()
    if (this.map) {
      this.onMethods()
    } else {
      setTimeout(() => {
        this.onMethods()
      }, 300)
    }
  },
  beforeDestroy () {
    this.popup && this.map.removeOverlay(this.popup)
  },
  updated () {
    this.initPop()
  },
  methods: {
    initPop () {
      // eslint-disable-next-line
      this.popup = new ol.Overlay({
        element: this.$el,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, this.topOffset],
        population: 4000,
        rainfall: 500
      })
      this.map.addOverlay(this.popup)
      this.$nextTick(() => {
        this.popup.setPosition(this.pos)
      })
    },
    onMethods () {
      this.map.on('singleclick', e => {
        let pixel = this.map?.getEventPixel(e.originalEvent)
        let feature = this.map?.forEachFeatureAtPixel(pixel, f => f)
        if (!feature) {
          if (this.popup) {
            this.map.removeOverlay(this.popup)
          }
          this.$emit('cancelCallback')
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
