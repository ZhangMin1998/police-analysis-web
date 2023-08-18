<template>
  <ol-map id="map" class="map" :style="curStyle">
    <pinMarker @pinMap="pinMap" text="标记位置" />
    <count-marker :list="markerList"></count-marker>
    <template v-if="markerList.length > 0">
      <div class="siteInfo" ref="siteInfo">
        <SiteFrom
          v-if="showSiteFrom"
          :parentLocation="markerList[0]"
          ref="siteFrom"
          title="位置信息"
          @delSite="delSite"
          @confirmSite="confirmSite"
        ></SiteFrom>
      </div>
    </template>
  </ol-map>
</template>

<script>


import OlMap from '@/commons/map/Map'
import pinMarker from '@/components/Map/CommonMap/MarkerLocation'
import CountMarker from '@/components/Map/OfflineMap/marker/index'

import SiteFrom from '@/views/common/devicemap/components/SiteFrom'

export default {
  components: {
    OlMap,
    pinMarker,
    CountMarker,
    SiteFrom,
  },
  inject: ['setParams'],
  data () {
    return {
      curStyle: 'height: calc( 100vh - 200px )',
      markerList: [],
      showSiteFrom: true,
      siteParams: {},
      popup: null,
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    },
  },
  watch: {
    markerList: function (val) {
      console.log('change', val)
      setTimeout(() => {
        val.length && val.length > 0 && this.generateInfo(val[0])
      })
    },
  },
  methods: {
    pinMap (e) {
      console.log(e)
      this.markerList.push(e)
      console.log('列表', this.markerList)
    },
    clickMCountMarker () {},
    generateInfo (pos) {
      /* eslint-disable */
      this.popup = new ol.Overlay({
        /* eslint-enable */
        element: this.$refs['siteInfo'],
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -20],
        population: 4000,
        rainfall: 500,
      })
      this.map.addOverlay(this.popup)
      this.$nextTick(() => {
        this.popup.setPosition(pos)
      })
    },
    delSite () {
      this.markerList = []
    },
    confirmSite (params) {
      this.showSiteFrom = false
      this.siteParams = params
      /** 确认传数据 */
      this.setParams(this.siteParams)

      /** 关闭弹窗 */
      this.$emit('hideAmap')
    },
  },
}
</script>

<style lang="less" scoped>
.siteInfo {
  background: #27344d;
  padding: 6px;
  border-radius: 4px;
}
/deep/.el-dialog {
  height: calc(100vh - 200px);
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
</style>
