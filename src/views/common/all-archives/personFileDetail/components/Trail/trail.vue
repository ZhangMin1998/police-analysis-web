<template class="not_change_rem">
  <div class="map_con">
    <ol-map class="map" style="height: 100%" ref='map'>
      <!-- 菜单面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '70px', height: 'calc(100vh - 200px)' }"
        :drawerTop="{width:imgWidth,height:'5px'}"
        width="424px"
        oldLeft="32px"
        :moveLeft="moveLeft"
        @handleClick="DrawerHandleClick"
      >
        <div class="person-infos">
          <div class="header-info">
            <div class="top-person-name">{{ personData.name || '--' }}</div>
            <div class="bottom-info">
              <div class="not_change_rem">
                <div class="lf-img">
                <el-image
                  style="width:60px;height:76px;"
                  :src="generateUrl()"
                  :preview-src-list="generateUrl() ? [generateUrl()] : []"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <img :src="errImg" />
                  </div>
                </el-image>
              </div>
              </div>

              <div class="rg-info">
                  <div class="transition-box-item" v-for="item in personInfoList" :key="item.prop">
                    <div class="transition-box-item-label">{{ item.type ? personData[item.type] : item.label }}：</div>
                    <!-- <EllipsisPop :content="personData[item.prop]" width="170px"></EllipsisPop> -->
                    <Ellipsis :dataObj.sync="personData" :wordsLength="20" :propStr="item.prop" />
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="time-picker">
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
              <RoundTimeline
                ref="RoundTimeline"
                :isShowDataTypeStr="isShowDataTypeStr"
                :isClick="true"
                @itemClick="itemClick"
                :activities="activities"
                :isShowAdd='true'
                :needInd='true'
              >
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
      <personTrack ref="personTrack" @elementClick="elementClick" :list="tracksList" :activeIndex='activeIndex'/>

      <!-- 弹出窗体 -->
      <MapPop
        :position="mapPopupData.position"
        :offset="mapPopupData.offset"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <div>{{ curFeature.placeAddress  || '--' }}</div>
      </MapPop>

      <!-- 轨迹回放 -->
      <div class='play_track'>
        <TrackPlayback
          :pTrackPoints='trackPointList'
          :pLayerCName='"car-marker"'
          :trackLineId='"trackLine"'
        ></TrackPlayback>
      </div>

      <!-- 溯源弹框 -->
      <RightDialog :rightDialog="rightDialogInfo">
        <!-- <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>{{rightDialogInfo.dataSource}}</span>
        </div>
        <div class="main-content">
          <Loading :isLoading.sync="rightDialogInfo.loading">
            <el-descriptions :column="1">
              <el-descriptions-item v-for="(item, key) in rightDialogInfo.labelList" :key="key" :label="item.fieldNameCn">
                <div v-if="item.attrType !=='transformation_picture'">{{rightDialogInfo.listData[item.fieldNameEn]}}</div>
                <div v-else>
                  <el-image
                    style="width: 150px;"
                    :src="origin + rightDialogInfo.listData[item.fieldNameEn]"
                    :preview-src-list="rightDialogInfo.listData[item.fieldNameEn] ? [origin + rightDialogInfo.listData[item.fieldNameEn]] : []"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      --
                    </div>
                  </el-image>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </Loading>
        </div> -->
      </RightDialog>
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
    </ol-map>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
// import EllipsisPop from '@/components/BasicComponents/EllipsisPop'
import trajectoryMethod from './trajectoryMethod.js'
import MapPop from '@/components/Map/OfflineMap/MapPop'
import personTrack from '@/components/Map/OfflineMap/personTrack'
import mapMixin from '@/mixins/omap'
// import ElImage from '@/components/BasicComponents/ElImage'
import RightDialog from '@/views/common/all-archives/personFileDetail/components/Chart/rightDialog'
import TrackPlayback from '@/components/Map/OfflineMap/track-playback'

