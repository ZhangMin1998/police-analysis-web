<template>
<div class='map_con'>
  <div class="switch_list">
    <TabsMapWithList :activeName="activeName" @clickTab="clickTab"></TabsMapWithList>
  </div>
  <ol-map curStyle="height:100%" v-show="activeName === 'map'">
    <!-- 消息面板 -->
    <drawer
      :drawer.sync="drawer"
      :cusStyle="{ top: '2%', height: '96%' }"
      :drawerTop="{width:imgWidth,height:'5px'}"
      width="442px"
      oldLeft="20px"
      moveLeft="-442px"
      @handleClick="DrawerHandleClick"
    >
      <template v:slot>
        <div>
          <Steps :list="stepList" @expend="handleExpend">
            <!-- 基本信息 -->
            <template v-slot:step_content0>
              <AnalysisForm ref="AnalysisForm" @handleReq="handleReq" @updateLoading='updateLoading'  @clickAnalysis="clickAnalysis"/>
            </template>

            <template v-slot:btn1>
              <el-button
                type="primary"
                :loading="isSubmiting"
                @click="submitForm"
                v-show="!stepList[1].isChecked"
                >{{ isSubmiting ? '分析中...' : '分析' }}</el-button
              >
            </template>

            <template v-slot:step_content1>
              <div class="trackInfo">
                <div class="trackInfo-time">
                  {{ tracksobj.startTime }} {{ tracksobj.endTime ? '~' + tracksobj.endTime : '' }}
                </div>
                <div class="trackInfo-place">
                  {{ tracksobj.startAdd }} {{ tracksobj.endAdd ? '~' + tracksobj.endAdd : '' }}
                </div>
              </div>
              <div class="RoundTimeline">
                <RoundTimeline :activities="activities" @itemClick='toMapPanTo' :isShowAdd='true' :needInd='true' :isClick='true'/>
              </div>
            </template>
          </Steps>
        </div>
      </template>
    </drawer>

    <!-- 控件 -->
    <map-control />

    <RouteMarker ref="routeMarkerRef" :list="tracksListMap" :isTrack='true' :activeIndex='activeIndex'/>
  </ol-map>
  <div class="table_track" v-show="activeName === 'list'">
    <ListPages :tableList="tracksList"></ListPages>
  </div>
  <div class='play_track' v-show="activeName === 'map'">
    <TrackPlayback
      :pTrackPoints='trackPointList'
      :pLayerCName='"path-marker"'
      :trackLineId='"trackLine"'
    ></TrackPlayback>
  </div>
</div>
</template>

<script>
import RouteMarker from '@/components/Map/OfflineMap/route-path'
import mapMixin from '@/mixins/omap'
import SpaceRoundMethod from '@/views/offline/analysis/space-time-trajectory/spaceRoundMethod'
import TrackPlayback from '@/components/Map/OfflineMap/track-playback'
export default {
  name: 'SpaceRound',
  components: {
    RouteMarker,
    TrackPlayback
  },

  mixins: [mapMixin, SpaceRoundMethod],

  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  methods: {
    toMapPanTo (item, index) {
      if (!item.pLatitude || !item.pLongitude) {
        this.$message.warning('暂无经纬度，地图坐标暂不可显示！')
        return
      }
      this.bus.$emit('setViewCenter', {
        position: [item.pLongitude, item.pLatitude],
        zoom: 12,
        isMark: false
      })
      this.itemClick(index)
    }
  }
}
</script>

<style lang="less" scoped>
.switch_list {
  position: absolute;
  right: 8px;
  top: 16px;
  z-index: 10;
}
::v-deep .RoundTimeline {
  height: calc(100vh - 455px);
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
  .el-timeline-item__tail {
    left: 11px;
    top: 10px;
  }
}
.trackInfo {
  padding: 8px 16px 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 16px;
  letter-spacing: 1.5px;
  line-height: 24px;
}

.trackInfo-time {
  margin-bottom: 12px;
}
/deep/.el-timeline-item__wrapper {
  height: max-content;
  cursor: pointer;
  .el-timeline-item__timestamp.is-top {
    padding-top: 3px;
  }
}
.play_track {
  position: absolute;
  left: 50%;
  bottom: 24px;
}
</style>
