<template>
  <div class="map_con OnLineIndex">
    <amap :cluster="true" :center="center" ref="amap">
      <!-- 中间下面 切换类型控件 -->
      <MapSwitchType
        v-if="renderType === 'device'"
        ref="MapSwitchType"
        @handleClick="handleClickType"
      >
      </MapSwitchType>

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

      <!-- 控件 -->
      <map-control :list="iconMiniData" />

      <!-- 设备在线率 -->
      <deviceOnlineRate
        v-if="renderType === 'device'"
        v-model="deviceRate"
        @input="deviceRateChange"
        :devRate="devRate"
      />

      <!-- 设备标注 /场所-->
      <MarkerClusterer
        :clusterType="renderType"
        :list="renderType === 'device' ? renderDeviceList : siteList"
        @handleMarkerClick="handleMarkerClick"
        @handleClickCluster="handleClickCluster"
      >
      </MarkerClusterer>

      <!-- 聚合弹窗 -->
      <ClusterInfo
        v-if="clusterObj.show"
        ref="ClusterInfoRef"
        :visible.sync="clusterObj.show"
        :position="clusterObj.position"
      >
        <div class="marker-pop-content-list">
          <div v-for="(column, idx) in clusterObj.list" :key="idx" class="column-wrapper">
            <div
              v-for="(item, index) in column"
              :key="`${idx}_${index}`"
              class="column-item"
              @click="clickDeviceCate(item)"
              :title="deviceTypeObj[item.type]"
            >
              <img :src="generateImg(item)" alt="" />
              <span class="column-text">{{ item.onlineCount }} / {{ item.allCount }}</span>
            </div>
          </div>
        </div>
      </ClusterInfo>

      <!-- 搜索栏 -->
      <map-search :renderType="renderType" @toggleSelectDevice="handleMarkerClick"></map-search>

      <ClusterInfo
        v-if="labelPopup.content"
        :position="labelPopup.position"
        :mapShow="labelPopup.show"
        :content="labelPopup.content"
        @close="labelPopupClose"
      ></ClusterInfo>
    </amap>

    <!-- 设备面板 -->
    <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom" :curStyle="{ width: '98vw' }">
      <device-overlay-pop></device-overlay-pop>
    </CusDrawerBottom>

    <!-- 场所面板 -->
    <CusDrawerBottom :CusDrawerBottom.sync="PlaceCusDrawerBottom" :curStyle="{ width: '98vw' }">
      <room-pop></room-pop>
    </CusDrawerBottom>

    <div class="EchartsPage" v-if="EchatsState">
      <EchartsPage @handleHidden="handleHidden"></EchartsPage>
    </div>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import mapMethod from '@/views/BigScreenSys/Map/Methods/mapMethod'
import { mapState, mapMutations } from 'vuex'
import MapSearch from '_com/deviceMap/mapSerach'
import ClusterInfo from '@/commons/amap/ClusterInfo'
import { formatUniqueList } from '@/views/offline/devicemap/devicemap.js'
import MarkerClusterer from '_com/deviceMap/MarkerClusterer'
export default {
  mixins: [AmapMixins, mapMethod],
  components: {
    MapSearch,
    ClusterInfo,
    MarkerClusterer
  },
  data () {
    return {
      clusterObj: {
        // 聚合弹窗
        show: false,
        list: [],
        position: []
      },
      labelPopup: {
        content: '',
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false // 弹窗显隐 Boolean，必须，默认为 true
      }
    }
  },
  computed: {
    ...mapState('Ol', {
      imgMap: 'imgMap'
    }),
    ...mapState('User', {
      zoom: 'zoom'
    }),
    ...mapState('Map', {
      deviceTypeObj: 'deviceTypeObj'
    })
  },

  watch: {
    zoom: function (val, oldVal) {
      oldVal > val && this.closeInfo()
    }
  },

  methods: {
    ...mapMutations('Map', {
      setDeviceIdsClicked: 'setDeviceIdsClicked',
      setPlaceDataClicked: 'setPlaceDataClicked'
    }),

    labelPopupClose () {
      this.labelPopup.show = false
    },

    // 点击聚合图
    handleClickCluster (clickData) {
      this.CusDrawerBottom.show = false
      this.PlaceCusDrawerBottom.show = false
      const { markerList, position } = clickData
      // 如果是设备
      this.clusterObj.position = position
      this.clusterObj.list = formatUniqueList(markerList, 'type')
      this.$nextTick(() => {
        this.clusterObj.show = true
      })
    },

    // 点击单个设备
    handleMarkerClick (row) {
      this.CusDrawerBottom.show = false
      this.PlaceCusDrawerBottom.show = false
      const { placeCode, id, placeName, deviceName, position } = row
      this.labelPopup.content = placeName || deviceName || '--'
      this.labelPopup.position = position
      this.$nextTick(() => {
        this.labelPopup.show = true
      })
      if (placeName) {
        this.setPlaceDataClicked({ placeCode: placeCode })
      } else if (deviceName) {
        this.setDeviceIdsClicked([id])
      }
    },

    // 关闭标注弹窗
    closeInfo () {
      this.$aMap.getAllOverlays('InfoWindow').map(info => info.close())
    },
    /**
     * 生成图片
     * TODO: 这里应该走缓存
     */
    generateImg (item) {
      const type = item.type == 9 ? 1 : item.type
      return require(`@/assets/img/${
        this.imgMap[item.onlineCount !== 0 ? type : type + '' + type]
      }`)
    },
    // 点击设备分类
    clickDeviceCate (cate) {
      this.setDeviceIdsClicked(cate.ids)
    }
  }
}
</script>

<style lang="less" scoped>
.map /deep/ .ol-overlaycontainer,
.map /deep/ .ol-overlaycontainer-stopevent {
  width: auto !important;
  height: auto !important;
}

.place-MapSwitchType-li {
  width: 48px;
  height: 48px;
  margin-left: 24px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  .place-MapSwitchType-li-img {
    width: 48px;
    height: 54px;
  }
}

.OnLineIndex {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  .CusSelect-box {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 10;
  }
}
</style>
