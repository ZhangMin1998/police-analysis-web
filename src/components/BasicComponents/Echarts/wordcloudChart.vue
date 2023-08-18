<template>
  <div class="chart">
    <div class="title" v-if="chartStyle.titleStyle.show">{{ chartStyle.titleStyle.text }}</div>
    <div :id='chartId' ref="WordcloudChart" class='WordcloudChart'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import 'echarts-wordcloud'
import '@/utils/echarts-wordcloud.min.js'
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
      default: 'WordcloudChart'
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
        series: [{
          // shrinkToFit: true,
          // drawOutOfBound: true,
          type: 'wordCloud',
          shape: 'rect', // star , triangle, circle, rect
          width: '100%',
          height: '100%',
          drawOutOfBound: true, //超出画布后是否显示   可以解决少词或词不全问题
          rotationRange: [0, 0], // 文本旋转范围 [-90, 90]
          keepAspect: false,
          textStyle: {
            // fontFamily: '微软雅黑',
            fontWeight: 'normal', // lighter normal bold bolder
            // color: '#4992ff'
            color: function () {
              const colors = ['#126e82', '#fed71a', '#cca8ba', '#88cc81', '#ec2c64', '#eeb8c3', '#82a0c5', '#fddb7e', '#d11a2d', '#735ba1', '#bda29a', '#81cacc',  '#f26b1f', '#c4ccd3', '#c04851']
              return colors[parseInt(Math.random() * 14)]
              //   // return 'rgb(' + [
              //   //   Math.round(Math.random() * 160),
              //   //   Math.round(Math.random() * 160),
              //   //   Math.round(Math.random() * 160)
              //   // ].join(',') + ')'
            }
          },
          emphasis: {
            focus: 'self'
            // shadowBlur: 10,
            // shadowColor: '#333'
          },
          sizeRange: [20, 60],
          gridSize: 10, // 控制字与字之间的距离
          data: []
        }]
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
      // this.chartOption.title.text = this.chartStyle.titleStyle.text
      // this.chartOption.title.show = this.chartStyle.titleStyle.show
      this.chartOption.series[0].textStyle.fontWeight = this.chartStyle.seriesStyle.fontWeight
      this.chartOption.series[0].sizeRange = [Number(this.chartStyle.seriesStyle.min) || 20, Number(this.chartStyle.seriesStyle.max) || 60]
      // this.chartOption.legend.show = this.chartStyle.legendStyle.show
      // this.chartOption.series[0].axisLabel.show = this.chartStyle.seriesStyle.axisLabel.show
      // this.chartOption.series[0].min =  this.chartStyle.seriesStyle.min || 0
      // this.chartOption.series[0].max =  this.chartStyle.seriesStyle.max || 100
      this.chartOption.series[0].data = this.chartStyle.chartData || []
      // this.myChart.setOption(this.chartOption, true)
    },
    initialChart () {
      let chartDom = document.getElementById(this.chartId)

      if (this.theme === 'dark') {
        this.myChart = echarts.init(chartDom, this.chartStyle.darkLightMode)
      } else {
        this.myChart = echarts.init(chartDom, 'dark')
      }
      this.myChart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
  .title{
    color: var(--base-text-color-1);
    font-weight: bold;
    margin: 3px 0 5px 5px;
  }
  .WordcloudChart {
    width: 100%;
    height: 100%;
  }
}
</style>
