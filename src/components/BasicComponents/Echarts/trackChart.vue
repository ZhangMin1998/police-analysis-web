<template>
  <div class="chart">
    <ol-map class="map" ref='map' @olMapClick="olMapClick" @mapChange="mapChange">
      <div class="title" v-if="optionForm.isShowTitle">{{ optionForm.chartTitle }}</div>
      <!-- 轨迹点 -->
      <personTrack ref="personTrack" @elementClick="elementClick" :list="tracksList" :activeIndex='activeIndex' :showLine="false" :map="map"/>
      <!-- 弹出窗体 -->
      <MapPop
        :needTail="true"
        :isShowBottomJiao="false"
        :position="mapPopupData.position"
        :offset="mapPopupData.offset"
        :mapShow="mapPopupData.show"
      >
        <div>{{ curFeature.popContent  || '--' }}</div>
      </MapPop>
      <!-- 控件 -->
      <!-- <map-control /> -->
    </ol-map>
  </div>
</template>

<script>
import OlMap from './components/Map/Map.vue'
// import mapMixin from '@/mixins/omap'
import personTrack from '@/components/Map/OfflineMap/personTrack'
import MapPop from '@/components/Map/OfflineMap/MapPop'
// import OlMap from '@/commons/map/Map'
// import MapControl from '_com/map/map-control'

export default {
  name: 'track-chart',
  // mixins: [mapMixin],
  components: {
    personTrack,
    MapPop,
    OlMap
    // MapControl
  },
  props: {
    tracksList: {
      type: Array,
      default: () => []
    },
    // trackChartTitle: {
    //   type: String
    // }
    optionForm: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  watch: {
    tracksList: {
      handler: function (newValue) {
        this.$nextTick(() => {
          if (newValue.length) { // 以第一个点确定中心点
            let track = this.tracksList.find(item => item.longitude && item.latitude)
            if (this.map) {
              // 根据经纬度点 定位中心点
              this.bus.$emit('setViewCenter', {
                position: track.location,
                zoom: 11,
                isMark: false
              })
            } else {
              this.bus.$emit('handleCenter', track.location, 11)
            }
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      isShowTitle: null,
      chartTitle: '轨迹图',
      curFeature: {},
      // 弹出窗体图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, -20] // 弹窗偏移 Array[number]，必须，默认为 [0, 0] [-75, -5]
      },
      activeIndex: null, // 激活的点
      // map: null
    }
  },
  created () {
    // this.chartChange()
  },
  methods: {
    mapChange (e) {
      this.$refs.personTrack.map = e
    },
    // 点击地图上的点
    elementClick (info, index) {
      this.activeIndex = index
      this.openPopInfo(info, true) // 展开气泡信息
    },
    // 展开气泡信息
    openPopInfo (item, isShow) {
      this.mapPopupData.show = isShow
      this.mapPopupData.position = [item.placeLongitude, item.placeLatitude]
      this.curFeature = { ...item }
    },
    olMapClick (e) {
      this.$refs.personTrack.eventClick(e)
    }
  }
}
</script>

<style lang="less">
.chart{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .map{
    width: 100%;
    height: 100%;
    .title{
      color: var(--base-text-color-1);
      font-weight: bold;
      margin: 3px 0 5px 5px;
    }
  }
}
</style>
