<template>
  <div>
    <MapPopup
      :position="MapPopupData.position"
      :offset="MapPopupData.offset"
      :mapShow="MapPopupData.show"
      @close="MapPopupClose"
    >
      <div class="content">
        <h5 class="clickpop-h">{{ content.title }}</h5>
        <ul>
          <li v-for="(item, index) in content.timeList" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </MapPopup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import MapPopup from '@/components/Map/OfflineMap/MapPopup'


const DEFAULT_IMG = {
  start: 'icon-route-start.png',
  by: 'icon-route-by.png',
  end: 'icon-route-end.png'
}

// const DEFAULT_COLORS = {
//   start: '#76e05d',
//   by: '#d4b021',
//   end: '#f18266'
// }

// const preUrl = '@/assets/img/'

/* eslint-disable */
export default {
  components: {
    MapPopup
  },
  inject: ['addLayer', 'removeLayer'],
  props: {
    list: {
      type: Array,
      required: true
    },
    // defaultIcons: {
    //   type: Array,
    //   required: true
    // },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'path-marker'
    },
    lineType: {
      type: String,
      default: 'line' // 线段样式可选值：line | dash
    },
    isRepeat: {
      type: Boolean,
    },
    isTrack: {
      type: Boolean,
      default: false
    },
    activeIndex: {
      type: Number
    }
  },
  data () {
    return {
      MapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      curlayer: null,
      curLine: null,
      markerList: [],
      posStrList: '',
      // list: DEFAULT_DATA,
      content: [],
      count: 1
    }
  },
  computed: {
    dataLength () {
      return this.list?.length
    },
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  watch: {
    list: function () {
      this.compositionFeature()
    }
  },
  created () {
    if (!this.isRepeat) {
      this.bus.$on('olMapClick', this.eventClick)
    }

  },

  mounted () {
    this.compositionFeature()
    if (this.isTrack) {
      this.$watch('activeIndex', (newVal, oldVal) => {
        if (!(this.markerList.length && this.markerList[newVal])) return
        if (this.count > 1 && this.markerList[oldVal]) {
          this.pointSetStyle(this.markerList[oldVal], 'default', oldVal)
        }
        this.pointSetStyle(this.markerList[newVal], 'active', newVal)
        this.count++
      })
    }
  },
  beforeDestroy () {
    this.curlayer && this.removeLayer(this.curlayer)
  },
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    next()
  },

  methods: {
    // 关闭区域弹出窗体事件
    MapPopupClose () {
      this.MapPopupData.show = false
    },
    // 转换时间
    transformTime (time) {
      return dayjs(time).format('HH:mm:ss')
    },
    // 绘制线段
    generateLine (locations) {
      // eslint-disable-next-line
      const polyline = new ol.geom.LineString(locations)
      // eslint-disable-next-line
      const routeFeature = new ol.Feature(polyline)
      const routeStyle = this.calcLineStyle(this.lineType)
      routeFeature.setStyle(routeStyle)
      routeFeature.setId('trackLine')
      return routeFeature
    },
    drawPoint (item, index) {
      /* eslint-disable */
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
    },
    // 生成标注
    generateFeature (item, index) {
      /* eslint-disable */
      const imageFeature = new ol.Feature({
        geometry: new ol.geom.Point(item.location)
      })
      /* eslint-enable */
      imageFeature.setProperties({
        index,
        position: item.location,
        ...item
      })
      //
      // const textColor = DEFAULT_COLORS[this.calcImage(index)]
      imageFeature.setStyle(
        /* eslint-disable */
        new ol.style.Style({
          image: new ol.style.Icon({
            /* eslint-enable */
            anchor: [0.5, 36],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: require(`@/assets/img/${DEFAULT_IMG[this.calcImage(index)]}`)
          })
          // text: new Text({
          //   text: item.time,
          //   fill: new Fill({
          //     color: textColor,
          //   }),
          //   offsetY: 10,
          //   scale:  1
          // }),
        })
      )
      return imageFeature
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
      let pointFun = this.isTrack ? 'drawPoint' : 'generateFeature'
      this.markerList = this.list.map((item, index) => this[pointFun](item, index))
      // 生成线
      this.posStrList = this.list.map(_c => this.toNumber(_c.location))
      this.curLine = this.generateLine(this.posStrList)
      // eslint-disable-next-line
      const markerVector = new ol.source.Vector({
        features: [...this.markerList, this.curLine]
      })
      // eslint-disable-next-line
      this.curlayer = new ol.layer.Vector({
        source: markerVector,
        className: this.layerClass
      })

      setTimeout(() => this.addLayer(this.curlayer), 100)
    },
    // 根据当前索引来计算当前图片种类 开始 中间 结束
    calcImage (index) {
      if (this.dataLength === index + 1) {
        return 'end'
      }

      if (index === 0) return 'start'
      return 'by'
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
      /* eslint-disable */
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          /* eslint-enable */
          width: 2,
          ...option
        })
      })
    },
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
        const curCotent = {
          title: curValues.title,
          timeList: curValues.timeList
        }
        this.content = curCotent
        this.MapPopupData.show = true
        this.MapPopupData.position = e.coordinate
      }
    }
  }
}
</script>

<style scoped>
.clickpop-h {
  margin-top: 0;
  margin-bottom: 6px;
}
</style>
