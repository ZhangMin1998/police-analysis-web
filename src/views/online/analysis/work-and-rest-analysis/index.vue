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
        ></workAndRestDetail>
      </pop>

      <NormalMark
        v-for="(item, idx) in markersList"
        :key="'normal' + idx"
        :index="idx"
        :probetimes="item.count"
        :NormalMarkitem="item"
        :id="'normal' + idx"
        :position="item.position"
        @clickMarker="clickMarker"
      />

      <SEMark
        v-for="(item, index) in startAndEndList"
        :key="'startAndEnd' + index"
        :probetimes="item.time"
        :position="item.position"
      />
    </amap>
  </div>
</template>

<script>
import WorkAndRestMethod from '@/views/offline/analysis/work-and-rest-analysis/workAndRestMethod'
import AmapMixins from '@/mixins/amap'
import NormalMark from '@/views/online/analysis/work-and-rest-analysis/analysisNormalMark'
import SEMark from '@/views/online/analysis/work-and-rest-analysis/SEMark'

export default {
  components: {
    NormalMark,
    SEMark
  },

  mixins: [AmapMixins, WorkAndRestMethod],

  methods: {
    //点击标志
    clickMarker (item) {
      const { placeCode, placeAddress, placeName } = item
      const obj = {
        placeCode,
        placeAddress,
        placeName
      }
      this.jumpAnaly(obj)
    }
  }
}
</script>

<style scoped>
.map >>> .ol-overlaycontainer,
.map >>> .ol-overlaycontainer-stopevent {
  width: auto !important;
  height: auto !important;
}
.tab-nav-wrapper {
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 8px;
}

.tab-nav {
  box-sizing: border-box;
  background: #202b3f;
  opacity: 0.87;
  border: 2px solid rgba(255, 255, 255, 0.06);
  padding: 20px 16px;

  /* flex-direction: ; */
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
  color: var(--base-text-color-1);
  font-size: 16px;
}
</style>
