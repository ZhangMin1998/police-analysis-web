<template>
  <div></div>
</template>
<script>
import { mapState } from 'vuex'
import { generateFeatureStyle, generateClusterStyle, CIRCLE_ZOOM } from './cluster'
const NORMAL_DISTANCE = 60
const DISTANCE_ZOOM = 16
const MAX_DISANCE = 100
export default {
  name: 'MarkerClusterer',
  props: {
    list: { type: Array, default: () => [] },
    clusterType: { type: String, default: 'place' },
    show: { type: Boolean }
  },
  data () {
    return {
      cluster: null,
      MarkerList: null
    }
  },
  computed: {
    ...mapState('User', {
      zoom: 'zoom'
    }),
    ...mapState('Common', {
      cMap: 'cMap'
    })
  },
  watch: {
    list: {
      handler: function (val) {
        if (!this.cMap) return
        this.removeMarkers()
        if (val.length === 0) return

        this.MarkerList = this.MapMarker()
        this.MapCluster(this.MarkerList)
      },
      deep: true,
      immediate: false
    },

    cMap (val) {
      if (!val) return

      this.MarkerList = this.MapMarker()
      this.MapCluster(this.MarkerList)
    },

    zoom (val) {
      if (!this.cluster) return
      const curDistance = this.cluster.getGridSize()
      const changeDistance = val >= DISTANCE_ZOOM ? NORMAL_DISTANCE : MAX_DISANCE
      if (curDistance === changeDistance) return
      this.cluster.setGridSize(changeDistance)
    }
  },
  methods: {
    MapMarker () {
      const list = this.list.map(_c => {
        let extData = {}
        if (this.clusterType === 'device') {
          // 设备 聚合显示
          extData = {
            position: _c.position,
            content: `<div class="${this.clsName(_c.deviceType, _c.online)} icon-img-box"></div>`,
            title: _c.deviceName,
            extData: {
              type: _c.deviceType,
              online: _c.online,
              id: _c.id,
              position: _c.position
            }
          }
        } else if (this.clusterType === 'place') {
          // 场所聚合显示
          extData = {
            position: _c.position,
            content: `<div class="icon-small-9"></div>`,
            title: _c.placeName,
            extData: {
              ..._c,
              site: true // 标记是场所
            }
          }
        }
        // eslint-disable-next-line
        const marker = new AMap.Marker(extData)

        // 单个坐标点点击事件
        marker.on('click', e => {
          const extData = e.target.getExtData()
          const { position } = extData

          this.bus.$emit('handleCenter', position, this.$store.state.User.zoom)
          this.$emit('handleMarkerClick', extData)
        })
        return marker
      })
      return list
    },

    // 聚合图
    MapCluster (list) {
      const _this = this
      // eslint-disable-next-line
      AMap.plugin(['AMap.MarkerClusterer'], () => {
        // eslint-disable-next-line
        this.cluster = new AMap.MarkerClusterer(this.cMap, list, {
          maxZoom: 20,
          gridSize: NORMAL_DISTANCE,
          renderClusterMarker: _this.renderClusterMarker,
          clusterByZoomChange: false,
          averageCenter: true,
          zoomOnClick: true
        })

        // 聚合图点击事件
        this.cluster.on('click', e => {
          if (this.zoom <= CIRCLE_ZOOM) return
          const markerList = e.markers.map(marker => marker.getExtData())
          const clickData = {
            position: [e.lnglat.lng, e.lnglat.lat],
            markerList
          }
          this.$emit('handleClickCluster', clickData)
        })
      })
    },
    renderClusterMarker (context) {
      const styleCache = new Map()
      let markerDom
      if (this.clusterType === 'device') {
        markerDom = generateFeatureStyle(context, styleCache)
      } else if (this.clusterType === 'place') {
        markerDom = generateClusterStyle(context, styleCache)
      }
      context.marker.setContent(markerDom)
    },

    // 删除一组聚合的点标记 (markers:Array<Marker>)
    removeMarkers () {
      if (this.cluster?.removeMarkers) {
        this.cluster?.removeMarkers(this.MarkerList)
        this.cluster = null
        this.MarkerList = null
      }
    },

    clsName (deviceType, online) {
      return `icon-small-${deviceType}` + online ? '' : '-g'
    }
  }
}
</script>
<style scoped>
</style>
