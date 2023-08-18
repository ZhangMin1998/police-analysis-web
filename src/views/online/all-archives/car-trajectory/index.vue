<template>
  <div class="map_con">
    <amap  :center="center" class="map" style="height: 100%" ref='map'>
      <!-- 顶部返回栏 -->
      <header>
        <list-title title="车辆轨迹"></list-title>

        <!-- <div class="back-box" @click="$router.push({ name: 'carFile' })">
          <img
              width="16"
              height="16"
              :src="require('@/assets/img/' + 'icon-reback' + '.png')"
            />
          <div class="back">返回</div>
        </div> -->
        <BackPrevious @click="$router.push({ name: 'carFile' })"/>
      </header>
      <!-- 左侧车辆信息栏 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '70px', height: 'calc(100vh - 200px)' }"
        width="442px"
        oldLeft="10px"
        moveLeft="-442px"
        @handleClick="DrawerHandleClick"
      >
        <div class="car-infos">
          <div class="header-info">
            <div class="top-car-name">{{ $route.query.carNumber || '--' }}</div>
            <div class="bottom-info">
              <div class="lf-img">
                <!-- <img src="@/assets/logo.png" alt="" /> -->
                <ElImage
                  class="search-image"
                  :imgSet="{
                    src: generateUrl(),
                    height: 65,
                    width: 106,
                    fit: 'cover',
                    errorSrc: 'icon-nocar-dark'
                  }"
                ></ElImage>
              </div>
              <div class="rg-info">
                <div class="item-info">
                  <span>车主:</span><span>{{ $route.query.personName || '--' }}</span>
                </div>
                <div class="item-info">
                  <span>证件类型:</span><span>{{ $route.query.cerType || '--' }}</span>
                </div>
                <div class="item-info">
                  <span>证件号码:</span><span>{{ $route.query.cerNumber || '--' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="time-picker">
          <!-- 时间搜索控件 -->
          <DatePick
            @getTimeSelect="getTimeSelect"
            class="datepick"
            :isShowTimeType="false"
            ref="DatePick"
          ></DatePick>
        </div>
        <div class="car-trajectory">
          <Loading :isLoading.sync="searchLoading">
            <div class="RoundTimeline" v-if="activities.length">
              <RoundTimeline ref="RoundTimeline" :isClick="true" @itemClick="toMapPanTo" :activities="activities" :isShowAdd='false'>
              </RoundTimeline>
            </div>
            <div class="empty_div" v-else>
              <EmptyData />
            </div>
          </Loading>
        </div>
      </drawer>
      <!-- 中间车辆轨迹 -->
      <RouteMarker ref="routeMarkerRef" @elementClick="elementClick" :list="tracksList" :lineList="lineList"/>
      <!-- 右边部分的内容 -->
      <CusDrawerRight :CusDrawerRight="CusDrawerRightInfo">
        <Loading :isLoading.sync="rightPlaceLoading">
          <ul class="right-content">
            <li v-for="(item, index) in placeInfoArr" :key="index">{{ item.time }}</li>
          </ul>
        </Loading>
      </CusDrawerRight>
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
    </amap>
  </div>
</template>

<script>
// import mapMixin from '@/mixins/omap'
import AmapMixins from '@/mixins/amap'
import ElImage from '@/components/BasicComponents/ElImage'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import carArchivesMethod from '@/views/offline/all-archives/car-trajectory/carArchivesMethod'
// import RouteMarker from '@/components/Map/OfflineMap/car-path'
import RouteMarker from '@/components/Map/OnlineMap/car-path'
export default {
  mixins: [AmapMixins, carArchivesMethod],
  components: {
    Drawer,
    ElImage,
    RouteMarker
  },
  data () {
    return {
    }
  },
  created () {
    //  this.bus.$on('olMapClick', this.MapClick)
  },
  beforeDestroy () {
    // this.bus.$off('olMapClick')
  },

  computed: {
    map () {
      return this.$store.state.Ol.oMap
    },
  },
  methods: {

    generateUrl () {
      return window.location.origin + '/' + this.$route.query.photo
      // return 'http://192.168.1.182:9141' + '/' + this.$route.query.photo
    },
    // 地图点击
    MapClick (evt) {
      // 获取地图上的feature
      // console.log('offline中carArchives的点击');
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_
      // this.mapPopupData.show = true
      // this.mapPopupData.position = evt.coordinate
      this.curFeature = { ...curFeature }
    },
    toMapPanTo (item, index) {
      this.$refs.map.panTo([item.lng, item.lat])
      this.itemClick(item, index)
    }
  }
}
</script>

<style lang="less" scoped>
.map_con {
  position: relative;
}
header {
  height: 60px;
  background: var(--fangkongyujing-xinjian-bianji-header-bg);
  border: 2px solid rgba(255, 255, 255, 0.06);
  opacity: 0.9;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 99;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 16px;
  .back-box{
    display: flex;
    cursor: pointer;
  }
  .back {
    margin-left: 8px;
  }
}
.car-infos {
  .header-info {
    width: 100%;
    height: 140px;
    .top-car-name {
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      color: var(--base-text-color-1);
      font-size: 16px;
      font-weight: bold;
      background-color: #394762;
    }
    .bottom-info {
      padding: 16px;
      box-sizing: border-box;
      width: 100%;
      height: 108px;
      background-color: #33415c;
      display: flex;
      .lf-img {
        margin-right: 8px;
      }
      .rg-info {
        .item-info {
          margin-bottom: 8px;
          span {
            display: inline-block;
          }
          span:first-child {
            color: var(--base-text-color-to-999999);
            width: 80px;
          }
          span:last-child {
            color: var(--base-text-color-1);
            width: 160px;
          }
        }
      }
    }
  }
}
.right-content {
  height: calc(100vh - 300px);
  overflow: scroll;
  margin-top: 24px;
  li {
    margin-bottom: 16px;
  }
}
.time-picker {
  margin: 24px 0 16px 0;
  width: 100%;
  ::v-deep .datepick {
    .formItem {
      width: 100% !important;
    }
  }
}
.car-trajectory {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  overflow-y: scroll;
  height: calc(100vh - 463px);
  background-color: #303e56;
}
.empty_div {
  height: calc(100vh - 500px);
}
::v-deep .RoundTimeline {
  .el-timeline-item__tail {
    left: 9px;
    top: 10px;
    border-left: 1px solid #42506a;
  }
  // .el-timeline-item__wrapper{
  //   cursor: pointer;
  //   background: chartreuse;
  // }
  .el-timeline-item__timestamp {
    font-size: 16px;
    color: var(--base-text-color-1);
    height: 21px;
    line-height: 21px;
  }
  .el-timeline-item__timestamp.is-top {
    padding-top: 0px;
  }
  .el-timeline-item__content {
    color: var(--base-text-color-to-999999);
    height: 21px;
    font-size: 16px;
    line-height: 21px;
  }
  .el-timeline-item__node--normal {
    width: 7px;
    height: 7px;
  }
}
</style>
