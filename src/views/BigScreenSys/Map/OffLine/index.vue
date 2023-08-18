<template>
  <div class="map_con OffLineIndex">
    <ol-map id="map" class="map" :search="true" style="height: 100%">
      <!-- 中间下面 切换类型控件 -->
      <MapSwitchType
        v-if="renderType === 'device'"
        ref="MapSwitchType"
        @handleClick="handleClickType"
      >
      </MapSwitchType>

      <!-- 控件 -->
      <map-control :list="iconMiniData" />

      <!--左上角  监控显示选择 -->
      <div class="CusSelect-box">
        <CusSelect
          title="监控显示选择"
          :list="labelList"
          :checkList="[
            {
              label: '设备展示',
              value: 'device'
            }
          ]"
          @handleChecked="handleChecked"
        ></CusSelect>
      </div>

      <!-- 设备在线率 -->
      <deviceOnlineRate
        v-if="renderType === 'device'"
        v-model="deviceRate"
        @input="deviceRateChange"
        :devRate="devRate"
      />

      <!-- 场所 -->
      <MapCluster
        v-if="siteList.length > 0 && renderType === 'place'"
        layerName="site"
        key="site"
        :list="siteList"
        :imgMap="imgMap"
        :imgUrl="siteUrl"
      />

      <!-- 设备 -->
      <MapCluster
        layerName="device"
        key="device"
        v-if="renderDeviceList.length && renderType === 'device'"
        :list="renderDeviceList"
        :imgMap="imgMap"
        @clickDeviceCate="clickDeviceCate"
      />

      <!-- 弹窗 -->
      <Popup key="overlay" @showCallback="clickMarker" @cancelCallback="clickMarkerOutside" />
      <!-- hover弹窗 -->
      <hover-popup key="hover" />
      <!-- 搜索 -->
      <searchPopup
        v-if="searchShowObj.flag"
        :content="searchShowObj.content"
        :pos="searchShowObj.pos"
        @cancelCallback="clickMarkerOutside(true)"
      />
    </ol-map>
    <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom" :curStyle="{ width: '98vw' }">
      <device-overlay-pop></device-overlay-pop>
    </CusDrawerBottom>

    <CusDrawerBottom :CusDrawerBottom.sync="PlaceCusDrawerBottom" :curStyle="{ width: '98vw' }">
      <room-pop></room-pop>
    </CusDrawerBottom>

    <div class="EchartsPage" v-if="EchatsState">
      <EchartsPage @handleHidden="handleHidden"></EchartsPage>
    </div>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import mapMethod from '@/views/BigScreenSys/Map/Methods/mapMethod'
import { mapState } from 'vuex'
import MapCluster from '_com/map/cluster'
import Popup from '_com/map/popup'
import HoverPopup from '_com/map/popup/hover'
import searchPopup from '_com/map/popup/search'
export default {
  components: {
    MapCluster,
    Popup,
    HoverPopup,
    searchPopup
  },

  mixins: [mapMixin, mapMethod],

  computed: {
    ...mapState('Ol', {
      map: 'map',
      searchShowObj: 'searchShowObj',
      imgMap: 'imgMap'
    }),
    ...mapState('Map', {
      zoom: 'zoom'
    })
  },

  created () {
    this.bus.$on('clickClusterMaker', this.clickClusterMaker)

    this.$once('hook:beforeDestroy', () => {
      this.bus.$off('clickClusterMaker')
    })
  },

  beforeDestroy () {
    this.bus.$off('olMapClick')
  },

  methods: {
    // 点击最大级别单个 feature 事件
    clickMarker (feature) {
      if (this.renderType === 'device') {
        this.$store.commit('Map/setDeviceIdsClicked', [feature.id])
      } else {
        this.$store.commit('Map/setPlaceDataClicked', feature)
      }
    },
    // 点击最大级别仍然是聚合的事件 feature { list, position, ids }
    clickClusterMaker (featurObj) {
      if (this.renderType === 'device') {
        this.$store.commit('Map/setDeviceIdsClicked', featurObj.ids)
      } else {
        // TODO: 这里有问题
        // const params = features.map(f => f.get('placeCode')).join(',')
      }
    },
    clickMarkerOutside (flag = false) {
      if (flag) {
        this.$store.commit('Ol/setSearchObj', { flag: false, content: '', pos: ['', ''] })
      }
      if (this.renderType === 'device') {
        this.$store.commit('Map/closeDevicePop')
      } else {
        this.$store.commit('Map/closeRoomPop')
      }
    },
    // 定位放大
    location (position, zoom) {
      const curView = this.$store.state.Ol.oMap.getView()
      curView.animate({
        zoom: zoom,
        center: position,
        duration: 300
      })
    }
  }
}
</script>

<style lang="less" scoped>
.map /deep/.ol-overlaycontainer,
.map /deep/.ol-overlaycontainer-stopevent {
  width: auto !important;
  height: auto !important;
}

.OffLineIndex {
  position: relative;
  height: 100%;
  width: 100%;
  padding: px2rem(5);
  box-sizing: border-box;
  .CusSelect-box {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 10;
  }
}
</style>

