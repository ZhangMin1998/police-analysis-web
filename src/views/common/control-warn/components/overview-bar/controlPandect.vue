<template>
<div class='control_pandect_wrap'>
  <div class='title'>布局总览</div>
  <div class='chart_wrap' id='controlChart'></div>
</div>
</template>

<script>
import * as echarts from 'echarts'
import { getPandectTotal } from '@/api/warnControl.js'

export default {
  name: 'ControlPandect',
  data () {
    return {
      option: {
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: 54,
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          itemGap: 12,
          textStyle: {
            color: this.$themeColor('--base-text-color-1'),
            fontSize: 14
          }
        },
        series: [
          {
            type: 'pie',
            left: -112,
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
            radius: [70],
            cursor: 'default',
            data: [
              {
                value: 0,
                name: '已预约',
                itemStyle: {
                  color: '#537BEB'
                }
              },
              {
                value: 0,
                name: '布控中',
                itemStyle: {
                  color: '#62ADF4'
                }
              },
              {
                value: 0,
                name: '已过期',
                itemStyle: {
                  color: '#6B61CB'
                }
              },
              {
                value: 0,
                name: '已停止',
                itemStyle: {
                  color: '#4F596E'
                }
              },
            ],
          }
        ]
      }
    }
  },
  mounted () {
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1560) {
      this.option.legend.itemHeight = 6
      this.option.legend.itemWidth = 6
      this.option.legend.textStyle.fontSize = 10
      this.option.series[0].radius = [48]
    } else if (htmlClientWidth > 1560 && htmlClientWidth <= 1800) {
      this.option.legend.itemHeight = 8
      this.option.legend.itemWidth = 8
      this.option.legend.textStyle.fontSize = 12
      this.option.series[0].radius = [58]
    }
    this.init()
  },
  methods: {
    init () {
      let chartDom = document.getElementById('controlChart')
      if (!chartDom) return
      getPandectTotal().then(res => {
        let result = res || {}
        this.option.series[0].data[0].value = result.reserved
        this.option.series[0].data[0].name += `   ${result.reserved}`
        this.option.series[0].data[1].value = result.enable
        this.option.series[0].data[1].name += `   ${result.enable}`
        this.option.series[0].data[2].value = result.expired
        this.option.series[0].data[2].name += `   ${result.expired}`
        this.option.series[0].data[3].value = result.disable
        this.option.series[0].data[3].name += `   ${result.disable}`
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
.control_pandect_wrap {
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
