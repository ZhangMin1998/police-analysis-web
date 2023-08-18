<template>
  <div></div>
</template>

<script>
export default {
  inject: ['addLayer'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      drawSource: null,
      drawvector: null,
      draw: null,
      curlayer: null,
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  watch: {
    open: function (val) {
      this.draw.setActive(val)
    }
  },
  mounted () {
    // this.initSelect()
    this.bus.$off('curlayer')
    this.bus.$on('curlayer', this.getCurlayer)
    setTimeout(() => this.drawRetange(), 1000)

  },
  methods: {
    getCurlayer (curlayer) {
      // console.log(curlayer);
      this.curlayer = curlayer
    },
    initSelect () {
      // eslint-disable-next-line
      this.drawSource = new ol.source.Vector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      })
      // eslint-disable-next-line
      this.drawvector = new ol.layer.Vector({
        source: this.drawSource
      })

      // this.addLayer(this.drawvector)
    },
    // 绘制矩形
    drawRetange () {
      // eslint-disable-next-line
      this.draw = new ol.interaction.Draw({
        type: 'Circle',
        // eslint-disable-next-line
        geometryFunction: ol.interaction.Draw.createBox()
      })

      this.draw.setActive(this.open)

      this.draw.on('drawend', e => {
        let polygon = e.feature.getGeometry()
        setTimeout(() => {
          let extent = polygon.getExtent()
          console.log(extent);
          let features = this.curlayer.getSource().getFeaturesInExtent(extent);
          let allFeatures = features.reduce((arr,item) => {
            arr.push(...item.values_.features)
            return arr
          },[]);
          this.$emit('selectEnd', allFeatures)
        }, 300)
        // const { feature } = e
        // let getGeometry = feature.getGeometry()
        // let extent = getGeometry.getExtent()
        // this.$emit('selectEnd', feature.get('geometry'))
      })
      this.map.addInteraction(this.draw)
    },
    // 判断点是否在矩形内
    checkPointInPolygon (polygonFeature) {
      return this.list.filter(item => polygonFeature.intersectsCoordinate(item.position))
    }
  }
}
</script>

<style>
</style>
