<template>
  <div class="map_con">
    <ol-map id="map" class="map" :search="getPermission()" style="height: 100%">
      <!-- 中间下面 切换类型控件 -->
      <MapSwitchType ref="MapSwitchType" @handleClick="handleClickType">
        <div class="place-MapSwitchType-li" @click="handleClickPlace">
          <img
            class="place-MapSwitchType-li-img"
            :src="
              require(`@/assets/img/icon-tab-room${theme === 'light' ? '-light' : ''}${renderType === 'device' ? '-grey' : ''}.png`)
            "
            title="场所"
            alt="场所"
          /></div>
      </MapSwitchType>

      <!-- 控件 -->
      <map-control :list="iconMiniData" />

      <!-- 设备列表 / 统计模式 -->
      <Tab :tabNav.sync="tabNav" @handleClick="TabHandleClick" />

      <!-- 设备在线率 -->
      <deviceOnlineRate
        v-if="renderType === 'device'"
        v-model="deviceRate"
        @input="deviceRateChange"
        :devRate="devRate"
      />
      <!-- 设备 -->
      <MapCluster
        layerName="device"
        key="device"
        :isDevicemap="true"
        v-if="renderDeviceList.length && renderType === 'device'"
        :list="renderDeviceList"
        :imgMap="imgMap"
        @clickDeviceCate="clickDeviceCate"
      />

      <!-- 场所 -->
      <MapCluster
        v-if="siteList.length > 0 && renderType === 'place'"
        layerName="site"
        key="site"
        :isDevicemap="true"
        :list="siteList"
        :imgMap="imgMap"
        :imgUrl="siteUrl"
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
    <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom" :curStyle="{ width: '100vw' }">
      <device-overlay-pop></device-overlay-pop>
    </CusDrawerBottom>

    <CusDrawerBottom :CusDrawerBottom.sync="PlaceCusDrawerBottom" :curStyle="{ width: '100vw' }">
      <room-pop></room-pop>
    </CusDrawerBottom>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap1'
import mapMethod from './mapMethod'

import { mapState } from 'vuex'
// import { _pos } from '@/config/user.js'

import MapCluster from '_com/map/cluster'
import Popup from '_com/map/popup'
import HoverPopup from '_com/map/popup/hover'
import searchPopup from '_com/map/popup/search'
export default {
  name: 'offlineDevicemap',
  // name:'Devicemap',
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
      // imgMap: 'imgMap'
    }),
    ...mapState('Map', {
      zoom: 'zoom'
    }),
    ...mapState('User', {
      theme: 'theme'
    })
  },

  created () {
    this.bus.$on('clickClusterMaker', this.clickClusterMaker)
    // clickMarker
    // this.bus.$on('clickMarker', this.clickMarker)
    this.$once('hook:beforeDestroy', () => {
      this.bus.$off('clickClusterMaker')
    })
  },
  activated () {
    // console.log(1111);
    this.bus.$on('clickClusterMaker', this.clickClusterMaker)
    // this.bus.$on('clickMarker', this.clickMarker)
    this.$once('hook:beforeDestroy', () => {
      this.bus.$off('clickClusterMaker')
    })
  },
  deactivated () {
    // this.$store.commit('Map/backInitialStatus',false)
    // this.bus.$off('olMapClick')
  },
  beforeDestroy () {
    // this.bus.$off('olMapClick')
  },
  // 修复设备地图在打开详情切换到其他页面再回来点不开的问题
  //  beforeRouteLeave (to, form, next) {
  //   this.$store.commit('Map/backInitialStatus',false)
  //   // this.bus.$off('olMapClick')
  //   next()
  // },

  methods: {
    // 点击最大级别单个 feature 事件
    clickMarker (feature) {
      // console.log('点击最大级别单个 feature 事件',feature);
      if (this.renderType === 'device') {
        this.$store.commit('Map/setDeviceIdsClicked', [feature.id])
      } else {
        this.$store.commit('Map/setPlaceDataClicked', feature)
      }
    },
    // 点击最大级别仍然是聚合的事件 feature { list, position, ids }
    clickClusterMaker (featurObj) {
      console.log('最大级别仍然是聚合的事件');
      if (this.renderType === 'device') {
        this.$store.commit('Map/setDeviceIdsClicked', featurObj.ids)
      } else {
        // TODO: 这里有问题
        // const params = features.map(f => f.get('placeCode')).join(',')
        // this.$store.commit('Map/setDeviceIdsClicked', featurObj.ids)
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

.place-MapSwitchType-li {
  width: 54px;
  height: 54px;
  margin-left: 24px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  .place-MapSwitchType-li-img {
    width: 54px;
    height: 54px;
  }
}
</style>

