<template>
  <div id="container" :style="curStyle">
    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
import { generateFeatureStyle, generateClusterStyle, CIRCLE_ZOOM } from './cluster'
import SiteMixin from './siteMinxin'
import Vue from 'vue'

const DISTANCE_ZOOM = 16
const MAX_DISANCE = 100
const NORMAL_DISTANCE = 60
export default {
  mixins: [SiteMixin],
  props: {
    center: {
      // 坐标中心点
      type: Array,
      required: true,
      validator: value => value.length === 2
    },
    curStyle: {
      type: String,
      default: 'height:100%'
    },
    crs: {
      //地图显示的参考坐标系
      type: String,
      default: 'EPSG:4326'
    },
    cluster: {
      // 是否聚合
      type: Boolean,
      default: false
    },
    isSiteCluster: {
      type: Boolean,
      default: false
    },
    isRoom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      map: '',
      deviceCluster: null,
      roomCluster: null,
      marker: null,
      mouseTool: null, // 绘图工具
      _renderClusterMarker: null,
      curCluster: null, // 当前聚合
      overGroup: null, // 覆盖物群组
      moveMarker: null,
      clusterTimer: null // 聚合定时器
    }
  },
  provide: function () {
    return {
      addLayer: this.addLayer,
      removeOlver: this.removeOlver,
      addOverlay: this.addOverlay,
      getZoom: this.getZoom,
      drawPolyLine: this.drawPolyLine,
      closePolyLine: this.closePolyLine,
      clearOverGroup: this.clearOverGroup,
      changeToLittle: this.changeToLittle,
      removeAllMarkers: this.removeAllMarkers,
      addMoveMarker: this.addMoveMarker,
      mapRightMenu: this.mapRightMenu,
      mapClick: this.mapClick,
      mapClickOff: this.mapClickOff,
      addOverGroup: this.addOverGroup,
      clearMarkerLayer: this.clearMarkerLayer,
      isRoom: this.isRoom,
      initClusterLoad: this.initClusterLoad,
      clusterAddMarkers: this.clusterAddMarkers,
      clusterDelMarkers: this.clusterDelMarkers,
      clearOverlay: this.clearOverlay,
      panTo: this.panTo
    }
  },
  computed: {
    ...mapState('Map', {
      deviceMarkers: 'deviceMarkers', // 设备点聚合数组
      roomMarkers: 'roomMarkers', // 场所点聚合数组
      isShowDevice: 'isShowDevice' // 当前是否显示设备类型,默认显示设备不显示场所
    }),
    ...mapState('User', {
      zoom: 'zoom', // 缩放级别
      zooms: 'zooms', //地图显示的缩放级别范围，在PC上，默认为[3,18]，取值范围[3-18]；在移动设备上，默认为[3,19],取值范围[3-19]
      // originZoom: 'originZoom', // 初始缩放级别
      centrePos: 'centrePos'
    })
  },
  // props: {
  //   center: {
  //     type: Array,
  //     required: true,
  //     validator: value => value.length === 2
  //   },
  //   curStyle: {
  //     type: String,
  //     default: 'height:100%'
  //   },
  //   crs: {
  //     type: String,
  //     default: 'EPSG:4326'
  //   },
  //   cluster: {
  //     type: Boolean,
  //     default: false
  //   },
  //   isSiteCluster: {
  //     type: Boolean,
  //     default: false
  //   },
  //   isRoom: {
  //     type: Boolean,
  //     default: true
  //   }
  // },

  mounted() {
    this.mapSetCenter() // 监听设置中心事件

    this.$nextTick(() => {
      this.init()
    })

    this.bus.$on('setCenter', position => {
      setTimeout(() => {
        this.map.setCenter(position)
        this.map.setZoom(18)
        this.createMarker(position)
      }, 800)
    })
    // 设备地图 设备/场所 搜索后点击某一项 显示当前点
    this.bus.$on('device_setCenter', position => {
      setTimeout(() => {
        this.map.setCenter(position)
        this.map.setZoom(18)
        // this.createMarker(position);
      }, 800)
    })
    this.bus.$on('showInfo', () => {
      this.map.on('click', this.showInfo)
    })
    this.bus.$on('showInfoClick', () => {
      this.map.on('click', this.showInfoClick)
    })
    this.bus.$on('closeMapLable', () => {
      this.$store.state.Map.isCloseLable = true
    })
    this.cluster && this.initCluster()
  },

  beforeDestroy() {
    this.resetMap()
    this.map && this.map.clearMap()
    clearTimeout(this.timeout)
    clearTimeout(this.clusterTimer)
    this.bus.$off('device_setCenter')
    this.bus.$off('handleCenter')
    this.bus.$off('setCenter')
    this.bus.$off('showInfo')
    this.bus.$off('showInfoClick')
    this.clickOff('showInfo')
    this.clickOff('showInfoClick')
    this.bus.$off('closeMapLable')

    this.descroyMap()
  },

  methods: {
    ...mapMutations('Common', {
      initMap: 'initMap'
    }),
    ...mapMutations('User', {
      setZoom: 'setZoom'
    }),
    // 恢复初始化配置
    resetMap() {
      // this.setZoom(this.originZoom)
      // console.log(this.zoom);
      this.setZoom(this.zoom)
    },
    /**时空碰撞 搜索清空小图标 */
    clearMarkerLayer() {},
    addMoveMarker() {},
    changeToLittle() {
      this.map?.setCenter(this.centrePos)
      this.map?.setZoom(13)
    },
    showInfo(e) {
      if (e.lnglat.getLng() && e.lnglat.getLat()) {
        this.$store.state.Map.isCloseLable = true
      }
      this.clickOff('showInfo')
    },
    showInfoClick(e) {
      if (e.lnglat.getLng() && e.lnglat.getLat()) {
        this.bus.$emit('closeBox')
      }
      this.clickOff('showInfoClick')
    },
    // 解绑事件
    clickOff(event) {
      this.map?.off('click', this.event)
    },
    init() {
      this.map = new AMap.Map('container', {
        center: this.center,
        resizeEnable: true,
        zoom: this.zoom,
        expandZoomRange: true, // 扩展到 20
        zooms: this.zooms,
        crs: this.crs,
        mapStyle: 'amap://styles/1938caab0264493fa2a847243b88e511',
        averageCenter: true
      })

      Vue.prototype.$aMap = this.map
      this.map?.on('complete', () => {
        this.zoomChange()
        this.initMap(this.map)
        this.bus.$emit('mapComplete', this.map)
      })
    },

    initCluster() {
      this.$nextTick(() => {
        this.timeout = setTimeout(() => {
          AMap.plugin(['AMap.MarkerClusterer'], () => {
            this.renderDevOrRoom()
          })
        }, 1500)
      })
    },
    // 渲染 设备还是列表
    renderDevOrRoom() {
      if (this.isShowDevice) {
        this.curCluster && this.curCluster.clearMarkers()
        this.initClusterRender(this.deviceMarkers, 'device')
        this.setCluster(this.map, this.deviceMarkers)
      } else {
        this.curCluster && this.curCluster.clearMarkers()
        this.initClusterRender(this.roomMarkers, 'site')
        this.setCluster(this.map, this.roomMarkers)
      }
    },
    createMarker(position) {
      this.clearOverGroup()
      if (Array.isArray(position)) {
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(...position),
          zIndex: 200,
          offset: new AMap.Pixel(-10, -34)
        })
      } else {
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(position.lng, position.lat),
          zIndex: 200,
          offset: new AMap.Pixel(-6, -60)
        })
      }
      this.addOverGroup(this.marker)
    },
    addOverlay(overlay) {
      this.$nextTick(() => {
        this.map && this.map.add(overlay)
      })
    },
    removeOlver(overlay) {
      this.$nextTick(() => {
        if (overlay) {
          this.map.remove(overlay)
        }
      })
    },
    panTo (lngLat) {
      this.$nextTick(() => {
        if (lngLat) {
          this.map.panTo(lngLat)
        }
      })
    },
    generateStyle(type, isOnline) {
      return `icon-small-${type}` + (isOnline ? '' : '-g')
    },
    judegeMaxZoom(context) {
      let cateMarkerHtml = document.createElement('ul')
      cateMarkerHtml.style.listStyle = 'none'
      const markerDataList = context.markers.reduce((acc, cur) => {
        let curData = cur.getExtData()
        acc.length === 0
          ? acc.push(curData)
          : !acc.map(item => item.type).includes(curData.type) && acc.push(curData)
        return acc
      }, [])
      markerDataList.forEach(marker => {
        let iconSpan = document.createElement('li')
        const clsName = this.generateStyle(marker.type, marker.online)
        iconSpan.className = `${clsName} icon-img-box-small `
        iconSpan.title = marker.title
        cateMarkerHtml.appendChild(iconSpan)
      })
      return cateMarkerHtml
    },
    /**
     * 设置聚合样式
     * list 聚合实例化的列表
     * type 场所还是设备
     */
    initClusterRender(list, type) {
      const styleCache = new Map()
      this._renderClusterMarker = context => {
        let markerDom
        if (type === 'device') {
          markerDom = generateFeatureStyle(context, styleCache)
        } else {
          markerDom = generateClusterStyle(context, styleCache)
        }
        context.marker.setContent(markerDom)
      }
    },
    /**
     * 聚合初始化
     * map 地图实例对象
     * pos 场所或设备的position list
     */
    setCluster(map, pos) {
      this.curCluster = new AMap.MarkerClusterer(map, pos, {
        maxZoom: 20,
        gridSize: NORMAL_DISTANCE,
        renderClusterMarker: this._renderClusterMarker,
        clusterByZoomChange: false,
        averageCenter: true,
        zoomOnClick: true
      })

      this.curCluster.on('click', e => {
        if (this.zoom <= CIRCLE_ZOOM) return
        this.bus.$emit('clickMaxCluster', e)
      })
    },

    addLayer() {},
    zoomChange() {
      this.map?.on('zoomend', () => {
        this.setZoom(this.map?.getZoom())
        if (!this.curCluster) return
        const curDistance = this.curCluster.getGridSize()
        const changeDistance = this.zoom >= DISTANCE_ZOOM ? NORMAL_DISTANCE : MAX_DISANCE
        if (curDistance === changeDistance) return
        this.curCluster.setGridSize(changeDistance)
      })
    },
    mapSetCenter(fn = new Function()) {
      this.bus.$on('handleCenter', (position, zoom = 15) => {
        this.$nextTick(() => {
          this.map.setCenter(position)
          this.map.setZoom(zoom)
          fn()
        })
      })
    },
    // 绘制曲线
    drawPolyLine() {
      //构造折线编辑对象，并开启折线的编辑状态
      if (this.mouseTool) {
        this.mouseTool.rectangle()
      } else {
        AMap.plugin(['AMap.MouseTool'], () => {
          this.mouseTool = new AMap.MouseTool(this.map)

          //用鼠标工具画多边形
          let drawPolygon = this.mouseTool.rectangle()
          this.mouseTool.on('draw', e => {
            const res = this.map.getAllOverlays().slice(-1)
            this.bus.$emit('drawRectangle', {
              obj: this.mouseTool,
              data: e.obj.getPath()
            })
            setTimeout(() => {
              this.map.remove(res)
            }, 300)
          })
        })
      }
    },
    // 取消多边形
    closePolyLine() {
      this.mouseTool && this.mouseTool.close(true)
    },
    // 将点添加到群组
    addOverGroup(marker) {
      if (!this.overGroup) {
        // 如果没有初始化，则初始化
        this.overGroup = new AMap.OverlayGroup()
        this.overGroup.setMap(this.map)
      }
      this.overGroup.addOverlay(marker)
    },
    // 清除覆盖物群组
    clearOverGroup() {
      if (this.overGroup) {
        this.overGroup.clearOverlays()
      }
    },
    removeAllMarkers() {
      this.$nextTick(() => {
        this.map && this.map.clearMap()
      })
    },
    //监听鼠标右键事件
    mapRightMenu(fn) {
      this.map?.on('rightclick', e => {
        fn(e)
      })
    },
    // 鼠标点击事件
    mapClick(fn) {
      this.map && this.map?.on('click', e => fn(e))
    },

    mapClickOff() {
      this.map && this.map?.off('click', e => fn(e))
    },

    /**
     * 聚合标注初始化
     * @param <Array> 实例化的 AMap 对象，但还没被 添加到 地图中
     */
    initClusterLoad(list, type) {
      this.clusterTimer && clearTimeout(this.clusterTimer)
      this.clusterTimer = setTimeout(() => {
        AMap.plugin(['AMap.MarkerClusterer'], () => {
          // 设置聚合样式
          this.initClusterRender(list, type)
          // 初始化生成聚合数据点
          this.setCluster(this.map, list)
        })
      }, 1000)
    },
    // 聚合操作 添加
    clusterAddMarkers(list) {
      this.curCluster.addMarkers(list)
    },
    // 聚合操作 删除
    clusterDelMarkers(list) {
      this.curCluster.removeMarkers(list)
    },
    clearOverlay() {
      this.map && this.map?.clearMap()
    },
    descroyMap() {
      this.map && this.map?.destroy()
    }
  },
  watch: {
    isShowDevice(val) {
      if (!this.cluster) return
      // true 为设备列表 flse
      this.initCluster()
    },
    zoom(val) {
      console.log(val);
      this.map && this.map.setZoom(val)
    }
  }
}
</script>
<style scoped>
/* // 高德地图lable */
#container /deep/ .amap-marker-label {
  padding: 6px 10px;
  color: var(--base-text-color-1);
  font-size: 14px;
  border-radius: 2px;
  background: rgba(53, 67, 92);
  border: none;
}

