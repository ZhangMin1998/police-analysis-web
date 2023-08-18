<template>
  <div class="chart">
    <div :id='chartId' ref="MapChart" class='MapChart'></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'
import wh from '@/views/common/data-center/live-person/weihai'
import sd from '@/views/common/data-center/live-person/shandong'

export default {
  props: {
    regionData: {
      type: Object,
      default: () => {}
    },
    chartStyle: {
      type: Object,
      default: () => {}
    },
    chartId: {
      type: String,
      default: 'MapChart'
    }
  },
  data () {
    return {
      myChart: null,
      chartOption: {
        backgroundColor: this.$themeColor(this.chartStyle.backgroundColor),
        title: {
          show: true,
          text:  '',
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
            fontSize: this.chartStyle.tooltipStyle.fontSize
          },
        },
        visualMap: {
          type: 'continuous',// 连续型
          min: null,
          max: null,
          orient: 'horizontal', // horizontal/ vertical
          text: ['HIGH', 'LOW'],
          left: '0',
          // top: '0',
          inRange: {
            color: ['#47B6FA', '#F7F71D', '#FC4416']
          },
          outOfRange: {
            color: ['#FC4416']
          },
          calculable: true, // 是否显示拖拽用的手柄
          realtime: false, // 拖拽时，是否实时更新
          itemHeight: 80,
          itemWidth: 10,
          textStyle: {
            color: '#8799BF',
            fontSize: 12,
            lineHeight: 16
          },
          seriesIndex: 0
        },
        geo: { // 指示线
          show: false,
          map: 'WH',
          zoom: 0.7,
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
            name: '山东省威海市',
            type: 'map',
            map: 'WH',
            zoom: 0.8,// 当前视角的缩放比例
            roam: 'scale',// 'scale' 或者 'move'设置成 true 为都开启
            label: {
              show: true,
              color: '#333333',
              fontSize: 10
            },
            itemStyle: {
              borderColor: '#657494',
              borderWidth: 1
            },
            // emphasis: {
            //   disabled: true
            // },
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
              show: true, // 是否显示label的内容
              // formatter: '{b} {a|{c}人}',
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
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
  },
  watch: {
    chartStyle: {
      handler (newVal) {
        console.log(newVal)
        this.chartChange()
        this.initialChart()
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
      this.chartOption.visualMap.min = this.chartStyle.visualMapStyle.min
      this.chartOption.visualMap.min = this.chartStyle.visualMapStyle.max
      this.chartOption.series[1].lineStyle.opacity = this.chartStyle.seriesStyle.labelShow ? 1 : 0
      this.chartOption.series[0].data = this.chartStyle.chartData
    },
    initialChart () {
      if (this.myChart) {
        this.myChart.dispose()
      }
      let chartDom = document.getElementById(this.chartId)
      // let mapData = []
      // for (let key in this.regionData) {
      //   let obj = {}
      //   obj['name'] = key
      //   obj['value'] = this.regionData[key]
      //   mapData.push(obj)
      // }
      // this.chartOption.series[0].data = mapData
      echarts.registerMap('WH', this.chartStyle.registerMapName === 'wh' ? wh : sd)
      // this.myChart = echarts.init(document.getElementById('MapChart'))
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
      this.chartOption.series[1].data = dataLines(['环翠区', '乳山市', '荣成市', '文登区'], {}) // this.regionData

      this.myChart = echarts.init(chartDom, this.chartStyle.darkLightMode)
      this.myChart.on('click', params => {
        this.$emit('mapClick', params.data || {})
      })
      this.myChart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="less" scoped>
// .chart{
//   .MapChart{
//     position: absolute;
//     right: 0;
//     height: 230px;
//     width: 320px;
//   }
// }
.chart {
  width: 100%;
  height: 100%;
  .MapChart {
    width: 100%;
    height: 100%;
  }
}
</style>
