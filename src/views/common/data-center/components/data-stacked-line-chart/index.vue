<template>
  <div
    class='Card'
    v-p-loading='loading'
    :element-loading-background="'--loading-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title-box">
      <div class='title'>{{ wrapTitle }}</div>
      <div>
        <i class="el-icon-s-tools" style="cursor:pointer;" @click="showSetting" :title='"设置"'></i>
      </div>
    </div>
    <div class='time-box'>
      <div :class='["common-style", "hour", {"no_active": activeSort !== "hour"}]' @click='changeSort("hour")'>时</div>
      <div :class='["common-style", "day", {"no_active": activeSort !== "day"}]' @click='changeSort("day")'>天</div>
    </div>
    <div id='LineChart' ref="LineChart" class='chart-wrap'></div>
<!--    <LineChart
      ref="LineChart"
      :wrapTitle="'数据细分'"
      :haveSet="true"
      :color="color"
      :xAxisData="xAxisData"
      :series="series"
      :chartData="chartData"
      @changeSort="changeSort"
      @showSetting="showSetting">
    </LineChart>-->
    <SelectComponent
      v-if="isShowSetting"
      :max="max"
      :defaultChecked="defaultChecked"
      :tipContent="tipContent"
      @checkedResult="checkedResult"
      @close="close"
      >
    </SelectComponent>
  </div>
</template>

<script>
// import * as echarts from 'echarts'
import {
  getRecordDetType,
  setRecordDetType,
  getRecordDetTotal,
  /*getBrokenDataApi,
  getCacheDataType*/
} from '@/api/dataCenter'
import SelectComponent from '../selectComponent'
// import LineChart from './LineChart.vue'
import config from '@/config/config.js'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import * as echarts from 'echarts'

const defaultDataType = [
  'bank_card',
  'epidemic_resumework',
  'epidemic_nucleate',
  'epidemic_register',
  'phone_sim',
  'assets_house',
  'phone_operator'
]

