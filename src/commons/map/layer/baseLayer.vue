<template>
  <div></div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  inject: ['addLayer', 'removeLayer'],
  data () {
    return {
      tiled: []
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme',
      loginMap:'loginMap',
      tianMapInfo: 'tianMapInfo',
      rongChengMapUrl:'rongChengMapUrl'
    })
  },
  watch: {
    theme: {
      handler () {
        // this.removeLayer(this.tiled)
        // console.log(val)
        // console.log(this.tiled);
        this.tiled.forEach(item => {
          this.removeLayer(item)
        })
        this.initLayer()
      },
      // immediate: true
    }
  },
  methods: {
    initLayer () {
      // console.log(window.location.origin)
      // ----------------之前的离线地图-----------------------------------
      if (this.loginMap === 'tiandimap') {
        // console.log('tiandimap')
        // let viewExtent = undefined
        const mapTile = this.tianMapInfo.tilesPath || ''
        // if (this.searchCity === '肇庆') {
        //   viewExtent = [111.357, 22.772, 112.878, 24.392]
        //   mapTile = 'mapTileZQ'
        // } else if (this.searchCity === '威海' || this.searchCity === '荣成') {
        //   viewExtent = [120.807037, 36.639774, 123.075714, 37.610968]
        //   mapTile = 'mapTileWH'
        // }
        this.tiled = [
          new window.ol.layer.Tile({
            source: new window.ol.source.XYZ({
              // url: 'http://169.254.231.19:8081' + '/{z}/{x}/{y}.png',  // 设置本地离线瓦片所在路径
              url: window.location.origin + '/static/'+ mapTile +'/vec_w'+ '/{z}/{x}/{y}.png',  // 设置本地离线瓦片所在路径
              tileLoadFunction: (imageTile, src) => this.titleLoad(imageTile, src)
            }),
            extent: this.tianMapInfo.extent
          }),
          new window.ol.layer.Tile({
            source: new window.ol.source.XYZ({
              // url: 'http://169.254.231.19:8081' + '/{z}/{x}/{y}.png',  // 设置本地离线瓦片所在路径
              url: window.location.origin + '/static/'+ mapTile +'/cva_w'+ '/{z}/{x}/{y}.png',  // 设置本地离线瓦片所在路径
              tileLoadFunction: (imageTile, src) => this.titleLoad(imageTile, src)
            }),
            extent: this.tianMapInfo.extent
          }),
        ]
      } else if (this.loginMap === 'OSMmap') {
        // console.log('OSMmap')
        let format = 'image/png'
        // let bounds = [73.2467041015625, 15.7809476852417, 135.097518920898, 53.9499893188477]
        // ----------------之前的离线地图-----------------------------------
        this.tiled = [
          new window.ol.layer.Tile({
            source: new window.ol.source.TileWMS({
              url: this.$store.state.User.mapUrl, /// geoserver/wms
              params: {
                FORMAT: format,
                VERSION: '1.1.1',
                tiled: true,
                LAYERS: this.theme === 'light' ? 'china_pbf_white' : 'china_pbf',
                exceptions: 'application/vnd.ogc.se_inimage',
                tilesOrigin: 73.2467041015625 + ',' + 15.7809476852417,
              },
            }),
          })
        ]
      } else if (this.loginMap === 'bluemap') {
        // console.log('bluemap')
        this.tiled = [
          new window.ol.layer.Tile({
            source: new window.ol.source.TileArcGISRest({
              url: this.rongChengMapUrl? this.rongChengMapUrl:'https://map.geoq.cn/ArcGIS/rest/services/sdsl_blue/MapServer',
              // url: 'https://map.geoq.cn/ArcGIS/rest/services/sdsl_blue/MapServer', // 山东省高精地图（蓝色）
              // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', // arcgis在线蓝色地图资源（蓝色）
            })
          })
        ]
      }
      this.tiled.forEach(item => {
        this.addLayer(item)
      })
      // this.addLayer(this.tiled)
    },
    titleLoad (imageTile, src) {
      // 使用滤镜 将白色修改为深色
      let img = new Image()
      // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        let canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        canvas.width = w
        canvas.height = h
        let context = canvas.getContext('2d')
        if (this.theme === 'dark') {
          // context.filter = 'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)'
          context.filter = 'grayscale(100%) invert(90%) sepia(70%) hue-rotate(180deg) saturate(330%) brightness(56%)'
        } else {
          context.filter = 'grayscale(70%) hue-rotate(180deg) saturate(400%)'
        }
        context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
        imageTile.getImage().src = canvas.toDataURL('image/png')
      }
      img.onerror = () => {
        imageTile.getImage().src = ''
      }
      img.src = src
    }
  },
  mounted () {
    this.initLayer()
    // setTimeout(() => {
    // }, 300)
  },
}
</script>

<style></style>
