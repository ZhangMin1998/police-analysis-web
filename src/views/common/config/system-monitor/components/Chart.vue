<template>
  <div
    class="total-chart-wrap"
    v-p-loading="loading"
    :element-loading-background="'--loading-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">{{ wrapTitle }}</div>
    <div class="time_select" v-if="activeSort !== 'day'">
      <!-- <el-time-picker
        is-range
        v-model="selectTime"
        @change="timeChange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
      >
      </el-time-picker> -->
      <el-date-picker
       v-model="selectTime"
       @change="timeChange"
       type="datetimerange"
       value-format="timestamp"
       range-separator="至"
       start-placeholder="开始日期"
       end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="sort-screen" v-if="haveOpt">
      <div
        :class="['common-style', 'second', { no_active: activeSort !== 'second' }]"
        @click="changeSort('second')"
      >
        秒
      </div>
      <div
        :class="['common-style', 'minute', { no_active: activeSort !== 'minute' }]"
        @click="changeSort('minute')"
      >
        分
      </div>
      <div
        :class="['common-style', 'hour', { no_active: activeSort !== 'hour' }]"
        @click="changeSort('hour')"
      >
        时
      </div>
      <div
        :class="['common-style', 'day', { no_active: activeSort !== 'day' }]"
        @click="changeSort('day')"
      >
        天
      </div>
    </div>
    <!-- <div id='TotalDataChartLine' ref="TotalDataChartLine" class='chart-wrap'></div> -->
    <div id="TotalDataChartLine" ref="TotalDataChartLine" :style="{ height, width }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {
  // getBrokenDataApi,
  getRecordTotal
} from '@/api/dataCenter'
import { getChartsList, getQueueChartsList, getTimeStamp } from '@/api/config'
import { lightTheme, darkTheme } from '@/assets/js/variable'
import { mapState } from 'vuex'
export default {
  name: 'TotalDataChartLine',
  props: {
    // 组件标题
    wrapTitle: {
      type: String,
      default: '数据统计'
    },
    dataType: {
      type: String,
      default: ''
    },
    // smooth: {
    //   type: Boolean,
    //   default: true
    // },
    haveOpt: {
      type: Boolean,
      default: true
    },
    isShowToday: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '506px'
    },
    width: {
      type: String,
      default: '1806px'
    },
    isPython: {
      type: Boolean,
      default: false
    },
    contorlRequsetUrl: {
      type: String
    },
    dataStageList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme',
      statStage: 'statStage'
    })
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // 更改颜色
        this.chartOption.tooltip.backgroundColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.chartOption.tooltip.textStyle.color = colorObj['--base-text-color-to-666666']
        // this.chartOption.legend.textStyle.color = colorObj['--base-text-color-to-666666']
        // this.chartOption.backgroundColor = colorObj['--bg-color-2']
        this.chartOption.xAxis.axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis.axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis.nameTextStyle.color = colorObj['--base-text-color-to-666666']
        if (this.myChart) {
          this.myChart.setOption(this.chartOption, true)
        }
      },
      immediate: true
    }
    /*dataType: {
      handler (newVal) {
        if (newVal) {
          this.$emit('changeChartLineLoad', true)
          this.activeSort = 'day'
          this.getTotalData()
        }
      },
      immediate: true
    }*/
  },
  data () {
    return {
      myChart: null,
      chartOption: {
        tooltip: {
          trigger: 'axis',
          borderColor: '#262D44',
          backgroundColor: '#262D44',
          textStyle: {
            color: '#8799BF',
            fontSize: 14
          },
          valueFormatter: value => {
            let changeNum = value + ''
            let unit = '条'
            if (changeNum.length >= 9) {
              changeNum = (value / 100000000).toFixed(2)
              unit = '亿条'
            } else if (changeNum.length >= 5) {
              changeNum = (value / 10000).toFixed(2)
              unit = '万条'
            }
            return changeNum + unit
          }
        },
        legend: {
          textStyle: {
            color: '#8799BF'
          }
        },
        grid: {
          left: '48',
          right: '48',
          bottom: '24',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // interval: 0,
          // splitNumber: 5,
          axisLabel: {
            color: '#8799BF',
            fontSize: 16,
            padding: [12, 0, 0, 0]
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(101,116,148,.45)'
            }
          }
        },
        yAxis: {
          name: '条',
          type: 'value',
          // max: 'dataMax',
          nameLocation: 'end',
          splitNumber: 11,
          nameTextStyle: {
            color: '#8799BF',
            fontSize: 16,
            padding: [0, 36, 10, 0]
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(101,116,148,.45)',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#8799BF',
            fontSize: 16,
            formatter: value => {
              return value
            }
          }
        },
        dataZoom: {
          type: 'inside'
        },
        series: [
          {
            type: 'line',
            lineStyle: {
              width: 1,
              type: 'solid',
              color: '#64EAFC'
            },
            itemStyle: {
              color: '#64EAFC'
            },
            areaStyle: {
              color: 'rgba(0,209,255, .04)'
            },
            smooth: true
          }
        ]
      },
      activeSort: 'day',
      xAxisList: [],
      seriesList: [],
      nowTime: null,
      rollNum: 0,
      loading: false,
      series: [],
      resultObj: {},
      chartData: [],
      selectTime: []
    }
  },
  mounted () {
    console.log(new Date(2016, 9, 10, 8, 40))
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1440) {
      this.chartOption.xAxis.axisLabel.fontSize = 12
      this.chartOption.yAxis.axisLabel.fontSize = 12
      this.chartOption.yAxis.nameTextStyle.fontSize = 12
      this.chartOption.grid.bottom = '18'
      this.chartOption.grid.right = '42'
      this.chartOption.grid.left = '42'
    } else if (htmlClientWidth > 1440 && htmlClientWidth <= 1560) {
      this.chartOption.xAxis.axisLabel.fontSize = 13
      this.chartOption.yAxis.axisLabel.fontSize = 13
      this.chartOption.yAxis.nameTextStyle.fontSize = 13
      this.chartOption.grid.bottom = '18'
      this.chartOption.grid.right = '42'
      this.chartOption.grid.left = '42'
    } else if (htmlClientWidth > 1560 && htmlClientWidth <= 1680) {
      this.chartOption.xAxis.axisLabel.fontSize = 14
      this.chartOption.yAxis.axisLabel.fontSize = 14
      this.chartOption.yAxis.nameTextStyle.fontSize = 14
      this.chartOption.grid.bottom = '24'
      this.chartOption.grid.right = '42'
      this.chartOption.grid.left = '42'
    } else if (htmlClientWidth > 1680 && htmlClientWidth <= 1800) {
      this.chartOption.xAxis.axisLabel.fontSize = 15
      this.chartOption.yAxis.axisLabel.fontSize = 15
      this.chartOption.yAxis.nameTextStyle.fontSize = 15
      this.chartOption.grid.bottom = '24'
      this.chartOption.grid.right = '48'
      this.chartOption.grid.left = '48'
    }
    this.$emit('changeChartLineLoad', true)
    this.activeSort = 'day'
    // this.nowTime = new Date().getTime()
    // console.log( 'nowTime' ,this.nowTime)
    getTimeStamp().then(res => {
      this.nowTime = res
      this.drawChart(true)
    })
  },
  methods: {
    // 切换显示数据的区间
    changeSort (type) {
      this.loading = true
      this.activeSort = type
      this.resetData()
      // this.drawChart(true)
    },
    resetData () {
      this.myChart ? this.myChart.off('dataZoom') : null
      this.myChart = null
      // this.nowTime = new Date().getTime()
      this.xAxisList = []
      this.series = []
      this.chartData = []
      this.resultObj = {}
      this.rollNum = 0
      getTimeStamp().then(res => {
        // console.log(res)
        this.nowTime = res
        this.drawChart(true)
      })
    },
    formatterYData (list) {
      // 判断是否有大于一亿的数据
      let isVeryBig = list.some(value => {
        // return value >= 100000000
        return value.some(ele => ele >= 100000000)
      })
      let isGreaterMyriad = list.some(value => {
        // return value >= 10000
        return value.some(ele => ele >= 10000)
      })
      if (isVeryBig) {
        this.chartOption.yAxis.name = '亿条'
        delete this.chartOption.yAxis.minInterval
        delete this.chartOption.yAxis.max
        this.chartOption.yAxis.axisLabel.formatter = value => {
          if (value <= 1) {
            return value
          } else {
            return value / 100000000
          }
        }
      } else if (isGreaterMyriad) {
        this.chartOption.yAxis.name = '万条'
        delete this.chartOption.yAxis.minInterval
        delete this.chartOption.yAxis.max
        this.chartOption.yAxis.axisLabel.formatter = value => {
          if (value <= 1) {
            return value
          } else {
            return value / 10000
          }
        }
      } else {
        this.chartOption.yAxis.name = '条'
        this.chartOption.yAxis.minInterval = 1
        this.chartOption.yAxis.nameTextStyle.padding = [0, 30, 10, 0]
        this.chartOption.yAxis.max = value => {
          if (value.max < 10) {
            return 10
          }
        }
        this.chartOption.yAxis.axisLabel.formatter = value => {
          return value
        }
      }
    },
    timeChange (time) {
      const resPromise = this.getData(time[0], time[1])
      this.xAxisList = []
      this.series = []
      this.chartData = []
      this.resultObj = {}
      resPromise.then(item => {
        console.log(item);
        // res.forEach(item => {
        for (let key in item) {
          let value = item[key] || []
          let resultValue = []
          value.forEach(v => {
            resultValue.unshift(v.value)
            this.xAxisList.unshift(v.dateTime)
            this.xAxisList = [...new Set(this.xAxisList)]
          })
          if (this.resultObj[key]) {
            this.resultObj[key] = [...resultValue, ...this.resultObj[key]]
          } else {
            this.resultObj[key] = resultValue
          }
        }
        this.chartData = Object.values(this.resultObj)
        for (let key in this.resultObj) {
          this.series.push({
            name: key,
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: this.resultObj[key],
            smooth: true
          })
        }
        let { xAxis, series, dataZoom } = this.myChart.getOption()
        series = this.series
        xAxis[0].data = this.xAxisList
        // dataZoom[0].startValue = result.length - 1
        // dataZoom[0].endValue = this.seriesList.length - 1
        dataZoom[0].startValue = 0
        dataZoom[0].endValue = this.chartData[0].length - 1
        delete dataZoom[0].start
        delete dataZoom[0].end
        const option = { ...this.myChart.getOption(), xAxis, series, dataZoom }
        this.myChart.setOption(option,true)
      })
    },
    getData (startTime, endTime, needAdd = false) {
      return new Promise(resolve => {
        if (!this.isPython) {
          getRecordTotal({
            dataType: this.dataType,
            unit: this.activeSort,
            startTime: startTime,
            endTime: endTime,
            dataStage: this.statStage
          })
            .then(res => {
              let result = res || []
              if (needAdd) {
                this.rollNum += 1
              }
              resolve(result.reverse())
            })
            .catch(() => {
              this.loading = false
              this.$emit('changeChartLineLoad', false)
            })
        } else {
          let requestUrl = this.contorlRequsetUrl ? getQueueChartsList : getChartsList
          requestUrl({
            data_type: this.dataType,
            unit: this.activeSort,
            start_time: startTime,
            end_time: endTime,
            data_stage: this.dataStageList
          })
            .then(res => {
              let result = res || {}
              for (let key in result) {
                result[key] = result[key].reverse()
              }
              if (needAdd) {
                this.rollNum += 1
              }
              resolve(result || {})
              // let result = res || []
              // if (needAdd) {
              //   this.rollNum += 1
              // }
              // resolve(result.reverse())
            })
            .catch(() => {
              this.loading = false
              this.$emit('changeChartLineLoad', false)
            })
        }
      })
    },
    drawChart (isMount = false) {
      let promiseList = []
      if (isMount && this.activeSort === 'day') {
        for (let i = this.rollNum; i < 2; i++) {
          if (i > 0) {
            promiseList.push(
              this.getData(
                this.nowTime - (i + 1) * 31 * 24 * 60 * 60 * 1000,
                this.nowTime - i * 31 * 24 * 60 * 60 * 1000
              )
            )
          } else {
            promiseList.push(
              this.getData(this.nowTime - (i + 1) * 31 * 24 * 60 * 60 * 1000, this.nowTime)
            )
          }
          this.rollNum += 1
        }
      } else {
        // 是否一次性加载，加载的总时间跨度
        if (this.activeSort === 'day') {
          console.log(this.rollNum)
          if (this.rollNum < 11) {
            promiseList.push(
              this.getData(
                this.nowTime - (this.rollNum + 1) * 31 * 24 * 60 * 60 * 1000,
                this.nowTime - this.rollNum * 31 * 24 * 60 * 60 * 1000,
                true
              )
            )
          } else {
            promiseList.push(
              this.getData(
                this.nowTime - 365 * 24 * 60 * 60 * 1000,
                this.nowTime - this.rollNum * 31 * 24 * 60 * 60 * 1000,
                true
              )
            )
          }
        } else if (this.activeSort === 'hour') {
          promiseList.push(this.getData(this.nowTime - 48 * 60 * 60 * 1000, this.nowTime))
          this.selectTime = [
            this.nowTime -  12 * 60 * 60 * 1000,
            this.nowTime
          ]
        } else if (this.activeSort === 'minute') {
          // promiseList.push(this.getData(this.nowTime - 1 * 60 * 60 * 1000, this.nowTime))
          // 每次加载一个钟
          if (this.rollNum <= 23) {
            promiseList.push(
              this.getData(
                this.nowTime - (this.rollNum + 1) * 2 * 60 * 60 * 1000,
                this.nowTime - this.rollNum * 2 * 60 * 60 * 1000,
                true
              )
            )
          }
          this.selectTime = [
            this.nowTime -  60 * 60 * 1000,
            this.nowTime
          ]
        } else if (this.activeSort === 'second') {
          // 每次加载6分钟
          if (this.rollNum <= 39) {
            promiseList.push(
              this.getData(
                this.nowTime - (this.rollNum + 1) * 60 * 60 * 0.05 * 1000,
                this.nowTime - this.rollNum * 60 * 60 * 0.05 * 1000,
                true
              )
            )
            this.selectTime = [
              this.nowTime - 60*1000,
              this.nowTime
            ]
          }
        }
      }
      Promise.all(promiseList.map(item => item.catch(() => []))).then(res => {
        let oldLength = this.chartData.length ? this.chartData[0].length : 0
        res.forEach(item => {
          for (let key in item) {
            let value = item[key] || []
            let resultValue = []
            value.forEach(v => {
              resultValue.unshift(v.value)
              this.xAxisList.unshift(v.dateTime)
              this.xAxisList = [...new Set(this.xAxisList)]
            })
            if (this.resultObj[key]) {
              this.resultObj[key] = [...resultValue, ...this.resultObj[key]]
            } else {
              this.resultObj[key] = resultValue
            }
          }
        })
        this.chartData = Object.values(this.resultObj)
        if (!this.chartData.length) {
          this.loading = false
          this.$emit('changeStackLineLoad', false)
          return
        }
        this.series = []
        for (let key in this.resultObj) {
          this.series.push({
            name: key,
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: this.resultObj[key],
            smooth: true
          })
        }

        if (isMount) {
          let chartDom = this.$refs.TotalDataChartLine
          if (!chartDom) return
          this.myChart = echarts.init(chartDom)
          this.$set(this.chartOption.xAxis, 'data', this.xAxisList)
          // this.$set(this.chartOption.series[0], 'data', this.seriesList)
          this.chartOption.series = this.series
          // 默认显示的天数、小时数、分钟数、秒数
          if (this.activeSort === 'day') {
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 15
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          } else if (this.activeSort === 'hour') {
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 12
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          } else if (this.activeSort === 'minute') {
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 60
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          } else if (this.activeSort === 'second') {
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 60
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          }
          // this.formatterYData(this.seriesList.slice(this.chartOption.dataZoom.startValue, this.chartOption.dataZoom.endValue + 1))
          let showValue = this.chartData.map(item => {
            return item.slice(
              this.chartOption.dataZoom.startValue,
              this.chartOption.dataZoom.endValue + 1
            )
          })
          this.formatterYData(showValue)
          this.myChart.setOption(this.chartOption, true)

          // 缩放区域，对展示区域数据进行处理
          this.myChart.on('dataZoom', params => {
            let chart = this.myChart.getOption()
            let chartDataZoom = chart.dataZoom[0]
            let showValue = chart.series.map(item => {
              return item.data.slice(chartDataZoom.startValue, chartDataZoom.endValue + 1)
            })
            /*this.chartOption.dataZoom.startValue = chartDataZoom.startValue
            this.chartOption.dataZoom.endValue = chartDataZoom.endValue*/
            // // 判断是否有大于一亿的数据
            this.formatterYData(showValue)
            this.myChart.setOption(
              { ...chart, chartDataZoom },
              {
                replaceMerge: ['yAxis']
              }
            )
            if (
              this.activeSort === 'day' &&
              this.rollNum >= 0 &&
              this.rollNum <= 11 &&
              params.batch[0].start === 0 &&
              params.batch[0].end === 100
            ) {
              // this.loading = true
              this.drawChart()
            }
            if (
              this.activeSort === 'minute' &&
              this.rollNum >= 0 &&
              this.rollNum <= 23 &&
              params.batch[0].start === 0 &&
              params.batch[0].end === 100
            ) {
              // this.loading = true
              this.drawChart()
            }
            // console.log(params)
            if (
              this.activeSort === 'second' &&
              this.rollNum >= 0 &&
              this.rollNum <= 39 &&
              params.batch[0].start === 0 &&
              params.batch[0].end === 100
            ) {
              // this.loading = true
              this.drawChart()
            }
          })
        } else {
          let { xAxis, series, dataZoom } = this.myChart.getOption()
          series = this.series
          xAxis[0].data = this.xAxisList
          // dataZoom[0].startValue = result.length - 1
          // dataZoom[0].endValue = this.seriesList.length - 1
          dataZoom[0].startValue = this.chartData[0].length - oldLength - 1
          dataZoom[0].endValue = this.chartData[0].length - 1
          delete dataZoom[0].start
          delete dataZoom[0].end
          const option = { ...this.myChart.getOption(), xAxis, series, dataZoom }
          this.myChart.setOption(option)
        }
        this.loading = false
        this.$emit('changeChartLineLoad', false)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.total-chart-wrap {
  overflow: auto;
  position: relative;
  background: var(--bg-color-2);
  min-height: 60px;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: var(--base-text-color-to-999999);
    padding: 16px 16px 24px;
  }
  .time_select {
    width: 410px;
    position: absolute;
    top: 25px;
    right: 250px;
    box-sizing: border-box;
  }

  .sort-screen {
    position: absolute;
    top: 30px;
    right: 24px;
    display: flex;
    z-index: 2;
    box-sizing: border-box;

    .common-style {
      display: flex;
      justify-content: center;
      width: 44px;
      height: 28px;
      font-size: 16px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;

      background: var(--active-color);
      color: @font-color-3;
      border: 1px solid var(--active-color);

      &.no_active {
        background: transparent;
        color: var(--base-text-color-1);
        border: 1px solid var(--border-color-2);

        &:hover {
          border-color: var(--active-color);
          color: var(--active-color);
        }

        //border: 1px solid #177DDC;
      }
    }

    .hour {
      border-radius: 2px 0 0 2px;
    }

    .day {
      border-radius: 0 2px 2px 0;
    }
  }

  .chart-wrap {
    width: 1806px;
    height: 506px;
  }
}
@media screen and (min-width: 1024px) and (max-width:1365px){
  .total-chart-wrap{
    overflow: hidden;
  }
}
</style>
