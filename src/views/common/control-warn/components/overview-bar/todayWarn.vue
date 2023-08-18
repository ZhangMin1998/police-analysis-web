<template>
<div class='today_warn_wrap'>
  <div class='title'>当天触警</div>
  <div class='chart_wrap' id='todayChart'></div>
</div>
</template>

<script>
import * as echarts from 'echarts'
import { getTodayTotal } from '@/api/warnControl.js'
import dayjs from '@/utils/filters'

export default {
  name: 'TodayWarn',
  data () {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: this.$themeColor('--tooltip-bg-262D44-to-f6f8fd'),
          borderWidth: 0,
          textStyle: {
            color: this.$themeColor('--base-text-color-to-666666'), //默认值各异，
            fontSize: 12 //默认值，
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          padding: [12, 0, 0, 0],
          selectedMode: false,
          textStyle: {
            color: this.$themeColor('--base-text-color-1'),
            fontSize: 14,
          }
        },
        grid: {
          top: 46,
          right: 10,
          bottom: 20
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              fontSize: 12,
              color: this.$themeColor('--base-text-color-to-666666')
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(120, 133, 165, 0.45)'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              fontSize: 12,
              color: this.$themeColor('--base-text-color-to-666666')
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: this.$themeColor('--record-library-tree-opera')
              }
            },
          }
        ],
        series: [
          {
            name: '严重',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            symbolSize: 0,
            itemStyle: {
              color: '#DD3F48'
            },
            data: []
          },
          {
            name: '一般',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            symbolSize: 0,
            itemStyle: {
              color: '#F8BC3C',
            },
            data: []
          },
          {
            name: '普通',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            symbolSize: 0,
            itemStyle: {
              color: '#62ADF4',
            },
            data: []
          },
        ]
      },
      myChart: null
    }
  },
  mounted () {
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1680) {
      this.option.legend.itemHeight = 6
      this.option.legend.itemWidth = 6
      this.option.legend.textStyle.fontSize = 10
      this.option.xAxis[0].axisLabel.fontSize = 8
      this.option.yAxis[0].axisLabel.fontSize = 8
      this.option.tooltip.textStyle.fontSize = 12
      this.option.grid.top = 32
    } else if (htmlClientWidth > 1680 && htmlClientWidth <= 1800) {
      this.option.legend.itemHeight = 8
      this.option.legend.itemWidth = 8
      this.option.legend.textStyle.fontSize = 12
      this.option.xAxis[0].axisLabel.fontSize = 10
      this.option.yAxis[0].axisLabel.fontSize = 10
      this.option.tooltip.textStyle.fontSize = 12
      this.option.grid.top = 32
    }
    this.init()
  },
  methods: {
    init () {
      let chartDom = document.getElementById('todayChart')
      if (!chartDom) return
      let startMonitorTime = new Date().getTime() - 1 * 24 * 60 * 60 * 1000
      getTodayTotal({
        endMonitorTime: dayjs.filterString(new Date().getTime()),
        startMonitorTime: dayjs.filterString(startMonitorTime)
      }).then(res => {
        let result = res || []
        let isSmallFive = true
        result.forEach(item => {
          this.option.series[0].data.push(item.seriousValue)
          this.option.series[1].data.push(item.generalValue)
          this.option.series[2].data.push(item.normalValue)
          this.option.xAxis[0].data.push(item.dateTimeStr)
          if (item.seriousValue + item.generalValue + item.normalValue > 5) {
            isSmallFive = false
          }
        })
        if (isSmallFive) {
          this.option.yAxis[0].max = 5
        }
        this.myChart = echarts.init(chartDom)
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.today_warn_wrap {
  width: 100%;
  height: calc(100% / 3);
  .title {
    font-size: 16px;
    line-height: 21px;
    color: var(--base-text-color-1);
    padding: 14px 16px 0;
  }
  .chart_wrap {
    width: 100%;
    height: calc(100% - 35px);
  }
}
</style>
