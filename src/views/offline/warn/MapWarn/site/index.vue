<template>
  <div class="map_con">
    <ol-map id="map" class="map" :search="true" :style="curStyle">
      <!-- 矢量图层 -->
      <!-- <ol-layer-vector id="geo-map">
        <ol-source-geoserver-maps :zoom.sync="zoom"></ol-source-geoserver-maps>
      </ol-layer-vector> -->
      <!-- 搜索 -->
      <!-- <choose-mode /> -->
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
      <!-- 聚合 -->
      <!-- 场所 -->
      <MapCluster
        :scale="scale"
        layerName="site"
        key="site"
        :list="roomListData"
        :imgParentMap="imgMap"
        :isChoose="true"
      />
      <!-- 弹窗 -->
      <HoverPopup :topOffset="-30" />
    </ol-map>
  </div>
</template>

<script>

import mapMixin from '@/mixins/omap'
import { mapState, mapMutations } from 'vuex'
import MapCluster from '_com/map/cluster'
import HoverPopup from '_com/map/popup/hover'
// import chooseMode from './chooseMode'

export default {
  mixins: [mapMixin],
  components: {
    // chooseMode,
    MapCluster,
    HoverPopup,
  },
  computed: {
    ...mapState('Map', {
      roomListData: 'roomListData',
    }),
  },
  data () {
    return {
      curStyle: 'height:calc(100vh - 200px)',
      iconMiniData: [{ type: 'wifi', text: '场所', url: 'icon-tab-small-11.png' }],
      siteList: [], // 场所数据
      imgMap: {
        '99': 'icon-tab-room-grey.png',
        '9': 'icon-tab-room.png',
      },
      scale: 0.5,
    }
  },
  methods: {
    ...mapMutations('trackWarning', {
      clearSelectdInfo: 'clearSelectdInfo',
    }),
    ...mapMutations('Map', {
      updateRoomList: 'updateRoomList',
    }),
    updateMarker (idx) {
      this.updateRoomList({ idx, flag: false })
    },
    clickMarker (feature) {
      let curFe = feature.get('features')[0]

      curFe.set('isActive', !curFe.get('isActive'))
      const isSelected = !curFe.get('isActive') ? '-grey' : ''
      // 将对应的标注取反
      const curIndex = curFe.get('index')
      const curId = curFe.get('id')
      this.roomListData[curIndex].isActive = curFe.get('isActive') ? true : false
      this.$emit('markerClick', { isActive: curFe.get('isActive'), curId })
      /* eslint-disable */
      let iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          /* eslint-enable */
          // 定义图标锚点
          anchor: [0.5, 46], // 根据图标的大小，对应上面 [0, 0] 的坐标
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          // 图标所使用的图片文件
          src: require(`@/assets/img/icon-tab-room${isSelected}.png`),
        }),
      })
      feature.setStyle(iconStyle)
    },
  },
  created () {
    // 开启 场所 搜索模式
    this.$store.state.Map.isShowDevice = false
    this.clearSelectdInfo()
    this.bus.$on('clickMarker', this.clickMarker)
  },
  beforeDestroy () {
    this.bus.$off('clickMarker')
  },
}
</script>

<style scoped>
.map_con {
  height: calc(100vh - 200px);
}
</style>
