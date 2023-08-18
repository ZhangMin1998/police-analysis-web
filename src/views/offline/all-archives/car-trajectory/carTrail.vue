<template>
  <div class="map_con">
    <ol-map class="map" style="height: 100%" ref='map'>
      <!-- 顶部返回栏 -->
      <!-- <header>
        <div class='set'>
          <img :src='require("@/assets/img/title-header.png")' alt=''>
          <div>车辆轨迹</div>
        </div>
        <div class="back-box" @click.stop="$router.push({ name: 'carFile' })">
          <i class='iconfont icon-fanhui'></i>
          <span>返回</span>
        </div>
      </header> -->
      <!-- 左侧车辆信息栏 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '70px', height: 'calc(100vh - 200px)' }"
        :drawerTop="{width:imgWidth,height:'5px'}"
        width="424px"
        oldLeft="32px"
        :moveLeft="moveLeft"
        @handleClick="DrawerHandleClick"
      >
        <div class="car-infos">
          <div class="header-info">
            <div class="top-car-name">{{ $route.query.carNumber || '--' }}</div>
            <div class="bottom-info">
              <div class="lf-img">
                <el-image
                  :src="generateUrl"
                  :preview-src-list="$route.query.photo ? [generateUrl] : []"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <img :src="errImg" />
                  </div>
                </el-image>
              </div>
              <div class="rg-info">
                <div class="item-info">
                  <div class="label">车主:</div>
                  <div class="value">{{ $route.query.personName || '--' }}</div>
                </div>
                <div class="item-info">
                  <div class="label">证件类型:</div>
                  <div class="value">{{ $route.query.cerType || '--' }}</div>
                </div>
                <div class="item-info">
                  <div class="label">证件号码:</div>
                  <div class="value">{{ $route.query.cerNumber || '--' }}</div>
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
              <RoundTimeline
                ref="RoundTimeline"
                :isClick="true"
                @itemClick="toMapPanTo"
                :isShowDataTypeStr="isShowDataTypeStr"
                :activities="activities"
                :needInd='true'
                :isShowAdd='true'>
              </RoundTimeline>
            </div>
            <div class="empty_div" v-else>
              <EmptyData />
            </div>
          </Loading>
        </div>
      </drawer>
      <!-- 中间车辆轨迹 -->
      <RouteMarker ref="routeMarkerRef" @elementClick="elementClick" :list="tracksList" :lineList="lineList" :activeIndex='activeIndex'/>

      <!-- 弹出窗体 -->
      <MapPop
        :position="mapPopupData.position"
        :offset="mapPopupData.offset"
        :mapShow="mapPopupData.show"
      >
        <div>{{ mapPopData.placeAddress || '--' }}</div>
      </MapPop>

      <!-- 右边部分的内容 -->
      <CusDrawerRight :CusDrawerRight="CusDrawerRightInfo">
        <Loading :isLoading.sync="rightPlaceLoading">
          <ul class="right-content">
            <li v-for="(item, index) in placeInfoArr" :key="index">{{ item.time }}</li>
          </ul>
        </Loading>
      </CusDrawerRight>
      <!-- 控件 -->
      <map-control />
    </ol-map>
    <div class='play_track' v-show="activeChart === 'map'">
      <TrackPlayback
        :pTrackPoints='trackPlayList'
        :pLayerCName='"car-marker"'
        :trackLineId='"trackLine"'
      ></TrackPlayback>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import mapMixin from '@/mixins/omap'
