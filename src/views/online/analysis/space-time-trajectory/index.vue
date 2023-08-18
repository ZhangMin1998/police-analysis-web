<template>
  <div class="map_con">
    <amap :center="center">
      <!-- 消息面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '2%', height: '96%' }"
        width="442px"
        oldLeft="10px"
        moveLeft="-442px"
        @handleClick="DrawerHandleClick"
      >
        <template v:slot>
          <div>
            <Steps :list="stepList" @expend="handleExpend">
              <!-- 基本信息 -->
              <template v-slot:step_content0
                ><AnalysisForm ref="AnalysisForm" @handleReq="handleReq" @updateLoading='updateLoading'
              /></template>

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
                    {{ tracksobj.startTime }} ~ {{ tracksobj.endTime }}
                  </div>
                  <div class="trackInfo-place">
                    {{ tracksobj.startAdd }} ~ {{ tracksobj.endAdd }}
                  </div>
                </div>
                <div class="RoundTimeline">
                  <RoundTimeline :activities="activities" :isShowAdd='false'/>
                </div>
              </template>
            </Steps>
          </div>
        </template>
      </drawer>

      <RouterPath :list="tracksList" :lineType="lineStyle[0]" />
      <RouterMarker :list="tracksList" />
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import RouterPath from '@/components/Map/OnlineMap/router-path'
import RouterMarker from '@/components/Map/OnlineMap/router-marker'
import SpaceRoundMethod from '@/views/offline/analysis/space-time-trajectory/spaceRoundMethod'

export default {
  components: {
    RouterPath,
    RouterMarker
  },
  mixins: [AmapMixins, SpaceRoundMethod],
  data () {
    return {
      lineStyle: ['dashed', 'solid']
    }
  }
}
</script>

<style lang="less" scoped>
.map  .ol-overlaycontainer,
.map  .ol-overlaycontainer-stopevent {
  width: auto !important;
  height: auto !important;
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
</style>
