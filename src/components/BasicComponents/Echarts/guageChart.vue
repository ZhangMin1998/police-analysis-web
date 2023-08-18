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
      default: 'GuageChart'
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
            name: '',
            type: 'gauge',
            center: ['50%', '60%'],
            max: 100,
            progress: {
              show: true
            },
            axisLabel: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}'
            },
            title: {
              show: false
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
        this.chartChange()
        this.myChart.setOption(this.chartOption, true)
      },
      deep: true
      // immediate: true
    }
  },
  mounted () {
    this.chartChange()

    this.initialChart()
  },
  methods:{
    chartChange () {
      this.chartOption.title.text = this.chartStyle.titleStyle.text
      this.chartOption.title.show = this.chartStyle.titleStyle.show
      this.chartOption.legend.show = this.chartStyle.legendStyle.show

      if (!this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].center = ['50%', '50%']
      } else if (!this.chartOption.title.show && this.chartOption.legend.show) {
        this.chartOption.legend.top = '2%'
        this.chartOption.series[0].center = ['50%', '50%']
      } else if (this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].center = ['50%', '50%']
      }

      this.chartOption.series[0].axisLabel.show = this.chartStyle.seriesStyle.axisLabel.show
      this.chartOption.series[0].name = this.chartStyle.seriesStyle.name
      this.chartOption.series[0].min =  this.chartStyle.seriesStyle.min || 0
      this.chartOption.series[0].max =  this.chartStyle.seriesStyle.max || 100

      this.chartOption.series[0].data = this.chartStyle.chartData || []

      // this.myChart.setOption(this.chartOption, true)
    },
    initialChart () {
      let chartDom = document.getElementById(this.chartId)

      if (this.theme === 'dark') {
        this.myChart = echarts.init(chartDom, this.chartStyle.darkLightMode)
      } else {
        this.myChart = echarts.init(chartDom)
      }

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
