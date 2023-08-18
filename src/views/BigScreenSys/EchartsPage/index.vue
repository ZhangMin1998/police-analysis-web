<template>
  <div class="EchartsPage">
    <div class="middle" @click="clickOut">
      <div class="content"></div>
    </div>
    <div class="left EchartsPage-box">
      <ul class="EchartsPage-ul">
        <li class="EchartsPage-li">
          <CusScreenBox title="今日审计吞吐量">
            <div id="chart0" :style="{ width: '100%', height: '13rem' }"></div>
          </CusScreenBox>
        </li>
        <li class="EchartsPage-li">
          <CusScreenBox title="今日人脸吞吐量">
            <div id="chart1" :style="{ width: '100%', height: '13rem' }"></div>
          </CusScreenBox>
        </li>
        <li class="EchartsPage-li">
          <CusScreenBox title="设备统计">
            <ul class="deviceStatistics noScrool">
              <li class="deviceStatistics-li" v-for="item in iconMiniData" :key="item.text">
                <CusLitterBox
                  :topText="item.text"
                  :bottomText="item.value"
                  :icon="item.url"
                ></CusLitterBox>
              </li>
            </ul>
          </CusScreenBox>
        </li>
      </ul>
    </div>
    <div class="right EchartsPage-box">
      <ul class="EchartsPage-ul">
        <li class="EchartsPage-li">
          <CusScreenBox title="今日探针吞吐量">
            <div id="chart2" :style="{ width: '100%', height: '13rem' }"></div>
          </CusScreenBox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CusScreenBox from '@/components/BasicComponents/CusScreenBox'
import CusLitterBox from '@/components/BasicComponents/CusLitterBox'
import { Xcharts } from '@/utils/xcharts'
import { MockData } from '@/utils/xcharts/utils'
import { getAudit, getFace, getProbe, getDeviceTypeStatistics } from '@/api/bScreen'
import _ from 'lodash'
const iconMiniData = [
  { url: 'icon-tab-big-1', text: '公共场所上网审计', type: 'device_audit_type' },
  { url: 'icon-tab-big-3', text: '室外WIFI探针', type: 'device_outdoor_probe_type' },
  { url: 'icon-tab-big-4', text: '室外侦码采集', type: 'device_outdoor_code_collect_type' },
  { url: 'icon-tab-big-5', text: '人脸识别摄像头', type: 'device_face_recognition_type' },
  { url: 'icon-tab-big-6', text: '人脸门禁', type: 'device_face_entrance_guard_type' },
  { url: 'icon-tab-big-7', text: '车牌识别摄像头', type: 'device_car_discern_type' },
  { url: 'icon-tab-big-8', text: '身份证阅读器', type: 'device_id_card_reader_type' },
  { url: 'icon-tab-big-9', text: '其他', type: 'device_other_type' }
]

export default {
  name: 'EchartsPage',
  components: {
    CusScreenBox,
    CusLitterBox
  },

  data () {
    return {
      chart0: null,
      chart1: null,
      chart2: null,
      iconMiniData: iconMiniData
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.getAuditData()
      this.getFaceData()
      this.getProbeData()
      this.getDeviceStatistics()

      // 加载调整自适应布局
      this.chart0 && this.chart1 && this.chart2 && this.chartResize()
    })
  },
  methods: {
    clickOut () {
      this.$emit('handleHidden')
    },

    getDeviceStatistics () {
      getDeviceTypeStatistics().then(res => {
        this.iconMiniData = this.iconMiniData.map(_c => {
          _c.value = res.find(ele => ele.deviceType === _c.type)?.deviceAllTotal ?? 0
          return _c
        })
      })
    },

    // 审计数据
    getAuditData () {
      getAudit().then(res => {
        if (!res) return
        const rows = MockData.objectToArray(res.result)
        this.initAuditData(rows)
      })
    },
    initAuditData (list) {
      this.chart0 = new Xcharts('chart0', 'line', {
        series: [
          {
            stack: '数量（单位：条）',
            areaStyle: {
              normal: {
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: 'rgba(47, 137, 207, .2)' },
                  { offset: 1, color: 'rgba(47, 137, 207, 1)' }
                ])
                /* eslint-enable */
              }
            }
          }
        ]
      }).setData({
        legendData: ['数量（单位：条）'],
        columns: MockData.getDayHours(),
        rows: list
      })
    },

    // 人脸数据
    getFaceData () {
      getFace().then(res => {
        if (!res) return
        const rows = MockData.objectToArray(res.result)
        this.initFaceData(rows)
      })
    },
    initFaceData (list) {
      this.chart1 = new Xcharts('chart1', 'bar', {
        series: [
          {
            barWidth: 18,
            itemStyle: {
              normal: {
                barBorderRadius: 4,
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: 'rgba(0, 216, 135, 1)' },
                  { offset: 1, color: 'rgba(0, 216, 135, .7)' }
                ])
                /* eslint-enable */
              }
            }
          }
        ]
      }).setData({
        legendData: ['数量（单位：条）'],
        columns: MockData.getDayHours(),
        rows: list
      })
    },

    // 探针数据
    getProbeData () {
      getProbe().then(res => {
        if (!res) return
        const rows = MockData.objectToArray(res.result)
        this.initProbeData(rows)
      })
    },
    initProbeData (list) {
      this.chart2 = new Xcharts('chart2', 'line', {
        series: [
          {
            stack: '数量（单位：条）',
            areaStyle: {
              normal: {
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: 'rgba(47, 137, 207, .2)' },
                  { offset: 1, color: 'rgba(47, 137, 207, 1)' }
                ])
                /* eslint-enable */
              }
            }
          }
        ]
      }).setData({
        legendData: ['数量（单位：条）'],
        columns: MockData.getDayHours(),
        rows: list
      })
    },

    chartResize () {
      this.handlerResize = _.debounce(() => {
        this.chart0.chart && this.chart0.chart.resize()
        this.chart1.chart && this.chart1.chart.resize()
        this.chart2.chart && this.chart2.chart.resize()
      })
      window.addEventListener('resize', this.handlerResize)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.handlerResize)
        this.chart0.chart && this.chart0.chart.dispose()
        this.chart1.chart && this.chart1.chart.dispose()
        this.chart2.chart && this.chart2.chart.dispose()
      })
    }
  }
}
</script>

<style lang="less" scoped >
.EchartsPage {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 6px;
  z-index: 98;
  box-sizing: border-box;
  overflow: hidden;
  & > div {
    float: left;
    &.EchartsPage-box {
      padding: 12px;
      width: 550px;
      height: 100%;
      background: linear-gradient(
        40deg,
        rgba(22, 30, 49, 0) 0%,
        rgba(22, 30, 49, 0.5) 12%,
        #161e31 80%
      );
      box-sizing: border-box;
    }
    &.left {
      margin-left: -100%;
    }
    &.right {
      margin-left: -550px;
    }
    &.middle {
      width: 100%;
      height: 100%;
      background-color: rgba(22, 30, 49, 0);
      .content {
        width: 100%;
        height: 100%;
        margin-left: 550px;
        margin-right: 550px;
        content: '';
      }
    }
    .EchartsPage-ul {
      .EchartsPage-li {
        margin-bottom: 16px;
        .deviceStatistics {
          display: flex;
          flex-wrap: wrap;
          height: 13rem;
          overflow: auto;
          padding: 10px 0;
          .deviceStatistics-li {
            width: 155px;
            height: 120px;
            margin-right: 14px;
            margin-bottom: 16px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
