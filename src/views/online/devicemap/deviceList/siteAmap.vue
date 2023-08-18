<template>
  <div class="site-wrapper map_pop">
    <amap :center="center">
      <!-- 地图相关 -->
      <pinMarker @pinMap="pinMap" text="标记位置" />
      <opera />
      <imgSite />
      <!-- 地上标注点 -->
      <count-marker
        content="hide"
        :list="markerList"
        @clickMarker="clickMCountMarker"
      ></count-marker>

      <!-- 新建info窗口 -->
      <add-info-window
        v-if="markerList.length > 0 && cMap !== null"
        anchor="middle-left"
        :position="markerList.length > 0 ? markerList[0] : []"
        :showSiteFrom="showSiteFrom"
      >
        <template v-if="showSiteFrom">
          <SiteFrom
            ref="siteFrom"
            title="位置信息"
            :parentLocation="markerList.length > 0 ? markerList[0] : []"
            @delSite="delSite"
            @confirmSite="confirmSite"
          ></SiteFrom>
        </template>
        <template v-else>
          <div class="p">
            <div>{{ siteParams.siteAddress }}</div>
            <div>经度：{{ siteParams.longitude }}</div>
            <div>纬度：{{ siteParams.latitude }}</div>
          </div>
        </template>
      </add-info-window>
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import imgSite from '_com/map/map-control'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import pinMarker from '@/components/Map/CommonMap/MarkerLocation'
import CountMarker from '@/components/Map/OnlineMap/count-marker'
import AddInfoWindow from '@/views/online/devicemap/deviceList/components/addInfoWindow'
import SiteFrom from '@/views/common/devicemap/components/SiteFrom'

import { mapState } from 'vuex'

export default {
  components: {
    imgSite,
    pinMarker,
    Opera,
    CountMarker,
    AddInfoWindow,
    SiteFrom
  },
  mixins: [AmapMixins],
  inject: ['placeform', 'setParams'],
  data () {
    return {
      markerList: [],
      showSiteFrom: true,
      siteParams: {}
    }
  },

  computed: {
    ...mapState('Common', {
      cMap: 'cMap'
    })
  },

  mounted () {
    if (this.placeform.latitude && this.placeform.longitude) {
      this.showSiteFrom = true
      this.markerList = []
      if (this.placeform._GdPos && this.placeform._GdPos.length == 2) {
        this.markerList[0] = this.placeform._GdPos
      }
    }
  },

  methods: {
    /** 确定 地点 */
    confirmSite (params) {
      console.log('🚀 ~ file: siteAmap.vue ~ line 92 ~ confirmSite ~ params', params)
      this.showSiteFrom = false
      this.siteParams = params

      /** 确认传数据 */
      this.setParams(this.siteParams)

      /** 关闭弹窗 */
      this.$emit('hideAmap')
    },

    /** 删除 地点 */
    delSite () {
      this.markerList = []
    },

    clickMCountMarker (e) {
      console.log('click outer', e)
    },

    /**
     * 标记案发地点
     */
    pinMap (e) {
      console.log('pinMap click', e)
      this.showSiteFrom = true
      this.markerList = [[e.lng, e.lat]]
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.amap-overlays {
  z-index: 1000;
}
.p {
  color: var(--base-text-color-1);
  font-size: 16px;
  line-height: 20px;
  div {
    margin-bottom: 6px;
  }
}
/deep/.el-dialog {
  height: calc(100vh - 200px);
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
</style>
