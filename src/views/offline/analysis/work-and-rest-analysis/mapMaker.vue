<template>
  <div class="mapMaker">
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'car-marker'
    }
  },
  inject: ['addLayer', 'removeLayer'],
  mounted () {
    // this.bus.$on('olMapClick', this.eventClick)
    this.compositionFeature()
  },
  beforeDestroy () {
    this.curlayer && this.removeLayer(this.curlayer)
  },
  data () {
    return {
      curlayer: null,
      markerList: []
    }
  },
  computed: {
    // dataLength () {
    //   return this.lineList?.length
    // },
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  watch: {
    list: {
      handler () {
        // console.log(val, '检测到了变化');
        this.compositionFeature()
        // if (!val.length) {
        //   this.removeMarker()
        // }
      },
      deep: true
    },
  },
  // created () {
  //   this.unique(this.list)
  // },
  methods: {
    // 字符串转数字
    // toNumber (location) {
    //   return location.map(item => parseFloat(item))
    // },
    // 渲染
    compositionFeature () {
      //  this.unique(this.list)
      // 如果有图层，则去除之前图层，但是会造成闪烁
      this.curlayer && this.removeLayer(this.curlayer)
      // 生成点位信息 generateFeature
      this.markerList = this.list.map((item, index) => this.generateFeature(item, index))

      // eslint-disable-next-line
      const markerVector = new ol.source.Vector({
        features: [...this.markerList]
      })
      // eslint-disable-next-line
      this.curlayer = new ol.layer.Vector({
        source: markerVector,
        className: this.layerClass
      })

      setTimeout(() => this.addLayer(this.curlayer), 100)
    },
    removeMarker () {
      this.curlayer && this.removeLayer(this.curlayer)
    },
    // 生成标注
    generateFeature (item, index) {
      // console.log(item,index)
      /* eslint-disable */
      const imageFeature = new ol.Feature({
        geometry: new ol.geom.Point(item.position)
      })
      /* eslint-enable */
      imageFeature.setProperties({
        index,
        // position: item.position,
        ...item
      })
      imageFeature.setStyle(
        /* eslint-disable */
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 16,
            fill: new ol.style.Fill({
              color: 'rgba(69, 150, 230, 1)',
            }),
          }),
          text: new ol.style.Text({
            text: this.getCount(item),
            // scale: 1.5,
            fill: new ol.style.Fill({
              color: '#fff',
            }),
          }),
        })
      )
      return imageFeature
    },
    getCount (item) {
      if (item.count) {
        return item.count.toString()
      } else {
        return '1'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
