<template>
  <div class="men_women_total">
    <div class="label">年龄人口男女统计</div>
    <div class="chart_wrap" id="menWomenChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';

export default {
  name: 'MenWomenTotal',
  props: {
    menWomenData: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    })
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // 更改颜色
        this.myOption.tooltip.textStyle.color = colorObj['--base-text-color-to-666666']
        this.myOption.tooltip.borderColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.myOption.tooltip.backgroundColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.myOption.legend.textStyle.color = colorObj['--base-text-color-to-333333']
        this.myOption.xAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        this.myOption.yAxis[0].nameTextStyle.color = colorObj['--base-text-color-to-666666']
        this.myOption.yAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        if (this.echartsWidth) {
          this.init()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      echartsWidth: '',
      myOption: {
        tooltip: {
          trigger: 'axis',
          borderColor: '#262D44',
          backgroundColor: '#262D44',
          textStyle: {
            color: "#8799BF",
            fontSize: 14
          },
          valueFormatter: (value) => {
            return Math.abs(value) + '人'
          }
        },
        legend: {
          data: ['女', '男'],
          textStyle: {
            color: '#8799BF',
            fontSize: 14
          },
          itemWidth: 8,
          itemHeight: 8,
          selectedMode: false,
          left: 'center',
          height: 19,
          itemGap: 16
        },
        grid: {
          left: 68,
          right: 16,
          bottom: 20
        },
        xAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(101, 116, 148, .24)',
                type: 'dashed'
              }
            },
            axisTick: {
              lineStyle: {
                color: 'rgba(120, 133, 165, 0.45)'
              }
            },
            interval: 200000,
            max: 1000000,
            min: -1000000,
            axisLabel: {
              color: '#8799BF',
              fontSize: 14,
              formatter: function (params) {
                return Math.abs(params) / 10000
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            name: '万人',
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#8799BF',
              fontSize: 14
            },
            axisLabel: {
              color: '#8799BF',
              fontSize: 14
            },
            data: ['1岁以下', '1-4岁', '5-9岁', '10-14岁', '15-19岁', '20-24岁', '25-29岁', '30-34岁', '35-39岁',
                   '40-44岁', '45-49岁', '50-54岁', '55-59岁', '60-64岁', '65-69岁', '70-74岁', '75-79岁',
                   '80-84岁', '85-89岁', '90-94岁', '95-99岁', '100+岁'
            ]
          }
        ],
        series: [
          {
            name: '男',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
              color: '#33C2FF'
            },
            barWidth: 8,
            data: []
          },
          {
            name: '女',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
              color: '#FF1943'
            },
            barWidth: 8,
            data: []
          },
        ]
      }
    }
  },
  mounted () {
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1440) {
      this.myOption.legend.textStyle.fontSize = 12
      this.myOption.xAxis[0].axisLabel.fontSize = 10
      this.myOption.yAxis[0].nameTextStyle.fontSize = 12
      this.myOption.yAxis[0].axisLabel.fontSize = 10
      this.myOption.series[0].barWidth = 5
      this.myOption.series[1].barWidth = 5
      this.myOption.grid.left = 54
    } else if (htmlClientWidth > 1440 && htmlClientWidth <= 1560) {
      this.myOption.legend.textStyle.fontSize = 13
      this.myOption.xAxis[0].axisLabel.fontSize = 12
      this.myOption.yAxis[0].nameTextStyle.fontSize = 13
      this.myOption.yAxis[0].axisLabel.fontSize = 12
      this.myOption.series[0].barWidth = 6
      this.myOption.series[1].barWidth = 6
      this.myOption.grid.left = 58
    }
  },
  methods: {
    init () {
      this.echartsWidth = document.getElementById('menWomenChart').clientWidth
      this.myOption.yAxis[0].nameTextStyle.padding = [0, 0, -10, 0 - this.echartsWidth + 36]
      this.myOption.legend.left = (this.echartsWidth / 2) - this.myOption.legend.itemWidth - 4
      this.myOption.yAxis[0].data.forEach(item => {
        if (this.menWomenData[item]) {
          this.myOption.series[0].data.push(this.menWomenData[item]['男'])
          this.myOption.series[1].data.push(0 - this.menWomenData[item]['女'])
        }
      })
      let maxNumList = []
      for (let key in this.menWomenData) {
        maxNumList.push(this.menWomenData[key]['男'])
        maxNumList.push(this.menWomenData[key]['女'])
      }
      let maxNum = Math.max(...maxNumList)
      if (maxNum > 1000000) {
        this.myOption.xAxis[0].interval = Math.ceil(maxNum / 50000) * 10000
        this.myOption.xAxis[0].max = this.myOption.xAxis[0].interval * 5
        this.myOption.xAxis[0].min = 0 - this.myOption.xAxis[0].interval * 5
      }
      let myChart = echarts.init(document.getElementById('menWomenChart'))
      myChart.setOption(this.myOption)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.men_women_total {
  flex: 1;
  height: 100%;
  padding: 16px;
  color: var(--base-text-color-to-999999);
  font-size: 16px;
  background: var(--bg-color-2);
  box-shadow: 0px 1px 0px 1px rgba(0, 0, 0, 0.06);
  margin-right: 24px;
  .label {
    font-weight: bold;
    line-height: 21px;
  }
  .chart_wrap {
    height: 531px;
    width: 554px;
  }
}
</style>
