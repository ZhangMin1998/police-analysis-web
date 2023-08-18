<template>
  <div class="BarChart">
    <div id='BarChart' ref="BarChart" class='chart-wrap'></div>
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
    // aaa: {
    //   type: Number
    // }
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
        // color: '',
        legend: {},
        grid: {
          // width: '350',
          top: '0',
          left: '25%',
          // right: '10%',
          bottom: '0%',
          // containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          offset: 90,
          axisLine: {
            lineStyle: {
              color: '#7885A5' // Y轴颜色
            }
          },
          axisLabel: {
            textStyle: {
              width:100,
              color: '#8799BF', // 坐标轴文字颜色
              fontSize: 16, // 坐标轴文字大小
              fontWeight: '400',
              align: 'left',
              verticalAlign: 'middle'
            }
          },
          type: 'category',
          data: []
        },
        series: [
          {
            type: 'bar',
            barWidth: 12,
            label: {
              show: true,
              position: 'right',
              color: '#C0D0E7',
              fontWeight: '400',
              fontSize: 16
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    // console.log('this.aaa = ', this.aaa)
    // console.log(this.chartData)

    this.$nextTick(()=> {
      let chartDom = this.$refs.BarChart
      this.myChart = echarts.init(chartDom)
      this.chartOption.color = this.chartData.color
      this.chartOption.series[0].data = this.chartData.data
      this.chartOption.yAxis.data = this.chartData.yData


      this.myChart.setOption(this.chartOption, true)
    })
  }
}
</script>

<style lang="less" scoped>
.BarChart{
  .chart-wrap {
    height: 190px;
  }
}
</style>
