<template>
  <div></div>
</template>

<script>


export default {
  props: {
    position: {
      type: Array,
      default: () => [112.461577, 23.0727397],
    },
    content: {
      type: [String, Number],
      default: 1,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ['addLayer', 'removeLayer'],
  data () {
    return {
      curLayer: null,
    }
  },
  methods: {
    initMarker () {
      // eslint-disable-next-line
      const iconFeature = new ol.Feature({
        // eslint-disable-next-line
        geometry: new ol.geom.Point(this.position),
        population: 4000,
        rainfall: 500,
      })

      iconFeature.setProperties({
        ...this.item,
      })
      /* eslint-disable */
      let iconStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 16,
          fill: new ol.style.Fill({
            color: 'rgba(69, 150, 230, 1)',
          }),
        }),
        text: new ol.style.Text({
          text: this.content.toString(), // 以聚合点的数量作为显示的内容
          fill: new ol.style.Fill({
            color: '#fff',
          }),
        }),
      })
      /* eslint-enable */
      iconFeature.setStyle(iconStyle)
      // eslint-disable-next-line
      const vectorSource = new ol.source.Vector({
        features: [iconFeature],
      })
      // eslint-disable-next-line
      const curLayer = new ol.layer.Vector({
        className: 'pure-marker',
        source: vectorSource,
      })

      setTimeout(() => {
        this.addLayer(curLayer)
      }, 200)
    },
  },
  mounted () {
    this.initMarker()
  },
  beforeDestroy () {
    // this.removeLayer(this.curLayer)
  },
}
</script>

<style></style>
