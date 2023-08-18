<template>
  <div class="bg">
    <header class="BScreen_header">
      <h1>{{ this.$store.state.User.title }}</h1>
    </header>
    <div class="BScreen_main">
      <ul>
        <li class="BScreen_main_left">
          <CusScreenBox title="最近7天采集数据统计">
            <div id="chart0" :style="{ width: '28vw', height: '13rem' }"></div
          ></CusScreenBox>
          <CusScreenBox title="最近1天采集数据统计"
            ><div id="chart1" :style="{ width: '28vw', height: '13rem' }"></div
          ></CusScreenBox>
          <CusScreenBox title="历史数据总数">
            <div class="Total">{{ totalRecord || 0 }}<span class="fontSize1rem">条</span></div>
          </CusScreenBox>
        </li>
        <li class="BScreen_main_center">
          <div class="BScreen_main_center_bar">
            <div class="barbox">
              <ul class="clearfix flex">
                <li id="ke_bs_ins_rate" class="pulll_left counter">{{ MRecord || 0 }}</li>
                <li id="ke_bs_outs_rate" class="pulll_left counter">{{ HRecord || 0 }}</li>
              </ul>
            </div>
            <div class="barbox2">
              <ul class="clearfix barbox2-flex">
                <li id="ke_bs_ins_rate_name" class="barbox2_title">（条/分钟）</li>
                <li id="ke_bs_outs_rate_name" class="barbox2_title">（条/小时）</li>
              </ul>
            </div>
          </div>
          <div class="off-map map">
            <div>
              <img class="map2" src="@/assets/BScreen/jt.png" />
              <div class="device_map"><Map></Map></div>
            </div>
          </div>
        </li>
        <li class="BScreen_main_right">
          <CusScreenBox title="最近7天特征统计">
            <div id="chart2" :style="{ width: '28vw', height: '13rem' }"></div
          ></CusScreenBox>
          <CusScreenBox title="最近1天特征统计">
            <div id="chart3" :style="{ width: '28vw', height: '13rem' }"></div
          ></CusScreenBox>

          <CusScreenBox title="场所数据排行榜）">
            <ul class="top_list">
              <li
                class="top_list_item"
                :style="index < 3 ? style[index] : ''"
                v-for="(item, index) in PlaceList"
                :key="index + '_' + item.place_name"
              >
                <div>
                  <span class="top_list_item_index">{{ index + 1 }}.</span
                  ><span>{{ item.place_name }}</span>
                </div>
                <div>{{ item.count }}</div>
              </li>
            </ul>
          </CusScreenBox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CusScreenBox from '@/components/BasicComponents/CusScreenBox'
import Map from './Map'
import ChineseUnit from '@/utils/ChineseUnit'
import { Xcharts } from '@/utils/xcharts'
import { MockData } from '@/utils/xcharts/utils'
import _ from 'lodash'

import {
  queryTotalRecord,
  queryMinuteRecord,
  queryHourRecord,
  queryWeekData,
  queryDayData,
  queryDayAttrs,
  queryWeekAttrs,
  queryPlaceList
} from '@/api/bScreen'

