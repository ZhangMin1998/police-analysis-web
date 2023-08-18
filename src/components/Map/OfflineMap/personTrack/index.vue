<template>
  <div class="car-path"></div>
</template>

<script>
// import { stringify } from 'flatted'
/*const DEFAULT_COLOR = {
  default: 'personTrack-default.png',
  active: 'personTrack-active.png'
}*/
/* eslint-disable */
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    lineType: {
      type: String,
      default: 'line' // 线段样式可选值：line | dash
    },
    // lineList: {
    //   type: Array,
    //   required: true
    // },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'car-marker'
    },
    activeIndex: {
      type: Number
    },
    showLine: {
      type: Boolean,
      default: true
    },
    // map: {
    //   type: Object,
    //   default: () => {}
    // },
    // placeNumber: {
    //   type: String,
    //   default: '9999'
    // }
  },
  inject: ['addLayer', 'removeLayer'],
  mounted () {
    // this.bus.$on('olMapClick', this.eventClick)
    if (this.map) this.compositionFeature()
  },
  beforeDestroy () {
    this.curlayer && this.removeLayer(this.curlayer)
  },
  data () {
    return {
      curlayer: null,
      markerList: [],
      count: 1,
      map: null
    }
  },
  computed: {
    // dataLength () {
    //   return this.lineList?.length
    // },
    // map () {
    //   return this.$store.state.Ol.oMap
    // }
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
    activeIndex: {
      handler (newVal, oldVal) {
        if (!(this.markerList.length && this.markerList[newVal])) return
        if (this.count > 1 && this.markerList[oldVal]) {
          this.pointSetStyle(this.markerList[oldVal], 'default', oldVal)
        }
        this.pointSetStyle(this.markerList[newVal], 'active', newVal)
        this.count++
      }
    },
    map (val) {
      this.compositionFeature()
    },
  },
  methods: {
    // 事件相关
    eventClick (e) {
      // console.log(this.$store.state.Ol.oMap)
      const map = this.map
      const curfeature = map.forEachFeatureAtPixel(e.pixel, feature => feature, {
        layerFilter: lay => {
          return lay.className_ === this.layerClass
        }
      })
      if (curfeature) {
        const curValues = curfeature.values_
        const curCotent = {
          // title: curValues.title,
          placeName: curValues.placeName,
          placeAddress: curValues.placeAddress,
          placeId: curValues.placeId,
          placeLatitude: curValues.latitude,
          placeLongitude: curValues.longitude,
          longitudeNew: curValues.longitudeNew,
          latitudeNew: curValues.latitudeNew,
          dataTypeStr: curValues.dataTypeStr,
          dataType: curValues.dataType,
          collectTime: curValues.collectTime,
          srcFieldName: curValues.srcFieldName,
          srcName: curValues.srcName,
          dataSource: curValues.dataSource,
          odsHash: curValues.odsHash,
          popContent: curValues.popParam
        }
        this.$emit('elementClick', curCotent, curValues.index)
      }
      // this.compositionFeature()
    },
    // 根据当前索引来计算当前图片种类 开始 中间 结束
    calcImage (item) {
      if (item.status === 'active') {
        return 'active'
      }
      return 'default'
    },
    // 字符串转数字
    toNumber (location) {
      return location.map(item => parseFloat(item))
    },
    // 渲染
    compositionFeature () {
      // 如果有图层，则去除之前图层，但是会造成闪烁
      this.curlayer && this.removeLayer(this.curlayer)
      this.count = 1
      // 生成点位信息 generateFeature
      this.markerList = this.list.map((item, index) => this.generateFeature(item, index))
      // console.log(this.markerList)
      // return
      // 生成线
      let markerVector
      if (this.showLine) {
        this.posStrList = this.list.filter(item => item.longitude && item.latitude).map(_c => this.toNumber(_c.location))
        this.curLine = this.generateLine(this.posStrList)

        // eslint-disable-next-line
        markerVector = new ol.source.Vector({
          features: [...this.markerList, this.curLine]
        })
      } else {
        // eslint-disable-next-line
        markerVector = new ol.source.Vector({
          features: [...this.markerList]
        })
      }

      // eslint-disable-next-line
      this.curlayer = new ol.layer.Vector({
        source: markerVector,
        className: this.layerClass
      })

      this.$nextTick(() => {
        this.addLayer(this.curlayer)
      })
      // this.addLayer(this.curlayer)
      // setTimeout(() => this.addLayer(this.curlayer), 100)
    },
    removeMarker () {
      this.curlayer && this.removeLayer(this.curlayer)
    },
    // 绘制线段
    generateLine (locations) {
      const polyline = new ol.geom.LineString(locations)
      const routeFeature = new ol.Feature(polyline)
      const routeStyle = this.calcLineStyle(this.lineType)
      routeFeature.setStyle(routeStyle)
      routeFeature.setId('trackLine')
      return routeFeature
    },
    calcLineStyle (type) {
      let option = {}
      if (type === 'line') {
        option = {
          color: '#c93e41'
        }
      } else {
        option = {
          lineDash: [1, 2, 3, 4, 5, 6],
          color: '#d4b021'
        }
      }
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 2,
          ...option
        })
      })
    },
    // 生成标注
    generateFeature (item, index) {
      // if (!(item.latitude && item.longitude)) {
      //   return ''
      // }
      const imageFeature = new ol.Feature({
        geometry: new ol.geom.Point(item.location)
      })
      imageFeature.setProperties({
        index,
        position: item.location,
        ...item
      })
      return this.pointSetStyle(imageFeature, 'default', index)
    },
    pointSetStyle (point, state, ind) {
      point.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            scale: state === 'active' ? 1.5 : 1.2,
            src: state === 'active' ? require(`@/assets/img/track-active.png`) : require(`@/assets/img/tack-default.png`)
          }),
          text: new ol.style.Text({
            text: ind + 1 + '',
            scale: 1.2,
            fill: new ol.style.Fill({
              color: 'white',
            }),
            textAlign: 'center',
            offsetY: -2,
            offsetX: 1
          }),
          zIndex: state === 'active' ? this.list.length + this.count : this.list.length - ind
        })
      )
      return point
    }
  }
}
</script>

<style lang="less" scoped>
</style>

