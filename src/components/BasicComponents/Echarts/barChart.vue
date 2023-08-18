<template>
  <div class="chart">
    <div :id='chartId' ref="BarChart" class='BarChart'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'

export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    chartStyle: {
      type: Object,
      default: () => {}
    },
    chartId: {
      type: String,
      default: 'BarChart'
    }
  },
  data () {
    return {
      myChart: null,
      categoryObj: {
        type: 'category',
        // boundaryGap: false,
        // axisTick: {
        //   alignWithLabel: true
        // },
        axisLabel: {
          fontSize: this.chartStyle.xAxisStyle.fontSize,
          color: this.$themeColor(this.chartStyle.xAxisStyle.color) // 设置文字颜色
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(101,116,148,0.45)'
          }
        },
        min: null,
        max: null,
        data: null
      },
      valueObj: {
        type: 'value',
        name: '',
        position: this.chartStyle.yAxisStyle.position,
        axisLabel: {
          // textStyle: {
          fontSize: this.chartStyle.yAxisStyle.fontSize,
          color: this.$themeColor(this.chartStyle.yAxisStyle.color) // 设置文字颜色
          // }
        },
        splitLine: {
          lineStyle: {
            color: this.chartStyle.yAxisStyle.splitLineColor,
            type: this.chartStyle.yAxisStyle.splitLineType,
          }
        },
        min: null,
        max: 'dataMax'
      },
      chartOption: {
        // backgroundColor: this.$themeColor('--tooltip-bg-262D44-to-f6f8fd'),
        backgroundColor: this.$themeColor(this.chartStyle.backgroundColor),
        title: {
          show: true,
          text: '',
          textStyle: {
            fontSize: '12px',
            color: this.$themeColor(this.chartStyle.titleStyle.color)
          }
        },
        tooltip: {
          trigger: 'axis',
          // backgroundColor: '#262D44',
          backgroundColor: this.$themeColor(this.chartStyle.tooltipStyle.backgroundColor),
          borderWidth: 0,
          textStyle: {
            color: this.$themeColor(this.chartStyle.tooltipStyle.color),
            fontSize: this.chartStyle.tooltipStyle.fontSize
          },
        },
        legend: {
          show: true,
          top: this.chartStyle.legendStyle.top,
          type: this.chartStyle.legendStyle.type,
          textStyle: {
            color: this.$themeColor(this.chartStyle.legendStyle.color),
            fontSize: this.chartStyle.legendStyle.fontSize,
          },
          // data: ['English', 'Math'],
        },
        grid: {
          top: this.chartStyle.grid.top,
          left: this.chartStyle.grid.left,
          right: this.chartStyle.grid.right,
          bottom: this.chartStyle.grid.bottom,
          containLabel: true
        },
        dataZoom: {
          show: this.chartStyle.dataZoomStyle.show,
          type: this.chartStyle.dataZoomStyle.type
        },
        xAxis: null,
        yAxis: null,
        /*xAxis: {
          type: 'category',
          // boundaryGap: false,
          // axisTick: {
          //   alignWithLabel: true
          // },
          axisLabel: {
            fontSize: this.chartStyle.xAxisStyle.fontSize,
            color: this.$themeColor(this.chartStyle.xAxisStyle.color) // 设置文字颜色
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(101,116,148,0.45)'
            }
          },
          min: null,
          max: null,
          data: null
        },*/
        /*yAxis: {
          type: 'value',
          name: '',
          position: this.chartStyle.yAxisStyle.position,
          axisLabel: {
            // textStyle: {
            fontSize: this.chartStyle.yAxisStyle.fontSize,
            color: this.$themeColor(this.chartStyle.yAxisStyle.color) // 设置文字颜色
            // }
          },
          splitLine: {
            lineStyle: {
              color: this.chartStyle.yAxisStyle.splitLineColor,
              type: this.chartStyle.yAxisStyle.splitLineType,
            }
          },
          min: null,
          max: 'dataMax'
        },*/
        series: []
      }
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
  },
  watch: {
    chartStyle: {
      handler () {
        // console.log(newVal)
        this.chartChange()
        this.myChart.setOption(this.chartOption, true)
      },
      deep: true,
      // immediate: true
    }
  },
  mounted () {
    // console.log(this.option)
    this.chartChange()

    this.initialChart()
  },
  methods:{
    chartChange () {
      this.chartOption.title.text = this.chartStyle.titleStyle.text
      this.chartOption.title.show = this.chartStyle.titleStyle.show
      this.chartOption.legend.show = this.chartStyle.legendStyle.show

      if (!this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.grid.top = '3%'
      } else if (!this.chartOption.title.show && this.chartOption.legend.show) {
        this.chartOption.grid.top = '10%'
        this.chartOption.legend.top = '0%'
      } else if (this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.grid.top = '10%'
      }
      let categoryAxis = 'xAxis'
      let valueAxis = 'yAxis'
      let configCategory = 'xAxisStyle'
      let configValue = 'yAxisStyle'
      if (this.chartStyle.barDirection === 'crosswise') {
        this.chartOption.xAxis = this.valueObj
        this.chartOption.yAxis = this.categoryObj
        categoryAxis = 'yAxis'
        valueAxis = 'xAxis'
        configCategory = 'yAxisStyle'
        configValue = 'xAxisStyle'
      } else {
        this.chartOption.yAxis = this.valueObj
        this.chartOption.xAxis = this.categoryObj
      }

      this.chartOption[categoryAxis].min = this.chartStyle[configCategory].min
      this.chartOption[categoryAxis].max = this.chartStyle[configCategory].max
      this.chartOption[categoryAxis].data = this.chartStyle[configCategory].data

      this.chartOption[valueAxis].min = this.chartStyle[configValue].min
      this.chartOption[valueAxis].max = this.chartStyle[configValue].max

      this.chartOption.legend.pageIconColor = this.theme === 'dark' ? '#aaaaaa' : '#2f4554'
      this.chartOption.legend.pageIconInactiveColor = this.theme === 'dark' ? '#192035' : '#dee3ed'

      if (this.chartStyle.chartData.length) {
        this.chartOption.series = []
        this.chartStyle.chartData.forEach(item => {
          this.chartOption.series.push({
            name: item.name,
            data: item.data,
            type: 'bar',
            // barWidth: 6,
            smooth: false,
            markLine: null
          })
        })
      } else {
        this.chartOption.series = []
      }

      // 设置警戒值
      if (this.chartStyle.warningValue && this.chartOption.series.length) {
        this.chartOption.series[0].markLine = {
          symbol: "none",  // 是否去掉警戒线末尾的箭头
          data: [{
            [valueAxis]: this.chartStyle.warningValue,
            lineStyle: {
              color: 'red',
              width: 1
            },
            label: {
              position: 'start' // 警戒线标签的位置为终点处
            }
          }]
        }
        return
      } else if (this.chartOption.series.length) {
        this.chartOption.series[0].markLine = {
          symbol: "none",  // 是否去掉警戒线末尾的箭头
          data: [{
            [valueAxis]: '',
            lineStyle: {
              color: 'red',
              width: 1
            }
          }]
        }
      }

      // this.myChart.setOption(this.chartOption, true)
    },
    initialChart () {
      let chartDom = document.getElementById(this.chartId)

      this.myChart = echarts.init(chartDom, this.chartStyle.darkLightMode)
      this.myChart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="less" scoped>
// .chart{
//   .BarChart{
//     position: absolute;
//     right: 0;
//     height: 230px;
//     width: 320px;
//   }
// }
.chart {
  width: 100%;
  height: 100%;
  .BarChart {
    width: 100%;
    height: 100%;
  }
}
</style>
