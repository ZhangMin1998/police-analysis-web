<template>
  <div class="person_total_wrap">
    <div class="label">地区人口统计</div>
    <div class="chart_wrap" id="myChart"></div>
  </div>
</template>

<script>
import wh from '../weihai'
import * as echarts from 'echarts'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'
export default {
  name: 'PersonTotal',
  props: {
    regionData: {
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
        this.chartOption.visualMap.textStyle.color = colorObj['--base-text-color-to-999999']
        this.chartOption.series[0].label.color = colorObj['--333333-to-white-color']
        this.chartOption.series[1].label.color = colorObj['--base-text-color-to-666666']
        this.chartOption.series[1].label.rich.a.color = colorObj['--base-text-color-1']
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
      chartOption: {
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 1000000,
          orient: 'vertical',
          text: ['HIGH', 'LOW'],
          inRange: {
            color: ['#47B6FA', '#F7F71D', '#FC4416']
          },
          outOfRange: {
            color: ['#FC4416']
          },
          calculable: true,
          realtime: false,
          itemHeight: 92,
          itemWidth: 11,
          textStyle: {
            color: '#8799BF',
            fontSize: 14,
            lineHeight: 19
          },
          seriesIndex: 0
        },
        geo: {
          map: 'WH',
          zoom: 0.8,
          label: {
            show: true,
            color: '#333333'
          },
          itemStyle: {
            borderColor: '#657494',
            borderWidth: 1
          },
          emphasis: {
            disabled: true
          },
          select: {
            disabled: true
          }
        },
        series: [
          {
            type: 'map',
            map: 'WH',
            zoom: 0.8,
            label: {
              show: true,
              color: '#333333',
              fontSize: 10
            },
            itemStyle: {
              borderColor: '#657494',
              borderWidth: 1
            },
            emphasis: {
              disabled: true
            },
            select: {
              disabled: true
            },
            data: []
          },
          {
            type: 'lines',
            symbol: 'circle',
            symbolSize: [1, 1],
            label: {
              show: true,
              formatter: '{b} {a|{c}人}',
              color: "#8799BF",
              fontSize: 14,
              rich:{
                a:{
                  color:'#C0D0E7',
                  fontWeight:'bold',
                }
              }
            },
            lineStyle: {
              type: 'solid',
              color: "#7885A5",
              opacity: 1
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    let htmlClientWidth = document.documentElement.clientWidth
    if (htmlClientWidth <= 1440) {
      this.chartOption.visualMap.itemHeight = 58
      this.chartOption.visualMap.textStyle.fontSize = 11
      this.chartOption.visualMap.textStyle.lineHeight = 16
      this.chartOption.series[1].label.fontSize = 12
    } else if (htmlClientWidth > 1440 && htmlClientWidth <= 1560) {
      this.chartOption.visualMap.itemHeight = 62
      this.chartOption.visualMap.textStyle.fontSize = 12
      this.chartOption.visualMap.textStyle.lineHeight = 16
      this.chartOption.series[1].label.fontSize = 13
    }
  },
  methods: {
    init () {
      let mapData = []
      for (let key in this.regionData) {
        let obj = {}
        obj['name'] = key
        obj['value'] = this.regionData[key]
        mapData.push(obj)
      }
      this.chartOption.series[0].data = mapData
      echarts.registerMap('WH', wh)
      this.myChart = echarts.init(document.getElementById('myChart'))
      const geoLngLat = {
        '环翠区': [122.132939, 37.395353],
        '乳山市': [121.515527, 36.912483],
        '荣成市': [122.411782, 37.100582],
        '文登区': [122.016536, 37.102341]
      }
      const lineEndPoint = {
        '环翠区': [geoLngLat['环翠区'][0], geoLngLat['环翠区'][1] + 0.26],
        '乳山市': [geoLngLat['乳山市'][0] + 0.2, geoLngLat['乳山市'][1] - 0.3],
        '荣成市': [geoLngLat['荣成市'][0] - 0.1, geoLngLat['荣成市'][1] - 0.36],
        '文登区': [geoLngLat['文登区'][0] - 0.46, geoLngLat['文登区'][1] + 0.3]
      }
      let dataLines = (province, data) => {
        let res = []
        province.forEach(name => {
          res.push({
            name: name,
            value: data[name],
            coords: [geoLngLat[name], lineEndPoint[name]],
          })
        })
        return res
      }
      this.chartOption.series[1].data = dataLines(['环翠区', '乳山市', '荣成市', '文登区'], this.regionData)
      this.myChart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.person_total_wrap {
  flex: 1;
  height: 100%;
  padding: 16px;
  color: var(--base-text-color-to-999999);
  font-size: 16px;
  background: var(--bg-color-2);
  box-shadow: 0px 1px 0px 1px rgba(0, 0, 0, 0.06);
  margin-right: 24px;
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
