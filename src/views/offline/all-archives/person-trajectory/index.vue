<template>
  <div class="map_con">
    <ol-map class="map" style="height: 100%" ref='map'>
      <!-- 返回顶部栏 -->
      <header>
        <div class='set'>
          <img :src='require("@/assets/img/title-header.png")' alt=''>
          <div>轨迹详情</div>
        </div>
        <div class="back-box" @click.stop="clickBack">
          <i class='iconfont icon-fanhui'></i>
          <span>返回</span>
        </div>
      </header>

      <!-- 菜单面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '70px', height: 'calc(100vh - 200px)' }"
        :drawerTop="{width:imgWidth,height:'5px'}"
        width="442px"
        oldLeft="32px"
        :moveLeft="moveLeft"
        @handleClick="DrawerHandleClick"
      >
        <div class="person-infos">
          <div class="header-info">
            <div class="top-person-name">{{ personData.name || '--' }}</div>
            <!-- <button @click="clear">清除</button> -->
            <div class="bottom-info">
              <div class="lf-img">
                <ElImage
                  class="search-image"
                  :imgSet="{
                    src: generateUrl(),
                    height: 76,//96
                    width: 60,
                    fit: 'contain',
                    errorSrc: errImg
                  }"
                ></ElImage>
              </div>
              <div class="rg-info">
                  <div class="transition-box-item" v-for="item in personInfoList" :key="item.prop">
                    <div class="transition-box-item-label">{{ item.label }}：</div>
                    <!-- <EllipsisPop :content="personData[item.prop]" width="170px"></EllipsisPop> -->
                    <Ellipsis :dataObj.sync="personData" :wordsLength="20" :propStr="item.prop" />
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
        <div class="person-trajectory">
          <Loading :isLoading.sync="searchLoading">
            <div class="RoundTimeline" v-if="activities.length">
              <RoundTimeline ref="RoundTimeline" :isShowDataTypeStr="isShowDataTypeStr" :isClick="true" @itemClick="itemClick" :activities="activities">
              </RoundTimeline>
            </div>
            <div class="empty_div" v-else>
              <EmptyData />
            </div>
          </Loading>
        </div>
        <div class="total">
          <span>总数：{{activities.length}}</span>
        </div>
      </drawer>
      <!-- 中间的点 -->
      <personTrack ref="personTrack" @elementClick="elementClick" :list="tracksList"/>

      <!-- 弹出窗体 -->
      <MapPop
        :position="mapPopupData.position"
        :offset="mapPopupData.offset"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <div>{{ curFeature.placeName  || '--' }}</div>
      </MapPop>
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
    </ol-map>
  </div>
</template>

<script>
// import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import trajectoryMethod from './trajectoryMethod.js'
import MapPop from '@/components/Map/OfflineMap/MapPop'
import personTrack from '@/components/Map/OfflineMap/personTrack'
import mapMixin from '@/mixins/omap'
import ElImage from '@/components/BasicComponents/ElImage'
// import trajectoryMethod from '@/views/offline/Trajectory/trajectoryMethod'
// import PureMarker from '_com/map/marker/pure-marker'
// import TitleMarker from '_com/map/marker/title-marker'