export default {
  name: 'BScreen',
  components: {
    CusScreenBox,
    Map
  },
  data () {
    return {
      style: [{ color: '#cc3939' }, { color: '#de6b30' }, { color: '#cc984f' }],
      chart0: null,
      chart1: null,
      chart2: null,
      chart3: null,
      totalRecord: '', //总条数
      MRecord: '', //分 总条数
      HRecord: '', //时 总条数
      PlaceList: [],
      totalsTime: null
    }
  },
  created () {
    // 1. 获取历史数据总数
    this.getTotalRecord()
    // 2. 获取分钟数据总数
    this.getMinuteRecord()
    // 3. 获取小时数据总数
    this.getHourRecord()
    // 4. 获取一天数据总数
    this.getDayData()
    // 5. 获取一天属性总数
    this.getDayAttrs()
    // 6. 获取场所排行榜
    this.getPlaceList()
    // 7. 获取一星期数据
    this.getWeekData()
    // 8. 获取一星期属性数据
    this.getWeekAttrs()
  },
  mounted () {
    this.totalsTime = setInterval(() => {
      this.getTotalRecord()
    }, 10000)
    // 加载调整自适应布局
    this.chart0 && this.chart1 && this.chart2 && this.chart3 && this.chartResize()
  },
  beforeDestroy () {
    if (this.totalsTime) {
      clearInterval(this.totalsTime)
      this.totalsTime = null
    }
  },
  methods: {
    /**
     * 1. 获取历史数据总数
     */
    getTotalRecord () {
      queryTotalRecord().then(res => {
        this.totalRecord = parseFloat(res?.count ?? 0).toLocaleString()
      })
    },
    /**
     * 2. 获取分钟数据总数
     */
    getMinuteRecord () {
      queryMinuteRecord().then(res => {
        this.MRecord = ChineseUnit.addChineseUnit(res?.count_last_minute ?? 0)
      })
    },
    /**
     * 3. 获取小时数据总数
     */
    getHourRecord () {
      queryHourRecord().then(res => {
        this.HRecord = ChineseUnit.addChineseUnit(res?.count_last_hour ?? 0)
      })
    },
    /**
     * 4. 获取一天数据
     */
    getDayData () {
      queryDayData().then(res => {
        if (!res) return
        const rows = MockData.objectToArray(res.result)
        this.initDayData(rows)
      })
    },
    /**
     * 5. 获取一天属性
     */
    getDayAttrs () {
      queryDayAttrs().then(res => {
        if (!res) return
        this.initDayAttrs(MockData.objectToArray(res.result))
      })
    },
    /**
     * 6. 获取场所排行榜
     */
    getPlaceList () {
      queryPlaceList().then(res => {
        if (!res) return
        this.PlaceList = [...res]
      })
    },
    /**
     * 7. 获取一周数据
     */
    getWeekData () {
      queryWeekData().then(res => {
        if (!res) return
        this.initWeekData(MockData.objectToArray(res.result))
      })
    },
    /**
     * 8. 获取一周属性
     */
    getWeekAttrs () {
      queryWeekAttrs().then(res => {
        if (!res) return
        this.initWeekAttrs(MockData.objectToArray(res.result))
      })
    },

    /**
     * 最近1天数据统计
     */
    initDayData (list) {
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
        ],
        legend: {
          textStyle: {
            color: '#c0d0e7'
          }
        }
      }).setData({
        legendData: ['数量（单位：条）'],
        columns: MockData.getDayHours(),
        rows: list
      })
    },

    /**
     * 最近7天数据统计
     */
    initWeekData (list) {
      this.chart0 = new Xcharts('chart0', 'bar', {
        series: [
          {
            barWidth: 18,
            itemStyle: {
              normal: {
                barBorderRadius: 4,
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: 'rgba(47, 137, 207, 1)' },
                  { offset: 1, color: 'rgba(47, 137, 207, .7)' }
                ])
                /* eslint-enable */
              }
            }
          }
        ],
        legend: {
          textStyle: {
            color: '#c0d0e7'
          }
        }
      }).setData({
        legendData: ['数量（单位：条）'],
        columns: MockData.getBeforeDate(7, 'MM/DD'),
        rows: list
      })
    },

    /**
     * 最近7天属性统计
     */
    initWeekAttrs (list) {
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
        ],
        legend: {
          textStyle: {
            color: '#c0d0e7'
          }
        }
      }).setData({
        legendData: ['数量（单位：个）'],
        columns: MockData.getBeforeDate(7, 'MM/DD'),
        rows: list
      })
    },

    /**
     * 最近1天属性统计
     */
    initDayAttrs (list) {
      this.chart3 = new Xcharts('chart3', 'line', {
        series: [
          {
            lineStyle: {
              normal: {
                color: '#00d887'
              }
            },
            areaStyle: {
              stack: '数量（单位：条）',
              normal: {
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: 'rgba(0, 216, 135, .2)' },
                  { offset: 1, color: 'rgba(0, 216, 135, 1)' }
                ])
                /* eslint-enable */
              }
            },
            itemStyle: {
              normal: {
                color: '#00d887'
              }
            }
          }
        ],
        legend: {
          textStyle: {
            color: '#c0d0e7'
          }
        }
      }).setData({
        legendData: ['数量（单位：个）'],
        columns: MockData.getDayHours(),
        rows: list
      })
    },

    chartResize () {
      this.handlerResize = _.debounce(() => {
        this.chart0.chart && this.chart0.chart.resize()
        this.chart1.chart && this.chart1.chart.resize()
        this.chart2.chart && this.chart1.chart.resize()
        this.chart3.chart && this.chart1.chart.resize()
      })
      window.addEventListener('resize', this.handlerResize)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.handlerResize)
        this.chart0.chart && this.chart0.chart.dispose()
        this.chart1.chart && this.chart1.chart.dispose()
        this.chart2.chart && this.chart1.chart.dispose()
        this.chart3.chart && this.chart1.chart.dispose()
      })
    }
  }
}
</script>

