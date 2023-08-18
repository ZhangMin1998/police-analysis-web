<template>
  <div :style="curStyle" id="olmap" ref="olmap">
    <base-layer />
    <ol-view :center="mapCenter" :zooms="zooms" :zoom="zoom"></ol-view>
    <!-- 搜索 -->
    <map-search v-if="search" />
    <!-- 聚合 -->
    <div v-if="show">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import OlView from './View'
import uuid from 'uuid/v4'

import BaseLayer from '@/commons/map/layer/baseLayer'
import MapSearch from './map-search'
import { mapState } from 'vuex'

const { _pos } = require('@/config/user.js')

export default {
  name: 'ol-map',
  components: {
    OlView,
    MapSearch,
    BaseLayer
  },
  props: {
    controls: {
      type: Array,
      default: () => []
    },
    curStyle: {
      type: String
    },
    signClickFlag: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    }
    // moduleId: {
    //   type: String
    // }
  },
  // inject: ['mapRef'],
  data () {
    return {
      id: uuid(),
      markerGroup: [], // 当前标注图层组
      hoverPopUp: null, //
      show: true
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    mapCenter () {
      return this.$store.state.User.centrePos || [112.465212, 23.047724]
    },
    zoom () {
      return this.$store.state.User.zoom
    },
    zooms () {
      return this.$store.state.User.zooms
    },
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  provide: function () {
    return {
      setView: this.setView,
      addLayer: this.addLayer,
      removeLayer: this.removeLayer,
      addOverlay: this.addOverlay,
      removeOverlay: this.removeOverlay,
      setViewCenter: this.setViewCenter,
      clearMarkerLayer: this.clearMarkerLayer,
      generateOverlay: this.generateOverlay,
      mapRightMenu: this.mapRightMenu,
      mapClick: this.mapClick
    }
  },
  created () {
    // console.log('created', this.$store.state.Ol);
    // if(!this.$store.state.Ol.oMap){
    //   console.log('初始化了');
    //   this.initMap()
    // }else{
    //    console.log('没有进行初始化');
    // }
    this.initMap()
    // console.log('created',this.$store.state.Ol);
  },
  mounted () {
    // console.log('mounted');
    this.map.setTarget(this.$refs.olmap)
    this.bus.$on('setViewCenter', obj => {
      this.setViewCenter(obj.position, obj.zoom, obj.isMark, obj.isPos)
    })
  },
  beforeDestroy () {
    this.bus.$off('setViewCenter')
    // this.$store.state.User.zoom = this.$store.state.User.originZoom
    // console.log('beforeDestroy',this.$store.state.Ol.oMap);
  },
  destroyed () {
    // console.log('destroyed',this.$store.state.Ol);
  },
  watch: {
    // '$store.state.Ol.abc'(val){
    //   console.log(val);
    // },
    map () {
      // console.log(val);
    },
    theme () {
      // console.log(val);
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  activated () {
    // console.log('activated');
    // console.log(this.$store.state.Ol.abc);
    // console.log(this.$store.state.Ol.oMap);
    // this.initMap()
    // setTimeout(() => {
    //   this.map.setTarget(this.$refs.olmap)
    //   this.bus.$on('setViewCenter', obj => {
    //     this.setViewCenter(obj.position, obj.zoom, obj.isMark, obj.isPos)
    //   })
    // }, 300)
  },
  // deactivated(){
  //   this.bus.$off('setViewCenter')
  //   this.$store.state.User.zoom = this.$store.state.User.originZoom
  // },
  methods: {
    // 地图初始化
    initMap () {
      // this.$store.state.Ol.abc = 'abca'
      // console.log( this.$store.state.Ol.oMap);
      // eslint-disable-next-line
      this.$store.state.Ol.oMap = new ol.Map({
        target: this.$refs.olmap,
        loadTilesWhileInteracting: true,
        controls: this.controls,
        layers: []
      })
      // console.log( this.$store.state.Ol.oMap);
      // this.$store.state.Ol.oMap = JSON.parse(JSON.stringify(tempMap))
      // console.log(this.$store.state.Ol.oMap);
      // 监听相关事件
      this.mapEventOn()
    },
    setView (view) {
      this.map?.setView(view)
    },
    addLayer (layer) {
      this.map?.addLayer(layer)
    },
    removeLayer (layer) {
      this.map?.removeLayer(layer)
    },
    addOverlay (overlay) {
      this.map?.addOverlay(overlay)
    },
    // 地图相关事件监听
    mapEventOn () {
      // 点击事件监听
      this.map.on('singleclick', evt => {
        // console.log('地图发送的事件为olMapClick', evt);
        this.$nextTick(() => {
          this.bus.$emit('olMapClick', evt)
        })



        // 点击聚合放大
        this.zoomOutCluster(evt)
      })

      // 渲染完成事件监听
      this.map.on('rendercomplete', () => {
        this.bus.$emit('rendercomplete')
      })

      // 移动事件监听
      this.map.on('pointermove', e => {
        if (!this.map) return
        var pixel = this.map?.getEventPixel(e.originalEvent)
        var feature = this.map?.forEachFeatureAtPixel(pixel, f => f)
        if (feature == undefined) {
          this.map.getTargetElement().style.cursor = 'auto'
        } else {
          //WARNING: 矢量地图才有
          if (feature.id_) {
            this.map.getTargetElement().style.cursor = 'auto'
            return
          }
          this.map.getTargetElement().style.cursor = 'pointer'
        }
      })
    },
    /**
     * 居中并描点
     * pos Array 居中坐标点
     * zoom Number 缩放层级 默认17
     * isMarker Boolean 是否描点
     * isPos 是否转换 默认 true
     */
    setViewCenter (pos, zoom = this.zoom, isMarker = true, isPos = true) {
      if (typeof pos[0] === 'string') {
        pos = pos.map(item => parseFloat(item))
      }
      pos = isPos ? _pos(...pos) : pos
      const curView = this.map.getView()
      curView.animate({ zoom: zoom, center: pos, duration: 300 })
      isMarker && this.generateMarker(pos)
    },
    zoomOutCluster (e) {
      const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
      if (!feature) return
      const featureList = feature.getProperties().features
      if (!featureList || featureList.length < 1) return
      if (feature.get('layerType')) return
      this.zoomOut(e.coordinate)
    },
    zoomOut (position) {
      const view = this.map.getView()
      console.log(view.getZoom());
      view.animate({
        zoom: view.getZoom() + 1,
        center: position,
        duration: 300
      })
    },
    /**
     * 创建标注
     * pos Array 坐标
     */
    generateMarker (pos) {
      // 创建图标特性
      // eslint-disable-next-line
      const iconFeature = new ol.Feature({
        // eslint-disable-next-line
        geometry: new ol.geom.Point(pos), // 图标展示的位置
        name: '',
        population: 4000,
        rainfall: 500
      })

      // 创建图标样式
      // eslint-disable-next-line
      const iconStyle = new ol.style.Style({
        // eslint-disable-next-line
        image: new ol.style.Icon({
          // 定义图标锚点
          anchor: [0.5, 70], // 根据图标的大小，对应上面 [0, 0] 的坐标
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          // 图标所使用的图片文件
          src: require('../../assets/img/mark_bs.png')
        })
      })

      // 把样式应用到图标上
      iconFeature.setStyle(iconStyle)

      // 创建矢量容器，将图标特性添加进容器中
      // eslint-disable-next-line
      let vectorSource = new ol.source.Vector({
        features: [iconFeature]
      })

      // // 创建矢量图层
      // eslint-disable-next-line
      let vectorLayer = new ol.layer.Vector({
        // id: this.moduleId,
        // className: 'search-marker' + this.moduleId,
        className: 'search-marker',
        name: 'marker',
        source: vectorSource
      })
      this.addLayer(vectorLayer)
      this.markerGroup.push(vectorLayer)
    },
    generateOverlay (pos, title) {
      // eslint-disable-next-line
      this.hoverPopUp = new ol.Overlay({
        element: `<div class=""popup><div>${title}</div></div>`,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50],
        population: 4000,
        rainfall: 500
      })
      this.map.addOverlay(this.hoverPopUp)
      this.$nextTick(() => {
        this.hoverPopUp.setPosition(pos)
      })
    },
    /**
     * 清除标注层
     * layername Array 需要清除的图层 className
     */
    clearMarkerLayer (layername = null) {
      let clearLayersGroups
      // 如果没入参，则默认清除 layergroup 所有图层
      if (layername) {
        clearLayersGroups = this.markerGroup.filter(layer => layername.includes(layer.className_))
      } else {
        clearLayersGroups = this.markerGroup
      }

      clearLayersGroups.forEach(layer => {
        this.map.removeLayer(layer)
      })
    },
    //监听鼠标右键事件
    mapRightMenu (fn) {
      this.map.on('rightclick', e => {
        fn(e)
      })
    },
    // 鼠标点击事件
    mapClick (fn) {
      this.map.on('click', e => fn(e))
    }
  }
}
</script>

<style>
.loc-marker {
  width: 20px;
  height: 20px;
  border: 1px solid #088;
  border-radius: 10px;
  background-color: #0ff;
  opacity: 0.5;
}
</style>
