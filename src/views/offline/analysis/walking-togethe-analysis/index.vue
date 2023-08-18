<template>
  <div class="map_con">
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
                <AnalysisForm ref="AnalysisForm" :hasImageAttr="false" @handleReq="handleReq"/>
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
                    @tableData="getTableData"
                  />
                </div>
              </template>
            </Steps>
          </div>
        </template>
      </drawer>
      <!-- 控件 -->
      <map-control :list="iconMiniData" />

      <RouteMarker ref="routeMarkerRef" :list="tracksList" :isRepeat="true" />
      <RouteMarker ref="routeMarkerRefDash" :list="dashTracksList" lineType="dash" />
      <!-- ------------------  进度条  ----------------- -->
      <ProgressBox
        title="数据分析中..."
        :sonHasCancel="false"
        :addJob="true"
        :show.sync="isSubmiting"
        @handleAddJob="handleAddJob"
      />
    </ol-map>
    <div class="table_track" v-show="activeName === 'list'">
      <ListPages :tableList="tableData"></ListPages>
    </div>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import RouteMarker from '@/components/Map/OfflineMap/route-path'
import peerAnalysisMethod from '@/views/offline/analysis/walking-togethe-analysis/peerAnalysisMethod'
export default {
  name: 'PeerAnalysis',
  mixins: [mapMixin, peerAnalysisMethod],
  components: {
    RouteMarker
  }
}
</script>

<style lang="less" scoped>
.map_con{
  overflow-y: hidden;
}
.switch_list {
  position: absolute;
  right: 8px;
  top: 16px;
  z-index: 10;
}
// .table_track{
//   padding-top: 60px;
// }
</style>
