<template>
  <div></div>
</template>

<script>
const NORMAL_DISTANCE = 60

// import Popover from '_com/popover'
import { mapState } from 'vuex'
import { generateFeatureChooseStyle, CIRCLE_ZOOM } from '@/commons/amap/cluster.js'

export default {
  // components: {
  //   Popover
  // },
  props: {
    markerList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      overlay: null,
      cluster: null,
      renderClusterMarker: null,
      markerMap: {} // 对象映射,需要冻结
    }
  },
  computed: {
    ...mapState('User', {
      'zoom': 'zoom'
    })
  },
  created () {
    this.markerDomList = null // 实例化 marker 列表，防止被数据劫持
    this.initCluster()
  },
  methods: {
    calcClass (type, isActive = false) {
      const pre = 'icon-small'
      if (type < 1 || type > 8) type = 1
      return isActive ? `${pre}-${type}` : `${pre}-${type}-g`
    },
    initMarker () {
      let that = this
      let list = []
      this.markerDomList = list = this.markerList.map(item => {
        const markerClass = this.calcClass(item.deviceType)
        // eslint-disable-next-line
        let marker = new AMap.Marker({
          position: item.position,
          content: `<div class="${markerClass} icon-img-box"></div>`,
          title: item.deviceName,
          extData: {
            ...item
          }
        })
        marker.on('click', e => {
          that.$emit('clickMarker', e)
        })
        // 分类 - 方便做显示隐藏控制
        this.addMarker(marker, item.deviceType)
        return marker
      })
      return list
    },
    initCluster () {
      const initMarkerList = this.initMarker()
      setTimeout(() => {
        // eslint-disable-next-line
        AMap.plugin(['AMap.MarkerClusterer'], () => {
          this.initClusterRender()
          Object.freeze(this.markerMap)
          this.setCluster(this.$aMap, initMarkerList)
        }, 300)
      })
    },
    initClusterRender () {
      const styleCache = new Map()
      this.renderClusterMarker = context => {
        const markerDom = generateFeatureChooseStyle(context, styleCache)
        context.marker.setContent(markerDom)
      }
    },
    setCluster (map, list) {
      // eslint-disable-next-line
      this.cluster = new AMap.MarkerClusterer(map, list, {
        maxZoom: 20,
        gridSize: NORMAL_DISTANCE,
        renderClusterMarker: this.renderClusterMarker,
        clusterByZoomChange: false,
        averageCenter: true,
        zoomOnClick: true,
      })

      this.cluster.on('click', e => {
        if (this.zoom <= CIRCLE_ZOOM) return
        ;this.$emit('clickCluster', {...e, obj: this.cluster})
      })
    },
    addMarker (marker, type) {
      if (this.markerMap[type]) {
        this.markerMap[type].push(marker)
      } else {
        this.markerMap[type] = [marker]
      }
    }
  }
}
</script>

<style scoped>
.device-overlay {
  z-index: 10;
  position: relative;
}
.device-overlay img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
</style>
