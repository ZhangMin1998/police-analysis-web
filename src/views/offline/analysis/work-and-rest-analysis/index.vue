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
                <AnalysisForm
                  ref="AnalysisForm"
                  @updateLoading="updateLoading"
                  @handleReq="handleReq"
                  @clickAnalysis="clickAnalysis"
                />
              </template>

              <template v-slot:btn1>
                <el-button type="primary" :loading="isSubmiting" @click="submitForm">{{
                  isSubmiting ? '分析中...' : '分析'
                }}</el-button>
              </template>
            </Steps>
          </div>
        </template>
      </drawer>

      <!-- 右上角的单选 -->
      <div class="tab-nav-wrapper">
        <div class="tab-nav">
          展示方式：
          <el-radio-group v-model="display" @change="changeRadio">
            <el-radio v-for="(item, index) in RadioList" :key="index" :label="item.value">{{
              item.name
            }}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <map-control :list="iconMiniData" />

      <!-- 点击点查看详情 -->
      <pop :pop.sync="pop" customClass="echart" @beforeClose="hidePop" @beforeOpen="showPop">
        <!-- 详情 -->
        <WorkAndRestDetail
          :placeData="placeData"
          :startTime="startTime"
          :endTime="endTime"
          :scatterData="scatterData"
        ></WorkAndRestDetail>
      </pop>

      <!-- 起点终点 -->
      <title-marker
        v-for="(item, index) in startAndEndList"
        :position="item.position"
        :content="item.time"
        :iconUrl="imgsMap[index]"
        :key="'startAndEnd' + index"
        :item="{ ...item, noClick: true }"
      />

      <!-- 正常点 -->
      <!-- <pure-marker
      v-for="(item, index) in markersListMap"
      :key="'normal' + index"
      :item="item"
      :position="item.position"
      :content="item.count"
    /> -->
      <MapMaker ref="MapMaker" :list="markersListMap"></MapMaker>
    </ol-map>
    <div v-show="activeName === 'list'">
      <ListPages :tableList="markersList"></ListPages>
    </div>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
// import PureMarker from '_com/map/marker/pure-marker'
import MapMaker from '@/views/offline/analysis/work-and-rest-analysis/mapMaker'
import TitleMarker from '_com/map/marker/title-marker'
import WorkAndRestMethod from '@/views/offline/analysis/work-and-rest-analysis/workAndRestMethod'


export default {
  name: 'WorkAndRest',
  components: {
    MapMaker,
    // PureMarker,
    TitleMarker
  },

  mixins: [mapMixin, WorkAndRestMethod],

  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },

  mounted () {
    setTimeout(() => {
      // 监听地图点  点击事件
      this.initClickEvent()
    }, 1000)
  },

  // beforeDestroy() {
  //   this.bus.$off('olMapClick')
  // },
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    next()
  },

  methods: {
    //点击标志
    initClickEvent () {
      this.bus.$on('olMapClick', e => {
        const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
        // console.log(!feature || feature.id_ || feature.get('noClick'))
        if (!feature) {
          return
        }
        const { placeCode, placeAddress, placeName } = feature.values_

        const obj = {
          placeCode,
          placeAddress,
          placeName
        }
        this.jumpAnaly(obj)
      })
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
// .map >>> .ol-overlaycontainer,
// .map >>> .ol-overlaycontainer-stopevent {
//   width: auto !important;
//   height: auto !important;
// }
.tab-nav-wrapper {
  position: absolute;
  z-index: 2;
  top: 50px;
  right: 8px;
}

.tab-nav {
  box-sizing: border-box;
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  opacity: 0.87;
  border: 2px solid rgba(255, 255, 255, 0.06);
  padding: 20px 16px;

  /* flex-direction: ; */
  /* color: #C0D0E7; */
  color: var(--base-text-color-1);
}

.tab-nav > li {
  user-select: none;
  color: var(--base-text-color-to-999999);
  cursor: pointer;
  /* display: inline-block; */
}

.tab-nav > li:hover {
  color: #177ddc;
}
.tab-nav-wrapper /deep/.el-radio__label {
  /* color: #C0D0E7; */
  color: var(--base-text-color-1);
  font-size: 16px;
}
</style>
