<template>
  <div class="map_con spaceRound">
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
                >
                <AnalysisForm ref="AnalysisForm" :hasImageAttr="false" @handleReq="handleReq"
              />
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
                <div class="RoundTimeline">
                  <AnalysisResult
                    :tableParams.sync="tableParams"
                    :isSubmiting.sync="isSubmiting"
                    @toggleMainTrackList="toggleMainTrackList"
                    @toggleDashTrackList="toggleDashTrackList"
                  />
                </div>
              </template>
            </Steps>
          </div>
        </template>
      </drawer>
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
      <RouterPath :list="tracksList" lineType="solid" />
      <RouterMarker :list="tracksList" />

      <RouterPath :list="dashTracksList" lineType="dashed" />
      <RouterMarker :list="dashTracksList" />

      <!-- ------------------  进度条  ----------------- -->
      <ProgressBox
        title="数据分析中..."
        :sonHasCancel="false"
        :addJob="true"
        :show.sync="isSubmiting"
        @handleAddJob="handleAddJob"
      />
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import RouterPath from '@/components/Map/OnlineMap/router-path'
import RouterMarker from '@/components/Map/OnlineMap/router-marker'
import peerAnalysisMethod from '@/views/offline/analysis/walking-togethe-analysis/peerAnalysisMethod'

export default {
  mixins: [AmapMixins, peerAnalysisMethod],
  provide () {
    return {
      getRound: this.getRound,
      defaultRoundEvent: this.defaultRoundEvent,
      clickBtn: this.clickBtn
    }
  },
  components: {
    RouterPath,
    RouterMarker
  }
}
</script>

<style scoped>
</style>