// import ElImage from '@/components/BasicComponents/ElImage'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import carArchivesMethod from '@/views/offline/all-archives/car-trajectory/carArchivesMethod'
import RouteMarker from '@/components/Map/OfflineMap/car-path'
import MapPop from '@/components/Map/OfflineMap/MapPop'
import TrackPlayback from '@/components/Map/OfflineMap/track-playback'
export default {
  mixins: [mapMixin, carArchivesMethod],
  components: {
    Drawer,
    // ElImage,
    RouteMarker,
    MapPop,
    TrackPlayback
  },
  props: {
    activeChart: {
      type: String
    }
  },
  data () {
    return {
      moveLeft: '-424px',
      imgWidth: ''
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--icon-nocar-pic']
    },
    map () {
      return this.$store.state.Ol.oMap
    },
    generateUrl () {
      return window.location.origin + '/' + this.$route.query.photo
    },
  },
  created () {
    //  this.bus.$on('olMapClick', this.MapClick)
  },
  mounted () {
    this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  beforeDestroy () {
    // this.bus.$off('olMapClick')
  },
  methods: {

    // generateUrl () {
    //   return window.location.origin + '/' + this.$route.query.photo
    // },
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
      // console.log(item)
      if (!item.latitude || !item.longitude) {
        this.$message.warning('暂无经纬度，地图坐标暂不可显示！')
        return
      }
      this.bus.$emit('setViewCenter', {
        position: [item.longitude, item.latitude],
        zoom: 12,
        isMark: false
      })
      this.itemClick(item, index)
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width:1365px) {
  /deep/.DrawerWrapper{
    width: 550px !important;
  }
  .car-infos {
    .header-info {
      height: 156px;
      .top-car-name {
        height: 32px;
      }
      .bottom-info {
        height: 108px;
        .rg-info {
          .item-info {
            .label{
              width: 110px;
            }
          }
        }
      }
    }
  }
  .car-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    margin-bottom: 24px;
    overflow-y: scroll;
    height: calc(100vh - 450px);
    .empty_div {
      height: calc(100vh - 500px);
    }
  }
}
@media screen and (min-width: 1365px) and (max-width:1919px) {
  .car-infos {
    .header-info {
      height: 156px;
      .top-car-name {
        height: 32px;
      }
      .bottom-info {
        height: 108px;
        .rg-info {
          .item-info {
            .label{
              width: 75px;
            }
          }
        }
      }
    }
  }
  .car-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    margin-bottom: 24px;
    overflow-y: scroll;
    height: calc(100vh - 450px);
    .empty_div {
      height: calc(100vh - 500px);
    }
  }
}
@media screen and (min-width: 1920px){
  .car-infos {
    .header-info {
      height: 156px;
      .top-car-name {
        height: 32px;
      }
      .bottom-info {
        height: 108px;
        .rg-info {
          .item-info {
            .label{
              width: 70px;
            }
          }
        }
      }
    }
  }
  .car-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0 0 0;
    margin-bottom: 24px;
    overflow-y: scroll;
    height: calc(100vh - 450px);
    .empty_div {
      height: calc(100vh - 500px);
    }
  }
}
.map_con {
  position: relative;
  // header {
  //   height: 60px;
  //   position: absolute;
  //   left: 0;
  //   top: 0px;
  //   z-index: 999;
  //   width: 100%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   box-sizing: border-box;
  //   padding: 0 16px 0 32px;
  //   .set {
  //     display: flex;
  //     color: #C0D0E7;
  //     font-size: 18px;
  //     line-height: 24px;
  //     font-weight: bold;
  //     align-items: center;
  //     img {
  //       margin-right: 5px;
  //       width: 18px;
  //       height: 18px;
  //     }
  //   }
  //   .back-box{
  //     display: flex;
  //     align-items: center;
  //     cursor: pointer;
  //     i {
  //       font-size: 16px;
  //       color: #8495C2;
  //       margin-right: 8px;
  //     }
  //     span {
  //       font-size: 14px;
  //       font-weight: bold;
  //       color: @font-color-1;
  //     }
  //   }
  // }
  /deep/.DrawerWrapper{
    background-color: var(--bg-color-1);
    padding: 16px 16px 0;
    border: 0;
  }
  /deep/.DrawerContainer .icon-con{
    background-color: var(--bg-color-1);
    border: 0;
  }
  .car-infos {
    .header-info {
      width: 100%;
      .top-car-name {
        box-sizing: border-box;
        width: 100%;
        line-height: 24px;
        color: var(--base-text-color-1);
        font-size: 16px;
        font-weight: bold;
      }
      .bottom-info {
        padding: 16px;
        box-sizing: border-box;
        width: 100%;
        background-color: var(--car-left-drawer-info-bg);
        box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
        display: flex;
        .lf-img {
          .el-image {
            display: block;
            width: 122px;
            height: 76px;
            img {
              width: 122px;
              height: 76px;
            }
          }
          /deep/.image-slot {
            background: var(--bg-color-2) !important;
          }
          margin-right: 8px;
          .search-image{
            height: 68px !important;
          }
        }
        .rg-info {
          .item-info {
            display: flex;
            line-height: 24px;
            .label{
              font-size: 14px;
              color: var(--base-text-color-to-666666);
            }
            .value{
              font-size: 16px;
              color: var(--base-text-color-1);
              // width: 160px;
            }
          }
        }
      }
    }
  }
  .time-picker {
    margin: 0 0 16px 0;
    width: 100%;
    ::v-deep .datepick {
      .formItem {
        width: 100% !important;
      }
    }
  }
  .car-trajectory {
    background-color: var(--car-left-drawer-info-bg);
    box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
  }
  .right-content {
    height: calc(100vh - 300px);
    overflow: scroll;
    margin-top: 24px;
    li {
      margin-bottom: 16px;
    }
  }
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
    color: var(--base-text-color-to-666666);
    height: 21px;
    font-size: 16px;
    line-height: 21px;
  }
  .el-timeline-item__node--normal {
    width: 7px;
    height: 7px;
  }
}
.play_track {
  position: absolute;
  left: 50%;
  bottom: 24px;
}
</style>
