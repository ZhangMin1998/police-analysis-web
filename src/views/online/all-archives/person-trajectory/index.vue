<template>
  <div class="map_con">
    <amap :center="center">
      <!-- 返回顶部栏 -->
      <header>
        <!-- <list-title title="轨迹详情"></list-title>
        <div class="back-box" @click="$router.push({ name: 'keyPersonnelBase' })">
          <img
              width="16"
              height="16"
              :src="require('@/assets/img/' + 'icon-reback' + '.png')"
            />
          <div class="back">返回</div>
        </div> -->
        <div class='set'>
          <img :src='require("@/assets/img/title-header.png")' alt=''>
          <div>档案详情</div>
        </div>
        <div class="back-box" @click.stop="clickBack">
          <i class='iconfont icon-fanhui'></i>
          <span>返回</span>
        </div>
      </header>

      <!-- -----------------  人物信息 --------------------- -->
      <!-- <div class="person-info">
        <el-popover placement="bottom-start" width="200" trigger="click" :offset="-18">
          <div>
            <div class="transition-box">
              <div class="transition-box-item" v-for="item in personInfoList" :key="item.prop">
                <div class="transition-box-item-label">{{ item.label }}：</div>
                <Ellipsis :dataObj.sync="personData" :wordsLength="18" :propStr="item.prop" />
              </div>
            </div>
          </div>

          <div slot="reference" class="person-info-icon">
            <i :class="showPerson ? 'el-icon-arrow-up' : 'el-icon-s-custom'"></i>
            <span> 轨迹人基本信息</span>
          </div>
        </el-popover>
      </div> -->

      <!-- 消息面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '70px', height: 'calc(100vh - 200px)' }"
        width="442px"
        oldLeft="10px"
        moveLeft="-442px"
        @handleClick="DrawerHandleClick"
      >
        <div class="person-infos">
          <div class="header-info">
            <div class="top-person-name">{{ personData.name || '--' }}</div>
            <div class="bottom-info">
              <div class="lf-img">
                <ElImage
                  class="search-image"
                  :imgSet="{
                    src: generateUrl(),
                    height: 76,//96
                    width: 60,
                    fit: 'contain',
                    errorSrc: 'icon-morenHeader'
                  }"
                ></ElImage>
              </div>
              <div class="rg-info">
                  <div class="transition-box-item" v-for="item in personInfoList" :key="item.prop">
                    <div class="transition-box-item-label">{{ item.label }}：</div>
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
              <RoundTimeline ref="RoundTimeline" :isKeyPersonTrack="isKeyPersonTrack" :isClick="true" @itemClick="itemClick" :activities="activities">
              </RoundTimeline>
              <!-- <RoundTimeline :activities="activities" /> -->
            </div>
            <div class="empty_div" v-else>
              <EmptyData />
            </div>
          </Loading>
        </div>
        <div class="total">
          <span>总数：{{activities.length}}</span>
        </div>
        <!-- <CusTitle title="轨迹详情"></CusTitle> -->
        <!-- <div class="RoundTimeline" v-if="activities.length > 0">
          <div class="trackInfo">
            <div class="trackInfo-time">
              {{ tracksobj.startTime }} {{ tracksobj.endTime ? '~' + tracksobj.endTime : '' }}
            </div>
            <div class="trackInfo-place">
              {{ tracksobj.startAdd }} {{ tracksobj.endAdd ? '~' + tracksobj.endAdd : '' }}
            </div>
          </div>

          <RoundTimeline :activities="activities" />
        </div> -->

        <!-- <div class="track-empty" v-else>
          <div>
            <img class="track-empty-img" src="@/assets/img/bg-deduction.png" />
          </div>
          <div class="empty-text">暂无轨迹</div>
        </div> -->
      </drawer>
      <!-- 中间的点 -->
      <personTrack ref="routeMarkerRef" @elementClick="elementClick" :list="tracksList"/>
      <!-- ---------------  轨迹 --------------------  -->
      <!-- <NormalMark
        v-for="(item, idx) in markersList"
        :key="'normal' + idx"
        :index="idx"
        :probetimes="item.count"
        :NormalMarkitem="item"
        :id="'normal' + idx"
        :position="item.position"
        @clickMarker="clickMarker"
      /> -->

      <!-- <SEMark
        v-for="(item, index) in startAndEndList"
        :key="'startAndEnd' + index"
        :probetimes="item.time"
        :position="item.position"
      /> -->

      <!-- 弹出窗体 -->
      <MapPop
        :position="mapPopupData.position"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <div>{{ curFeature.placeName || '--' }}</div>
      </MapPop>

      <!-- 控件 -->
      <map-control :list="iconMiniData" />
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import trajectoryMethod from '@/views/offline/all-archives/person-trajectory/trajectoryMethod'
import MapPop from '@/components/Map/OnlineMap/MapPopup'
import ElImage from '@/components/BasicComponents/ElImage'
import personTrack from '@/components/Map/OnlineMap/personTrack'
// import NormalMark from '@/views/online/analysis/work-and-rest-analysis/analysisNormalMark'
// import SEMark from '@/views/online/analysis/work-and-rest-analysis/SEMark'

