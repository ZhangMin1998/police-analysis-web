<template>
  <div class="LineChart">
    <div id='LineChart' ref="LineChart" class='chart-wrap'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props:{
    chartData: {
      type: Object,
      // default: {}
    },
  },
  data () {
    return {
      chartOption: {
        title: {
          // text: '数据分布TOP7'
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#262D44',
          borderWidth: 0,
          textStyle: {
            color: '#8799BF',
            fontSize: 14
          }
        },
        legend: {},
        grid: {
          // width: '350',
          top: '10',
          left: '0',
          right: '22',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: '#8799BF', // X轴文本颜色
            fontSize: 14,
            // padding: [12, 0, 0, 0]
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(101,116,148,.45)' // X轴颜色
            }
          }
        },
        yAxis: {
          // offset: 90,
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(101,116,148,.45)',
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#7885A5' // Y轴颜色
            }
          },
          axisLabel: {
            textStyle: {
              color: '#8799BF', // 坐标轴文字颜色
              fontSize: 14, // 坐标轴文字大小
              fontWeight: '400',
              // verticalAlign: 'middle'
            }
          },
          data: []
        },
        dataZoom: {
          type: "inside"
        },
        series: [
          {
            data: [],
            type: 'line',
            lineStyle: {
              width: 1,
              type: 'solid',
              color: '#00D1FF'
            },
            itemStyle: {
              color: '#00D1FF'
            },
            areaStyle: {
              color: 'rgba(0,209,255, .04)'
            },
            smooth: true
          }
        ]
      }
    }
  },
  mounted () {
    // console.log(this.chartData)

    this.$nextTick(()=> {
      let chartDom = this.$refs.LineChart
      this.myChart = echarts.init(chartDom)

      this.chartOption.series[0].data = this.chartData.yData
      this.chartOption.xAxis.data = this.chartData.xData


      this.myChart.setOption(this.chartOption, true)
    })
  }
}
</script>

<style lang="less" scoped>
.LineChart{
  .chart-wrap {
    height: 200px;
  }
}
</style>
