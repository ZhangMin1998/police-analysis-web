<template>
  <div class="chart">
    <div :id='chartId' ref="PieChart" class='PieChart'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'

export default {
  props: {
    // option: {
    //   type: Object,
    //   default: () => {}
    // },
    chartStyle: {
      type: Object,
      default: () => {}
    },
    chartId: {
      type: String,
      default: 'PieChart'
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
          backgroundColor: this.$themeColor(this.chartStyle.tooltipStyle.backgroundColor),
          borderWidth: 0,
          textStyle: {
            color: this.$themeColor(this.chartStyle.tooltipStyle.color),
            fontSize: this.chartStyle.tooltipStyle.fontSize,
            fontWeight: 'bold'
          },
          formatter: '{b}: {c}'
        },
        legend: {
          show: true,
          // orient: 'vertical',
          // left: 'left',
          top: this.chartStyle.legendStyle.top,
          type: this.chartStyle.legendStyle.type,
          textStyle: {
            color: this.$themeColor(this.chartStyle.legendStyle.color),
            fontSize: this.chartStyle.legendStyle.fontSize,
          },
          // pageTextStyle: {
          //   color: '#000', // 设置按钮的文本颜色
          // },
          // pageIconColor: this.theme === 'dark' ? '#aaaaaa' : 'pink', // 设置按钮的图标颜色
          // pageIconInactiveColor: 'rgba(42, 57, 76, 0.7)', // 设置非激活状态按钮的图标颜色
        },
        series: [
          {
            // name: 'Access From',
            type: 'pie',
            top: '15%',
            radius: '70%',
            // radius: ['40%', '70%'], // 环形
            roseType: 'radius', // 玫瑰
            data: [],
            label: {
              color: this.$themeColor(this.chartStyle.legendStyle.color),
              show: true,
              position: 'outside', // outside/inside/center
              formatter: '{b}'
            },
            itemStyle: {
              borderColor: this.$themeColor(this.chartStyle.backgroundColor),
              borderWidth: 0.5
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
        // this.chartOption.title.text = this.chartStyle.titleStyle.text
        // this.chartOption.title.show = this.chartStyle.titleStyle.show
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
      this.chartOption.title.text = this.chartStyle.titleStyle.text
      this.chartOption.title.show = this.chartStyle.titleStyle.show
      this.chartOption.legend.show = this.chartStyle.legendStyle.show
      this.chartOption.series[0].label.show = this.chartStyle.seriesStyle.labelShow
      this.chartOption.series[0].label.position = this.chartStyle.seriesStyle.labelPosition
      this.chartOption.series[0].label.formatter = this.chartStyle.seriesStyle.labelFormatter
      this.chartOption.series[0].radius = this.chartStyle.seriesStyle.radius
      this.chartOption.series[0].roseType = this.chartStyle.seriesStyle.roseType

      if (!this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].top = '0'
      } else if (this.chartOption.title.show && !this.chartOption.legend.show) {
        this.chartOption.series[0].top = '0'
      } else if (!this.chartOption.title.show && this.chartOption.legend.show) {
        this.chartOption.series[0].top = '0'
        this.chartOption.legend.top = '3%'
      }

      this.chartOption.legend.pageIconColor = this.theme === 'dark' ? '#aaaaaa' : '#2f4554'
      this.chartOption.legend.pageIconInactiveColor = this.theme === 'dark' ? '#192035' : '#dee3ed'

      this.chartOption.series[0].data = this.chartStyle.chartData

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
//   .PieChart{
//     position: absolute;
//     right: 0;
//     height: 230px;
//     width: 320px;
//   }
// }
.chart {
  width: 100%;
  height: 100%;
  .PieChart {
    width: 100%;
    height: 100%;
  }
}
</style>