export default {
  mixins: [AmapMixins, trajectoryMethod],
  components: {
    // NormalMark,
    // SEMark,
    MapPop,
    ElImage,
    personTrack
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
  methods: {
    // clickMarker(e) {
    //   this.mapPopupData.show = true
    //   this.mapPopupData.position = e.position
    //   this.curFeature = { ...e }
    // },
    generateUrl () {
      // return window.location.origin + '/' + this.personData.avatar
      // return 'http://192.168.1.182:8098' + '/' + this.$route.query.avatar
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
header {
  height: 60px;
  // background: var(--fangkongyujing-xinjian-bianji-header-bg);
  // border: 2px solid rgba(255, 255, 255, 0.06);
  // opacity: 0.9;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 999;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 16px;
  .set {
    position: relative;
    height: 24px;
    width: 120px;
    line-height: 24px;
    font-size: 18px;
    color: var(--base-text-color-1);
    font-weight: bold;
    div {
      position: absolute;
      bottom: 0;
      margin-left: 24px;
    }
    img {
      // width: 65px;
      // height: 8px;
      margin: 3px 3px 0 0;
    }
  }
  .back-box{
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
    //.reback{
    //  margin-left: 30px;
    //  top: 5px;
    //  position: absolute;
    //  display: flex;
    //  .back_label {
    //    color: #fff;
    //    margin-left: 8px;
    //    font-size: 14px;
    //    font-weight: bold;
    //  }
    //}
  }
  // .back-box{
  //   display: flex;
  //   cursor: pointer;
  // }
  // .back {
  //   margin-left: 8px;
  // }
}
/deep/.DrawerWrapper{
  background: var(--bg-color-3);
  padding: 16px 16px 0;
  border: 0;
}
/deep/.DrawerContainer .icon-con{
  background: var(--bg-color-3);
  border: 0;
}
.person-infos {
  .header-info {
    width: 100%;
    height: 156px;
    .top-person-name {
      box-sizing: border-box;
      width: 100%;
      height: 32px;
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
      height: 108px;
      background-color: var(--bg-color-2);
      display: flex;
      .lf-img {
        margin-right: 8px;
      }
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
.time-picker {
  margin: 0 0 16px 0;
  width: 100%;
  ::v-deep .datepick {
    .formItem {
      width: 100% !important;
    }
  }
}
.person-trajectory {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 0 0 0;
  overflow-y: scroll;
  height: calc(100vh - 470px);
  background-color: var(--bg-color-2);
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
.total{
  margin-top: 12px;
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
// /deep/.el-timeline-item__tail {
//   top: 10px;
//   left: 12px;
//   border-left: 1px solid var(--base-text-color-to-999999);
// }

// .person-info {
//   padding: 18px;
//   background-color: #273248;
//   position: absolute;
//   left: 570px;
//   top: 6px;
//   z-index: 99;
//   .person-info-icon {
//     text-align: right;
//   }
// }
// .transition-box {
//   .transition-box-item {
//     display: flex;
//     line-height: 24px;
//     .transition-box-item-label {
//       color: var(--base-text-color-to-999999);
//     }
//     .transition-box-item-value {
//       color: #c0d0e7;
//     }
//   }
// }

// .switch-page {
//   background: #202b3f;
//   position: absolute;
//   top: 6px;
//   right: 6px;
//   z-index: 1;
//   width: 133px;
//   height: 32px;
//   line-height: 32px;
//   color: #d8b733;
//   font-weight: bold;
//   font-size: 14px;
//   padding-left: 17px;
//   box-sizing: border-box;
//   background: url('~@/assets/img/list-mode-bg.png') no-repeat;
//   background-size: 100% 100%;
//   cursor: pointer;
// }

// .RoundTimeline {
//   height: 94%;
//   padding: 16px;
//   box-sizing: border-box;
//   overflow: auto;
//   background-color: rgba(255, 255, 255, 0.04);
// }


// .trackInfo {
//   padding-bottom: 12px;
//   margin-bottom: 24px;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//   font-size: 16px;
// }

// .trackInfo-time {
//   margin-bottom: 12px;
// }

// .track-empty {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   height: 94%;
//   background-color: rgba(255, 255, 255, 0.04);
//   &-img {
//     width: 181px;
//     height: 137px;
//     margin-bottom: 24px;
//   }
// }
</style>
