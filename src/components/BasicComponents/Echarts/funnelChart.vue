<template>
  <div class="chart">
    <div :id='chartId' ref="FunnelChart" class='FunnelChart'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'

export default {
  props: {
    chartStyle: {
      type: Object,
      default: () => {}
    },
    chartId: {
      type: String,
      default: 'FunnelChart'
    }
  },
  data () {
    return {
      myChart: null,
      chartOption: {
        backgroundColor: this.$themeColor(this.chartStyle.backgroundColor),
        title: {
          show: true,
          text: '',
          textStyle: {
            fontSize: this.chartStyle.titleStyle.fontSize,
            color: this.$themeColor(this.chartStyle.titleStyle.color)
          }
        },
        tooltip: {
          trigger: 'item',
          // backgroundColor: '#262D44',
          backgroundColor: this.$themeColor(this.chartStyle.tooltipStyle.backgroundColor),
          borderWidth: 0,
          textStyle: {
            color: this.$themeColor(this.chartStyle.tooltipStyle.color),
            fontSize: this.chartStyle.tooltipStyle.fontSize
          },
          formatter: '{b}: {c}'
        },
        legend: {
          show: true,
          top: this.chartStyle.legendStyle.top,
          type: this.chartStyle.legendStyle.type,
          textStyle: {
            color: this.$themeColor(this.chartStyle.legendStyle.color),
            fontSize: this.chartStyle.legendStyle.fontSize,
          }
        },
        series: [
          {
            // name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: 100,
            bottom: 20,
            width: '80%',
            min: null,
            max: null,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              textBorderColor: '#fff', // 不能为空
              textBorderWidth: 0,
              show: true,
              position: 'bottom' // inside outside left
            },
            labelLine: {
              length: 60,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderWidth: 0
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: []
          }
        ]
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
    this.chartChange()

    this.initialChart()
  },
  methods:{
    chartChange () {
      // console.log(this.chartStyle, this.chartOption)
      this.chartOption.title.text = this.chartStyle.titleStyle.text
      this.chartOption.title.show = this.chartStyle.titleStyle.show
      this.chartOption.legend.show = this.chartStyle.legendStyle.show

      if (!this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].top = 0
      } else if (!this.chartOption.title.show && this.chartOption.legend.show) {
        this.chartOption.legend.top = '3%'
        this.chartOption.series[0].top = 45
      } else if (this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].top = 40
      }

      this.chartOption.series[0].label.show = this.chartStyle.seriesStyle.labelShow
      this.chartOption.series[0].label.position = this.chartStyle.seriesStyle.labelPosition
      this.chartOption.series[0].min =  this.chartStyle.seriesStyle.min || null
      this.chartOption.series[0].max =  this.chartStyle.seriesStyle.max || null

      this.chartOption.legend.pageIconColor = this.theme === 'dark' ? '#aaaaaa' : '#2f4554'
      this.chartOption.legend.pageIconInactiveColor = this.theme === 'dark' ? '#192035' : '#dee3ed'

      this.chartOption.series[0].data = this.chartStyle.chartData || []

      // this.myChart.setOption(this.chartOption, true)
    },
    initialChart () {
      let chartDom = document.getElementById(this.chartId)

      this.myChart = echarts.init(chartDom)
      this.myChart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="less" scoped>
// .chart{
//   .FunnelChart{
//     position: absolute;
//     right: 0;
//     height: 230px;
//     width: 320px;
//   }
// }
.chart {
  width: 100%;
  height: 100%;
  .FunnelChart {
    width: 100%;
    height: 100%;
  }
}
</style>