export default {
  name: 'DataStackedLineChart',
  inject: ['choicePanel'],
  props: {
    // 组件标题
    wrapTitle: {
      type: String,
      default: '数据细分'
    },
    yName: {
      type: String,
      default: '万条'
    }
  },
  components: {
    SelectComponent,
    // LineChart
  },
  data () {
    return {
      userName: localStorage.getItem('userName'),
      max: 7,
      tipContent: '您可以选择 7 种数据显示在数据细分图上。',
      isShowSetting: false,
      // defaultChecked: ['银行业务', '复工复产', '核酸记录', '防疫登记', '手机卡信息', '不动产', '运营商业务'],
      defaultChecked: [],
      legend: [],
      color: ['#0075FF','#FF00B8','#FF0027','#9600FA','#00D1FF','#00B73E','#FFA800'],
      xAxisData: [],
      series: [],
      chartData: [],
      activeSort: 'day',
      routesList: [],
      showType: [],
      nowTime: null,
      rollNum: 0,
      loading: false,
      myChart: null,
      resultObj: {},
      chartOption: {
        tooltip: {
          trigger: 'axis',
          borderColor: '#262D44',
          backgroundColor: '#262D44',
          textStyle: {
            color: '#8799BF',
            fontSize: 14
          },
          valueFormatter: (value) => {
            let changeNum = value + ''
            let unit = '条'
            if (changeNum.length >= 9) {
              changeNum = (value / 100000000).toFixed(2)
              unit = '亿条'
            } else if (changeNum.length >= 5) {
              changeNum = (value / 10000).toFixed(2)
              unit = '万条'
            }
            return changeNum + unit
          }
        },
        backgroundColor: "#192035",
        legend: {
          textStyle:{
            color:'#8799BF'
          }
        },
        dataZoom: {
          type: "inside"
        },
        grid: {
          left: '48',
          right: '48',
          bottom: '24',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // interval: 2,
            // splitNumber: 10,
            axisLabel: {
              color: '#8799BF',
              fontSize: 16,
              padding: [12, 0, 0, 0]
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(101,116,148,.45)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '万条',
            // max: 'dataMax',
            nameLocation: 'end',
            splitNumber: 11,
            nameTextStyle: {
              color: '#8799BF',
              fontSize: 16,
              padding: [0, 36, 10, 0]
            },
            axisLabel: {
              color: '#8799BF',
              fontSize: 16,
              formatter: (value) => {
                if (value <= 1) {
                  return value
                } else {
                  return (value / 10000).toFixed(2)
                }
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(101,116,148,.45)',
                type: 'dashed'
              }
            }
          }
        ],
        series: []
      }
    }
  },
  computed: {
    ...mapState('Common', {
      RouterList: 'RouterList'
    }),
    ...mapState('User', {
      statStage: 'statStage',
      theme: 'theme'
    })
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // 更改颜色
        this.chartOption.tooltip.backgroundColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.chartOption.tooltip.borderColor = colorObj['--tooltip-bg-262D44-to-f6f8fd']
        this.chartOption.tooltip.textStyle.color = colorObj['--base-text-color-to-666666']
        this.chartOption.legend.textStyle.color = colorObj['--base-text-color-to-666666']
        this.chartOption.backgroundColor = colorObj['--bg-color-2']
        this.chartOption.xAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis[0].axisLabel.color = colorObj['--base-text-color-to-666666']
        this.chartOption.yAxis[0].nameTextStyle.color = colorObj['--base-text-color-to-666666']
        if (this.myChart) {
          this.myChart.setOption(this.chartOption, true)
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    let matchRoute
    if (config.dependBackendRouter) {
      matchRoute = this.RouterList.filter(route => this.$route.meta.parentId + '' === route.id + '')
      // return matchRoute[0].meta
    } else {
      matchRoute = this.RouterList.filter(pRoute => {
        if (pRoute.children && pRoute.children.length) {
          let tempCRoute = pRoute.children.filter(route => {
            return route.path == this.$route.path
          })
          if (tempCRoute.length) {
            return pRoute
          }
        }
      })
    }
    let routeList = matchRoute[0].meta.navList.slice(1)
    routeList.forEach(item => {
      this.choicePanel['TITLE_TO_TYPE'][item.title] && this.routesList.push(this.choicePanel['TITLE_TO_TYPE'][item.title])
    })
    this.nowTime = new Date().getTime()
    this.getShowRecords()
  },
  methods: {
    getShowRecords () {
      getRecordDetType().then(res => {
        let result = res || []
        this.showType = result.filter(item => {
          return this.routesList.includes(item)
        })
        if (this.showType.length === 0 && this.routesList.length) {
          for (let ind = 0; ind < this.routesList.length; ind++) {
            if (!this.showType.includes(this.routesList[ind])) {
              this.showType.push(this.routesList[ind])
            }
            if (this.showType.length === 7) break
          }
        }
        this.showType.forEach(item => {
          this.defaultChecked.push(this.choicePanel['TYPE_TO_TITLE'][item])
        })
        this.drawChart(this.showType, true)
      }).catch(() => {
        this.$emit('changeStackLineLoad', false)
      })
    },

    setShowRecords (list) {
      let uploadList = new FormData()
      uploadList.append('dataTypeList', list)
      setRecordDetType(uploadList).then(res => {
        this.showType = res || []
        this.showType.forEach(item => {
          this.defaultChecked.push(this.choicePanel['TYPE_TO_TITLE'][item])
        })
        this.drawChart(list, true)
      }).catch(() => {
        this.loading = false
        this.$emit('changeStackLineLoad', false)
      })
    },
    resetData () {
      this.myChart ? this.myChart.off('dataZoom') : null
      this.myChart = null
      this.nowTime = new Date().getTime()
      this.xAxisData = []
      this.series = []
      this.chartData = []
      this.resultObj = {}
      this.rollNum = 0
    },
    checkedResult (item) {
      this.loading = true
      this.resetData()
      this.showType = []
      this.defaultChecked = []
      this.setShowRecords(item.value)
    },
    close () {
      this.isShowSetting = false
    },
    showSetting () {
      this.isShowSetting = true
    },
    // 切换显示数据的区间
    changeSort (item) {
      this.loading = true
      this.activeSort = item
      this.resetData()
      this.drawChart(this.showType, true)
      // this.getChartData()
    },

    getLineData (startTime, endTime, type = [], needAdd = false) {
      return new Promise((resolve) => {
        getRecordDetTotal({
          dataTypeMapList: type,
          unit: this.activeSort,
          startTime: startTime,
          endTime: endTime,
          dataStage: this.statStage
        }).then(res => {
          let result = res || {}
          for (let key in result) {
            result[key] = result[key].reverse()
          }
          if (needAdd) {
            this.rollNum += 1
          }
          resolve(result || {})
        }).catch(() => {
          this.loading = false
          this.$emit('changeStackLineLoad', false)
        })
      })
    },

    drawChart (type, isMount = false) {
      let promiseList = []
      // let nowTime = new Date().getTime()
      let typeList = type ? type : defaultDataType

      if (isMount && this.activeSort === 'day') {
        for (let i = this.rollNum; i < 2; i++) {
          if (i > 0) {
            promiseList.push(this.getLineData(this.nowTime - ((i + 1) * 31) * 24 * 60 * 60 * 1000, this.nowTime - (i * 31) * 24 * 60 * 60 * 1000, typeList))
          } else {
            promiseList.push(this.getLineData(this.nowTime - ((i + 1) * 31) * 24 * 60 * 60 * 1000, this.nowTime, typeList))
          }
          this.rollNum += 1
        }
      } else {
        if (this.activeSort === 'day') {
          if (this.rollNum < 11) {
            promiseList.push(this.getLineData(
              this.nowTime - ((this.rollNum + 1) * 31) * 24 * 60 * 60 * 1000,
              this.nowTime - (this.rollNum * 31) * 24 * 60 * 60 * 1000,
              typeList,
              true
            ))
          } else {
            promiseList.push(this.getLineData(
              this.nowTime - 365 * 24 * 60 * 60 * 1000,
              this.nowTime - (this.rollNum * 31) * 24 * 60 * 60 * 1000,
              typeList,
              true
            ))
          }
        } else if (this.activeSort === 'hour') {
          promiseList.push(this.getLineData(this.nowTime - 24 * 60 * 60 * 1000, this.nowTime, typeList))
        }
      }
      Promise.all(promiseList.map(item => item.catch(() => {}))).then(res => {
        // let result = {}
        let xType = this.showType[0]
        let oldLength = this.chartData.length ? this.chartData[0].length : 0
        res.forEach(item => {
          for (let key in item) {
            let value = item[key] || []
            let resultValue = []
            value.forEach(v => {
              resultValue.unshift(v.value)
            })
            if (key === xType) {
              value.forEach(v => {
                this.xAxisData.unshift(v.dateTime)
              })
            }
            if (this.resultObj[key]) {
              this.resultObj[key] = [...resultValue, ...this.resultObj[key]]
            } else {
              this.resultObj[key] = resultValue
            }
          }
        })
        this.chartData = Object.values(this.resultObj)
        if (!this.chartData.length) {
          this.loading = false
          this.$emit('changeStackLineLoad', false)
          return
        }
        this.series = []
        for (let key in this.resultObj) {
          this.series.push({
            name: this.choicePanel['TYPE_TO_TITLE'][key],
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: this.resultObj[key],
            smooth: true
          })
        }
        // console.log(this.xAxisData)
        // console.log(this.series);
        if (isMount) {
          let chartDom = this.$refs.LineChart
          this.myChart = echarts.init(chartDom, 'dark')
          this.chartOption.color = this.color
          this.$set(this.chartOption.xAxis[0], 'data', this.xAxisData)
          this.chartOption.series = this.series
          if (this.activeSort === 'day') {
            // console.log(this.chartData)
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 15
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          } else if (this.activeSort === 'hour') {
            this.chartOption.dataZoom.startValue = this.chartData[0].length - 12
            this.chartOption.dataZoom.endValue = this.chartData[0].length - 1
          }
          let showValue = this.chartData.map(item => {
            return item.slice(this.chartOption.dataZoom.startValue, this.chartOption.dataZoom.endValue + 1)
          })
          this.formatterYData(showValue)
          this.myChart.setOption(this.chartOption, true)

          // 缩放区域，对展示区域数据进行处理
          this.myChart.on('dataZoom', (params) => {
            let chart = this.myChart.getOption()
            let chartDataZoom = chart.dataZoom[0]
            let showValue = chart.series.map(item => {
              return item.data.slice(chartDataZoom.startValue, chartDataZoom.endValue + 1)
            })
            /*this.chartOption.dataZoom.startValue = chartDataZoom.startValue
            this.chartOption.dataZoom.endValue = chartDataZoom.endValue*/
            // // 判断是否有大于一亿的数据
            this.formatterYData(showValue)
            this.myChart.setOption({...chart, chartDataZoom }, {
              replaceMerge: ['yAxis']
            })
            if (this.activeSort === 'day' && this.rollNum >= 0 && this.rollNum <= 11 && params.batch[0].start === 0 && params.batch[0].end === 100) {
              this.loading = true
              this.drawChart(type)
            }
          })
        } else {
          let {
            xAxis,
            series,
            dataZoom
          } = this.myChart.getOption()
          series = this.series
          xAxis[0].data = this.xAxisData
          dataZoom[0].startValue = this.chartData[0].length - oldLength - 1
          dataZoom[0].endValue = this.chartData[0].length - 1
          console.log(dataZoom)
          delete dataZoom[0].start
          delete dataZoom[0].end
          const option = { ...this.myChart.getOption(), xAxis, series, dataZoom }
          this.myChart.setOption(option)
        }

        this.loading = false
        this.$emit('changeStackLineLoad', false)
      })
    },
    formatterYData (list) {
      // 判断是否有大于一亿的数据
      let findValueArray1 = list.map(item => {
        return item.some(value => {
          return value >= 100000000
        })
      })
      let isVeryBig = findValueArray1.some(item => {
        return item
      })

      // 判断是否有大于一万的数据
      let findValueArray2 = list.map(item => {
        return item.some(value => {
          return value >= 10000
        })
      })
      let isBig = findValueArray2.some(item => {
        return item
      })

      if (isVeryBig) {
        this.chartOption.yAxis[0].name = '亿条'
        delete this.chartOption.yAxis[0].minInterval
        delete this.chartOption.yAxis[0].max
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          if (value <= 1) {
            return value
          } else {
            return (value / 100000000)
          }
        }
      } else if (isBig) {
        this.chartOption.yAxis[0].name = '万条'
        delete this.chartOption.yAxis[0].minInterval
        delete this.chartOption.yAxis[0].max
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          if (value <= 1) {
            return value
          } else {
            return (value / 10000)
          }
        }
      } else {
        this.chartOption.yAxis[0].name = '条'
        this.chartOption.yAxis[0].minInterval = 1
        this.chartOption.yAxis[0].nameTextStyle.padding = [0, 30, 10, 0]
        this.chartOption.yAxis[0].max = (value) => {
          if (value.max < 10) {
            return 10
          }
        }
        this.chartOption.yAxis[0].axisLabel.formatter = (value) => {
          return value
        }
      }
    },
  }
}
</script>

<style lang='less' scoped>
.Card {
  overflow: auto;
  min-height: 100px;
  position: relative;
  margin-top: 20px;
  // padding: 20px 20px;
  background: var(--bg-color-2);
  .title-box {
    margin: 16px 16px 6px 16px;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: var(--base-text-color-to-999999);
      margin-bottom: 20px;
    }
  }
  .time-box {
    position: absolute;
    z-index: 99;
    top: 48px;
    right: 24px;
    display: flex;
    box-sizing: border-box;
    .common-style {
      display: flex;
      justify-content: center;
      width: 44px;
      height: 28px;
      font-size: 16px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;

      background: var(--active-color);
      color: @font-color-3;
      border: 1px solid var(--active-color);
      &.no_active {
        background: transparent;
        color: var(--base-text-color-1);
        border: 1px solid var(--border-color-input);
        &:hover {
          border-color: var(--border-color-input);
          color: var(--active-color);
        }
        //border: 1px solid #177DDC;
      }
    }
    .hour {
      border-radius: 2px 0 0 2px;
    }
    .day {
      border-radius: 0 2px 2px 0;
    }
  }
  .chart-wrap {
    width: 1806px;
    height: 506px;
  }
}
</style>
