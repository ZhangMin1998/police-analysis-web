<template>
  <div class="educate_total_wrap">
    <div class="label">文化程度统计</div>
    <div class="chart_wrap" id="educateChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';

export default {
  name: 'EducateTotal',
  props: {
    educateData: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // 更改颜色
        this.myOption.series[0].label.color = colorObj['--base-text-color-to-666666']
        this.myOption.series[0].label.rich.a.color = colorObj['--base-text-color-1']
        if (this.myChart) {
          this.init()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      myChart: '',
      dataColor: {
        '研究生及以上': '#4DB6FD',
        '其他': '#F48240',
        '高中': '#F43973',
        '本科': '#17D463',
        '中专': '#F8C035',
        '大专': '#3E71FD',
        '初中及以下': '#27CC91'
      },
      myOption: {
        series: [
          {
            type: 'pie',
            radius: ['11%', '50%'],
            roseType: 'area',
            width: '100%',
            height: '100%',
            left: 'center',
            label: {
              show: true,
              formatter: function (params) {
                // return params.name + '\n' + params.value.toLocaleString() + '人 ' + Math.round(params.data.percent || 0) + '%'
                return `${params.name}\n{a|${params.value.toLocaleString()}人 ${Math.round(params.data.percent || 0)}%}`
              },
              color: '#8799BF',
              fontSize: 14,
              lineHeight: 21,
              rich: {
                a: {
                  color: '#C0D0E7',
                  fontWeight:'bold'
                }
              },
            },
            labelLine: {
              show: true
            },
            data: []
          }
        ]
      },
      totalData: []
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    total () {
      let all = Object.values(this.educateData)
      let num = 0
      all.forEach(item => {
        num += item
      })
      return num
    }
  },
  mounted () {
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1440) {
      this.myOption.series[0].label.fontSize = 12
    } else if (htmlClientWidth > 1440 && htmlClientWidth <= 1560) {
      this.myOption.series[0].label.fontSize = 13
    }
  },
  methods: {
    init () {
      let sort = Object.entries(this.educateData)
      for (let ind = 0; ind < sort.length; ind++) {
        for (let j = ind + 1; j < sort.length; j++) {
          if (sort[j][1] > sort[ind][1]) {
            let temp = sort[ind]
            sort[ind] = sort[j]
            sort[j] = temp
          }
        }
      }
      this.totalData = sort
      let data = []
      let totalPercent = 0
      let decimalList = []
      this.totalData.forEach((item, index) => {
        let obj = {
          itemStyle: {}
        }
        obj['name'] = item[0]
        obj['value'] = item[1]
        obj['itemStyle']['color'] = this.dataColor[item[0]] || ''
        if (this.total && typeof this.total === 'number') {
          obj['percent'] = Math.trunc((obj['value'] / this.total) * 100)
          totalPercent += obj['percent']
          decimalList.push({
            index: index,
            decimal: ((obj['value'] / this.total) * 100) - obj['percent']
          })
        }
        data.push(obj)
      })
      if (this.total && typeof this.total === 'number' && totalPercent < 100) {
        let poor = 100 - totalPercent
        for (let ind = 0; ind < poor; ind++) {
          for (let j = ind + 1; j < decimalList.length; j++) {
            if (decimalList[j]['decimal'] > decimalList[ind]['decimal']) {
              let temp = decimalList[ind]
              decimalList[ind] = decimalList[j]
              decimalList[j] = temp
            }
          }
          data[decimalList[ind]['index']]['percent'] += 1
        }
      }
      this.myOption.series[0].data = data
      this.myChart = echarts.init(document.getElementById('educateChart'))
      this.myChart.setOption(this.myOption)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.educate_total_wrap {
  position: relative;
  flex: 1;
  height: 100%;
  padding: 16px;
  color: var(--base-text-color-to-999999);
  font-size: 16px;
  background: var(--bg-color-2);
  box-shadow: 0px 1px 0px 1px rgba(0, 0, 0, 0.06);
  .label {
    line-height: 21px;
    font-weight: bold;
  }
  .chart_wrap {
    height: 531px;
    width: 554px;
  }
}
</style>
