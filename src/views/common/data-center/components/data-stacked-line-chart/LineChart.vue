<template>
  <div class="card">
    <div class="title-box">
      <div class='title'>{{ wrapTitle }}</div>
      <div v-if="haveSet">
        <i class="el-icon-s-tools" style="cursor:pointer;" @click="showSetting" :title='"设置"'></i>
      </div>
    </div>
    <div class='time-box'>
      <div :class='["common-style", "hour", {"no_active": activeSort !== "hour"}]' @click='changeSort("hour")'>时</div>
      <div :class='["common-style", "day", {"no_active": activeSort !== "day"}]' @click='changeSort("day")'>天</div>
    </div>
    <div id='LineChart' ref="LineChart" class='chart-wrap'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'
export default {
  name: 'LineChart',
  props: {
    // 组件标题
    wrapTitle: {
      type: String,
      default: ''
    },
    haveSet: {
      type: Boolean,
      default: false
    },
    defaultLegend: {
      type: Array,
      default: () => []
    },
    series: {
      type: Array,
      default: () => []
    },
    color: {
      type: Array,
      default: () => []
    },
    xAxisData: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
  },
  watch: {
    xAxisData: {
      handler (val) {
        // 'if (!val || val.length === 0) return'
        this.chartOption.xAxis[0].data = []
        this.$set(this.chartOption.xAxis[0], 'data', val)
      },
      deep: true,
      immediate: true
    },
    chartData: {
      handler (val) {
        // console.log(val)
        if (!Object.keys(val).length) return
        if (this.activeSort === 'day') {
          this.chartOption.dataZoom.startValue = val.data[0].length - 15
          this.chartOption.dataZoom.endValue = val.data[0].length - 1
        } else if (this.activeSort === 'hour') {
          this.chartOption.dataZoom.startValue = val.data[0].length - 12
          this.chartOption.dataZoom.endValue = val.data[0].length - 1
        }
        this.initialChart()
      },
      deep: true,
      immediate: true
    },
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // 更改颜色
        this.chartOption.tooltip.backgroundColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.chartOption.tooltip.borderColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.chartOption.tooltip.textStyle.color = colorObj['--base-text-color-to-666666']
        this.chartOption.legend.textStyle.color = colorObj['--base-text-color-to-666666']
        this.chartOption.backgroundColor = colorObj['--bg-color-2']
        this.chartOption.xAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis[0].nameTextStyle.color = colorObj['--base-text-color-to-666666']
        if (this.myChart) {
          this.myChart.setOption(this.chartOption, true)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      activeSort: 'day',
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
          valueFormatter: (value) => {
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
        backgroundColor: "#192035",
        legend: {
          textStyle:{
            color:'#8799BF'
          }
        },
        dataZoom: {
          type: "inside"
        },
        grid: {
          left: '48',
          right: '48',
          bottom: '24',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: null,
            // interval: 2,
            // splitNumber: 10,
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
            // data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '万条',
            // max: 'dataMax',
            nameLocation: 'end',
            splitNumber: 11,
            nameTextStyle: {
              color: '#8799BF',
              fontSize: 16,
              padding: [0, 36, 10, 0]
            },
            axisLabel: {
              color: '#8799BF',
              fontSize: 16,
              formatter: (value) => {
                if (value <= 1) {
                  return value
                } else {
                  return (value / 10000).toFixed(2)
                }
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(101,116,148,.45)',
                type: 'dashed'
              }
            }
          }
        ],
        series: []
      }
    }
  },
  created () {
    // console.log(this.chartData)
  },
  mounted () {

  },
  methods: {
    showSetting () {
      this.$emit('showSetting')
    },
    changeSort (item) {
      this.activeSort = item
      this.$emit('changeSort', item)
    },
    initialChart () {
      // console.log(this.chartData)
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      let chartDom = this.$refs.LineChart
      this.myChart = echarts.init(chartDom, 'dark')
      this.chartOption.color = this.color
      this.chartOption.series = []
      this.chartOption.series = this.series

      let showValue = this.chartData.data.map(item => {
        return item.slice(this.chartOption.dataZoom.startValue, this.chartOption.dataZoom.endValue + 1)
      })
      this.formatterYData(showValue)
      this.myChart.setOption(this.chartOption, true)

      // 缩放区域，对展示区域数据进行处理
      this.myChart.on('dataZoom', () => {
        let chart = this.myChart.getOption()
        let chartDataZoom = chart.dataZoom[0]
        let showValue = chart.series.map(item => {
          return item.data.slice(chartDataZoom.startValue, chartDataZoom.endValue + 1)
        })
        this.chartOption.dataZoom.startValue = chartDataZoom.startValue
        this.chartOption.dataZoom.endValue = chartDataZoom.endValue
        // // 判断是否有大于一亿的数据
        this.formatterYData(showValue)
        this.myChart.setOption(this.chartOption, {
          replaceMerge: ['yAxis']
        })
      })
    },
    formatterYData (list) {
      // 判断是否有大于一亿的数据
      let findValueArray1 = list.map(item => {
        return item.some(value => {
          return value >= 100000000
        })
      })
      let isVeryBig = findValueArray1.some(item => {
        return item
      })

      // 判断是否有大于一万的数据
      let findValueArray2 = list.map(item => {
        return item.some(value => {
          return value >= 10000
        })
      })
      let isBig = findValueArray2.some(item => {
        return item
      })

      if (isVeryBig) {
        this.chartOption.yAxis[0].name = '亿条'
        delete this.chartOption.yAxis[0].minInterval
        delete this.chartOption.yAxis[0].max
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          if (value <= 1) {
            return value
          } else {
            return (value / 100000000)
          }
        }
      } else if (isBig) {
        this.chartOption.yAxis[0].name = '万条'
        delete this.chartOption.yAxis[0].minInterval
        delete this.chartOption.yAxis[0].max
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          if (value <= 1) {
            return value
          } else {
            return (value / 10000)
          }
        }
      } else {
        this.chartOption.yAxis[0].name = '条'
        this.chartOption.yAxis[0].minInterval = 1
        this.chartOption.yAxis[0].nameTextStyle.padding = [0, 30, 10, 0]
        this.chartOption.yAxis[0].max = (value) => {
          if (value.max < 10) {
            return 10
          }
        }
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          return value
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.card{
  overflow: auto;
  min-height: 100px;
  position: relative;
  margin-bottom: 24px;
  background: var(--bg-color-2);
  .title-box{
    margin: 16px 16px 6px 16px;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: var(--base-text-color-to-999999);
      margin-bottom: 20px;
    }
  }
  .time-box {
    position: absolute;
    z-index: 99;
    top: 48px;
    right: 24px;
    display: flex;
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
    height: 506px;
  }
}
</style>