#container /deep/ .amap-marker-label :after {
  position: absolute;
  content: ' ';
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  width: 0;
  height: 0;
  border: 8px solid rgba(53, 67, 92);
  border-color: rgba(53, 67, 92) transparent transparent transparent;
  z-index: 111;
}
#container /deep/.yuan {
  background-color: #4596e6;
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
  text-align: center;
}
#container /deep/.l {
  width: 64px;
  height: 64px;
  line-height: 64px;
}
#container /deep/.m {
  width: 48px;
  height: 48px;
  line-height: 48px;
}
#container /deep/.s {
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>

<style lang="less">
.marker-list-wrapper {
  list-style-type: none;
  & > li {
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
  }
}

.icon-img-box-small {
  width: 16px;
  height: 16px;
  background-size: 100%;
}

.amap-device-cluster {
  display: flex;
  border-radius: 18px;
  border-width: 1px;
  border-style: solid;
  white-space: nowrap;
  &-text {
    margin-left: 10px;
    margin-right: 10px;
    line-height: 24px;
    color: var(--base-text-color-1);
    white-space: nowrap;
  }
}
.amap-device-circle-cluster,
.amap-custom-cluster {
  color: var(--base-text-color-to-999999);
  border-radius: 50%;
  border-style: none;
  white-space: nowrap;
  background: #2c4f78;
  // width: 40px;
  // height: 40px;
  line-height: 40px;
  font-size: 16px;
  text-align: center;
  &-text {
    margin-left: 10px;
    margin-right: 10px;
    line-height: 24px;
    color: #fff;
    white-space: nowrap;
  }
}
</style>
