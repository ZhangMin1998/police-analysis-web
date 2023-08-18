<template>
  <div></div>
</template>

<script>


export default {
  inject: ['addLayer', 'removeLayer'],
  props: {
    list: {
      // 渲染的标注
      type: Array,
      default: () => []
    },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'count-marker-offline',
    },
  },
  data () {
    return {
      markerList: [],
      curlayer: null,
      addTimer: null
    }
  },
  methods: {
    // 生成标注
    /* eslint-disable */
    generatorOverlay(pos, index) {
      const curfeature = new ol.Feature({
        geometry: new ol.geom.Point(pos),
      })

      // 设置自定义属性
      curfeature.setProperties({
        index,
        pos,
      })

      curfeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 12,
            fill: new ol.style.Fill({
              color: 'rgba(230, 69, 69, 1)',
            }),
          }),
          text: new ol.style.Text({
            text: (index + 1).toString(),
            fill: new ol.style.Fill({
              color: '#fff',
            }),
          }),
        })
      )
      return curfeature
    },
    /* eslint-enable */
    // 生成图层
    generatorLayer () {
      // 如果有图层，则去除之前图层，但是会造成闪烁
      this.curlayer && this.removeLayer(this.curlayer)
      this.markerList = this.list.map((item, index) => {
        if (item.longitude) {
          return this.generatorOverlay([item.longitude, item.latitude], index)
        } else {
          return this.generatorOverlay(item, index)
        }
      }).filter(_c => _c)
      // eslint-disable-next-line
      const curVector = new ol.source.Vector({
        features: this.markerList,
      })
      // eslint-disable-next-line
      this.curlayer = new ol.layer.Vector({
        source: curVector,
        className: this.layerClass,
      })

      // 添加图层到 map
      this.addTimer && clearTimeout(this.addTimer)
      this.addTimer = setTimeout(() => {
        this.addLayer(this.curlayer)
      }, 100)
    },
    // 事件相关
    eventClick (e) {
      const map = this.$store.state.Ol.oMap
      const curfeature = map.forEachFeatureAtPixel(e.pixel, feature => feature, {
        layerFilter: lay => {
          return lay.className_ === this.layerClass
        },
      })
      if (curfeature) {
        this.$emit('clickMarker', curfeature.values_)
      } else {
        this.$emit('clickOrther')
      }
    },
    remove () {
      this.curlayer && this.removeLayer(this.curlayer)
    },
  },
  watch: {
    list: function () {
      this.generatorLayer()
    },
  },
  mounted () {
    this.bus.$on('olMapClick', this.eventClick)
    this.generatorLayer()
  },
  beforeDestroy () {
    this.remove()
    // this.bus.$off('olMapClick')
  },
}
</script>

<style></style>