export default {
  mixins: [mapMixin, trajectoryMethod],
  components: {
    // PureMarker,
    // TitleMarker,
    MapPop,
    ElImage,
    personTrack,
    // EllipsisPop
  },
  data () {
    return {
      moveLeft: '-424px',
      imgWidth: ''
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    },
    ID () {
      return this.$route.query.id
    },
    NavName () {
      return this.$route.query.label || ''
    }
  },
  watch: {
    // generateUrl: {
    //   handler: function (newValue, oldValue) {
    //
    //   },
    //   immediate: true, //关键
    //   deep: true
    // }
  },

  created () {
    // this.bus.$on('olMapClick', this.MapClick)
  },
  mounted () {
    // console.log(document.getElementsByClassName('drawerBox'))
    this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  // beforeDestroy() {
  //   this.bus.$off('olMapClick')
  // },
  beforeRouteLeave (to, form, next) {
    // this.bus.$off('olMapClick')
    next()
  },

  methods: {
    generateUrl () {
      return window.location.origin + '/' + this.personData.avatar
      // return 'http://192.168.1.182:9142' + '/' + this.personData.avatar
    },
    clickBack (){
      if (this.$route.query.label === '重点人档案') {
        this.$router.push({ name: 'keyPersonnelBase' })
      } else if (this.$route.query.label === '人物档案') {
        this.$router.push({ name: 'personSocial' })
      } else if (this.$route.query.label === '自定义档案') {
        this.$router.push({ name: 'personCustom' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width:1365px) {
  /deep/.DrawerWrapper{
    width: 550px !important;
  }
  .person-infos{
    .header-info{
      height: 215px;
      .top-person-name{
        height: 32px;
      }
      .bottom-info{
        height: 168px;
        .rg-info {
          .transition-box-item {
            display: flex;
            line-height: 36px;
            .transition-box-item-label {
              font-size: 14px;
              width: 120px;
              color: var(--base-text-color-to-999999);
            }
            /deep/.defaultValue{
              color: var(--base-text-color-1);
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .person-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0 0 0;
    overflow-y: scroll;
    height: calc(100vh - 540px);
    background-color: var(--bg-color-2);
    box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
    .empty_div {
      height: calc(100vh - 760px);
    }
  }
}
@media screen and (min-width: 1366px) and (max-width:1919px) {
  // /deep/.DrawerWrapper{
  //   width: 424px !important;
  // }
  .person-infos{
    .header-info{
      height: 166px;
      .top-person-name{
        height: 24px;
      }
      .bottom-info{
        height: 128px;
        .rg-info {
          .transition-box-item {
            display: flex;
            line-height: 28px;
            .transition-box-item-label {
              font-size: 14px;
              width: 100px;
              color: var(--base-text-color-to-999999);
            }
            /deep/.defaultValue{
              color: var(--base-text-color-1);
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .person-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0 0 0;
    overflow-y: scroll;
    // height: 70%;
    height: calc(100vh - 480px);
    background-color: var(--bg-color-2);
    box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
    .empty_div {
      height: calc(100vh - 600px);
    }
  }
}
@media screen and (min-width: 1920px){
  // /deep/.DrawerWrapper{
  //   width: 424px !important;
  // }
  .person-infos{
    .header-info{
      height: 156px;
      .top-person-name{
        height: 32px;
      }
      .bottom-info{
        height: 108px;
        .rg-info {
          .transition-box-item {
            display: flex;
            line-height: 22px;
            .transition-box-item-label {
              font-size: 14px;
              width: 80px;
              color: var(--base-text-color-to-999999);
            }
            .transition-box-item-value {
              font-size: 16px;
              color: var(--base-text-color-1);
            }
          }
        }
      }
    }
  }
  .person-trajectory {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0 0 0;
    overflow-y: scroll;
    // height: 66%;
    height: calc(100vh - 470px);
    background-color: var(--bg-color-2);
    box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
    // .RoundTimeline {
    //   height: 94%;
    //   padding: 16px;
    //   box-sizing: border-box;
    //   overflow: auto;
    //   background-color: rgba(255, 255, 255, 0.04);
    // }
    .empty_div {
      height: calc(100vh - 550px);
    }
  }
}
.map_con {
  position: relative;
}
header {
  height: 60px;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 999;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 16px 0 32px;
  .set {
    display: flex;
    color: var(--base-text-color-1);
    font-size: 18px;
    line-height: 24px;
    font-weight: bold;
    align-items: center;
    img {
      margin-right: 5px;
      width: 18px;
      height: 18px;
    }
  }
  .back-box{
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 16px;
      color: var(--primary-menu-text-color);
      margin-right: 8px;
    }
    span {
      font-size: 14px;
      font-weight: bold;
      color: var(--base-text-color-1);
    }
  }
}
/deep/.DrawerWrapper{
  background: var(--bg-color-3);
  padding: 16px 16px 0;
  border: 0;
}
/deep/.DrawerContainer .icon-con{
  background: var(--bg-color-1);
  border: 0;
}
.person-infos {
  .header-info {
    width: 100%;
    .top-person-name {
      box-sizing: border-box;
      width: 100%;
      line-height: 24px;
      color: var(--base-text-color-1);
      font-size: 16px;
      font-weight: bold;
      // background-color: #394762;
    }
    .bottom-info {
      padding: 16px;
      box-sizing: border-box;
      width: 100%;
      background-color: var(--bg-color-2);
      box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
      display: flex;
      .lf-img {
        margin-right: 8px;
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

.total{
  margin: 20px 0;
  font-size: 14px;
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
