<template>
  <div class="car-path">
    <!-- <div ref="domCircle" class="dom-circle">
      111111
      <img src="@/assets/logo.png" alt="">
    </div> -->
  </div>
</template>

<script>
/*const DEFAULT_COLOR = {
  start: 'car-start.png',
  by: 'car-by.png',
  end: 'car-end.png',
  startAndEnd: 'car-start-with-end.png',
  activeBy: 'car-active-by.png',
  activeStart: 'car-active-start.png',
  activeEnd: 'car-active-end.png',
  activeStartAndEnd: 'car-active-startandend.png',
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
    lineList: {
      type: Array,
      required: true
    },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'car-marker'
    },
    placeNumber: {
      type: String,
      default: '9999'
    },
    activeIndex: {
      type: Number
    }
  },
  inject: ['addLayer', 'removeLayer'],
  mounted () {
    this.$nextTick(() => {
      // console.log(this.list);
      // console.log(this.lineList);
    })
    this.bus.$on('olMapClick', this.eventClick)
    this.compositionFeature()
  },
  beforeDestroy () {
    this.curlayer && this.removeLayer(this.curlayer)
  },
  data () {
    return {
      curlayer: null,
      markerList: [],
      count: 1
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
        this.compositionFeature()
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
    }
  },
  methods: {
    // 事件相关
    eventClick (e) {
      const map = this.$store.state.Ol.oMap
      const curfeature = map.forEachFeatureAtPixel(e.pixel, feature => feature, {
        layerFilter: lay => {
          return lay.className_ === this.layerClass
        }
      })
      if (curfeature) {
        const curValues = curfeature.values_
        // console.log('wewqewe', curValues);
        const curCotent = {
          title: curValues.title,
          placeAddress: curValues.placeAddress,
          placeName: curValues.placeName,
          placeId: curValues.placeId,
          placeLatitude: curValues.placeLatitude,
          placeLongitude: curValues.placeLongitude,
          coordinate: curValues.location,
        }
        this.$emit('elementClick', curCotent, false, curValues.index)
      }
    },
    // 根据当前索引来计算当前图片种类 开始 中间 结束
    calcImage (item, index, list) {
      // console.log(item);
      if (item.status === 'activeBy') {
        return 'activeBy'
      }
      if (item.status === 'activeStartAndEnd') {
        return 'activeStartAndEnd'
      }
      if (item.status === 'activeStart') {
        return 'activeStart'
      }
      if (item.status === 'activeEnd') {
        return 'activeEnd'
      }

      if (this.lineList.length > 1 && this.lineList[0].placeId === item.placeId && item.placeId === this.lineList[this.lineList.length - 1].placeId) {
        return 'startAndEnd'
      }
      if (list.length && list[0].placeId === item.placeId) {
        return 'start'
      }
      if (item.placeId === this.lineList[0].placeId) {
        return 'end'
      }
      return 'by'
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
      // 生成线
      this.posStrList = this.lineList.map(_c => this.toNumber(_c.location))
      this.curLine = this.generateLine(this.posStrList)
      const markerVector = new ol.source.Vector({
        features: [...this.markerList, this.curLine]
      })
      this.curlayer = new ol.layer.Vector({
        source: markerVector,
        className: this.layerClass
      })

      setTimeout(() => this.addLayer(this.curlayer), 100)
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
      const imageFeature = new ol.Feature({
        geometry: new ol.geom.Point(item.location)
      })
      imageFeature.setProperties({
        index,
        position: item.location,
        ...item
      })
      return this.pointSetStyle(imageFeature, 'default', index)
      // let a = this.calcImage(item, index, this.list)
      // console.log(a);
      /*imageFeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            scale: item.status === 'active' ? 1.5 : 1.2,
            src: item.status === 'active' ? require(`@/assets/img/track-active.png`) : require(`@/assets/img/tack-default.png`)
          }),
          text: new ol.style.Text({
            text: index + 1 + '',
            scale: 1.2,
            fill: new ol.style.Fill({
              color: 'white',
            }),
            textAlign: 'center',
            offsetY: -2,
            offsetX: 1
          }),
          zIndex: item.status === 'active' ? this.list.length + 1 : this.list.length - index
        })
        /!*new ol.style.Style({
          image: new ol.style.Icon({
            scale: 1.2,
            src: require(`@/assets/img/${DEFAULT_COLOR[this.calcImage(item, index, this.list)]}`)
          }),
          text: new ol.style.Text({
            text: item.title,
            scale: 1.5,
            fill: new ol.style.Fill({
              color: 'white',
            }),
          }),
        })*!/
      )
      return imageFeature*/
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
.car-path {
}
</style>