<style lang="less" scoped >
.barbox2-flex {
  display: flex;
  > li {
    width: 50%;
    text-align: right;
    // padding-right:16px;
    box-sizing: border-box;
  }
}
.fontSize1rem {
  font-size: 1rem;
}
.BScreen_header {
  height: 3rem;
  background: url('~@/assets/BScreen/head_bg.png') no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  h1 {
    color: #fff;
    text-align: center;
    font-size: 2rem;
    line-height: 1rem;
  }
}
.flex {
  display: flex;
  justify-content: space-around;
}
.bg {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background: #000d4a url('/static/img/bg.jpg') center top;
  background-size: cover;
  color: #666;
  font-size: 1rem;
  .BScreen_main {
    & > ul {
      display: flex;
      justify-content: space-around;
    }
    .BScreen_main_left {
      width: 30vw;
      > div {
        height: 16.5rem;
        margin-bottom: 10px;
      }
    }

    .BScreen_main_center {
      width: 30vw;
      .BScreen_main_center_bar {
        background: rgba(101, 132, 226, 0.1);
        padding: 0.75rem;
        .barbox {
          border: 1px solid rgba(25, 186, 139, 0.17);
          position: relative;
          &:before {
            border-left: 2px solid #02a6b5;
            left: 0;
            border-top: 2px solid #02a6b5;
          }
          &:after {
            border-right: 2px solid #02a6b5;
            right: 0;
            bottom: 0;
            border-bottom: 2px solid #02a6b5;
          }
          &:before,
          &:after {
            position: absolute;
            width: 1.8rem;
            height: 0.6rem;
            content: '';
          }
          li {
            font-size: 3.2rem;
            color: #fff;
            padding: 0.3rem 0;
            font-family: electronicFont;
            font-weight: bold;
            width: 50%;
            text-align: center;
            position: relative;
            z-index: 100;
            &:first-child:before {
              position: absolute;
              content: '';
              height: 50%;
              width: 1px;
              background: rgba(255, 255, 255, 0.2);
              right: 0;
              top: 25%;
            }
          }
        }
      }
    }
    .BScreen_main_right {
      width: 30vw;
      > div {
        height: 16.5rem;
        margin-bottom: 10px;
      }
    }
  }
}
.pulll_left {
  float: left;
}
.off-map {
  padding-top: 24px;
  box-sizing: border-box;
}

.Total {
  width: 100%;
  line-height: 12rem;
  text-align: center;
  font-size: 3.8rem;
  color: #fff;
  font-weight: bold;
}

.barbox2_title {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  padding-top: 0.6rem;
  letter-spacing: 0.1rem;
}

.top_list {
  height: 12.5rem;
  padding: 0 0.65rem 0 1.3rem;
  margin-right: 7px;
  font-size: 1.1rem;
  overflow: auto;
  color: rgba(255, 255, 255, 0.7);
  .top_list_item {
    display: flex;
    justify-content: space-between;
    margin-top: 0.65rem;
    .top_list_item_index {
      margin-right: 8px;
    }
  }
}

@keyframes myfirst {
  0% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
  }

  100% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
  }
}

.map {
  position: relative;
  height: 72vh;
  width: 100%;
  z-index: 9;
  .device_map {
    z-index: 999;
  }
  .map2 {
    width: 100%;
    top: 4rem;
    left: 1.2rem;
    z-index: 0;
    opacity: 0.2;
    animation: myfirst 10s infinite linear;
    -webkit-animation: myfirst 10s infinite linear;
    -o-animation: rotate 10s infinite linear;
  }
  .map2 {
    position: absolute;
    opacity: 0.5;
  }
  img {
    border: none;
    max-width: 100%;
  }
}
</style>