export default {
  mixins: [mapMixin, trajectoryMethod],
  components: {
    MapPop,
    // ElImage,
    TrackPlayback,
    personTrack,
    RightDialog
  },
  props: {
    personInfo: {
      type: Object,
      default: () => {}
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
      return colorObj['--person-default-pic']
    },
    map () {
      return this.$store.state.Ol.oMap
    },
    ID () {
      return this.$route.query.id
    },
    NavName () {
      return this.$route.query.label || ''
    },
    origin () {
      return window.location.origin + '/'
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
    // console.log(document.getElementsByClassName('DrawerWrapper'))
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
    width: 500px !important;
    height: calc(100vh - 274px);
  }
  .person-infos{
    .header-info{
      height: 215px;
      .top-person-name{
        height: 32px;
      }
      .bottom-info{
        height: 168px;
      //   .lf-img {
      //   margin-right: 8px;
      //   /deep/ .el-image {
      //     display: block;
      //     width: 60px;
      //     height: 100px;
      //     img {
      //       width: 60px !important;
      //       height: 100px !important;
      //     }
      //   }
      // }
        .rg-info {
          .transition-box-item {
            display: flex;
            line-height: 36px;
            .transition-box-item-label {
              font-size: 14px;
              width: 120px;
               /* 火狐浏览器1280*1024调整文字大小 */
               font-size-adjust:0.8
            }
            /deep/.defaultValue{
              font-size: 12px;
              /* 火狐浏览器1280*1024调整文字大小 */
              font-size-adjust:0.8
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
    // height: 704px;
    height: 70%;
    .empty_div {
      height: calc(100vh - 760px);
    }
  }
  .main-content{
    height: calc(100vh - 420px);
  }
}
@media screen and (min-width: 1366px) and (max-width:1919px) {
  /deep/.DrawerWrapper{
    // width: 424px !important;
    height: calc(100vh - 274px);
  }
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
    height: 75%;
    // height: calc(100vh - 480px);
    .empty_div {
      height: calc(100vh - 600px);
    }
  }
  .main-content{
    height: calc(100vh - 400px);
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
              width: 90px;
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
    height: 450px;
    .empty_div {
      height: calc(100vh - 550px);
    }
  }
  .main-content{
    height: calc(100vh - 330px);
  }
}
::v-deep.map_con {
  position: relative;
  height: calc(100vh - 114px);
  overflow: hidden;
}
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
//     color: @font-color-1;
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
      background-color: var(--car-left-drawer-info-bg);
      box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
      display: flex;
      .not_change_rem{
        .lf-img {
        margin-right: 8px;
        /deep/ .el-image {
          display: block;
          width: 60px;
          height: 80px;
          img {
            width: 60px;
            height: 80px;
          }
        }
        /deep/.image-slot {
          width: 60px;
          height: 80px;
          background: var(--bg-color-2) !important;
        }
      }
      }

      .rg-info{
        .transition-box-item-label {
          color: var(--base-text-color-to-666666);
        }
        .transition-box-item-value {
          color: var(--base-text-color-1);
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
  background-color: var(--car-left-drawer-info-bg);
  box-shadow: 0px -1px 12px 1px rgba(1, 47, 142, 0.08);
}
.total{
  margin: 20px 0;
  font-size: 14px;
}
.rightDialog {
  right: 32px;
  top: 90px;
  // background-color: var(--bg-color-2);
  // .title_box{
  //   padding: 12px 10px 12px 0;
  //   /deep/.el-divider--vertical {
  //     display: inline-block;
  //     width: 4px;
  //     height: 1em;
  //     margin: 0 0.04167rem 0 0;
  //     vertical-align: text-bottom;
  //     position: relative;
  //   }
  //   span {
  //     font-weight: 400;
  //     color: var(--base-text-color-1);
  //     font-size: 16px;
  //   }
  // }
  // .main-content{
  //   overflow-y: scroll;
  //   // height: calc(100vh - 300px);
  //   /deep/ img{
  //     width: 150px;
  //   }
  //   /deep/.el-descriptions__body {
  //     background-color: var(--bg-color-2);
  //     .el-descriptions-item__label{
  //       color: var(--base-text-color-to-999999);
  //     }
  //     .el-descriptions-item__content{
  //       color: var(--base-text-color-1);
  //     }
  //   }
  // }
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
  // @media screen and (min-width: 1024px) and (max-width: 1365px){
  //   .el-timeline-item__timestamp.is-top {
  //     margin-left: 20px !important;
  //   }
  // }
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
  z-index: 999;
  position: absolute;
  left: 50%;
  bottom: 24px;
}
</style>
