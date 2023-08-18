<template>
  <div class="WorkAndRestDetail">
    <Loading :isLoading.sync="isLoading"></Loading>

    <ul class="placeData">
      <li class="placeDatai-item">
        <span class="placeDatai-item-key">场所名称：</span>{{ placeData.name }}
      </li>
      <li class="placeDatai-item">
        <span class="placeDatai-item-key">场所地址：</span>{{ placeData.address }}
      </li>
    </ul>

    <ul class="dot-list">
      <li class="dot-list-item" v-for="item in dotList" :key="item.dec">
        <div
          class="dot"
          :style="{
            backgroundColor: item.color,
            width: item.width,
            height: item.width
          }"
        ></div>
        <div class="dec">{{ item.dec }}</div>
      </li>
    </ul>
    <div id="chart1" :style="{ marginLeft: '0.5%', width: '99%', height: '88%' }"></div>
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import { Xcharts } from '@/utils/xcharts'
import dayjs from '@/utils/filters'
import _ from 'lodash'
import * as echarts from 'echarts'
const dotList = [
  {
    color: 'rgba(0, 216, 135, 1)',
    width: '24px',
    dec: '50-60分钟'
  },
  {
    color: 'rgba(0, 216, 135, 1)',
    width: '16px',
    dec: '40-50分钟'
  },
  {
    color: 'rgba(0, 216, 135, 1)',
    width: '12px',
    dec: '30-40分钟'
  },
  {
    color: 'rgba( 47, 137, 207, 1)',
    width: '24px',
    dec: '20-30分钟'
  },
  {
    color: 'rgba( 47, 137, 207, 1)',
    width: '16px',
    dec: '10-20分钟'
  },
  {
    color: 'rgba( 47, 137, 207, 1)',
    width: '12px',
    dec: '0-10分钟'
  }
]
export default {
  name: 'WorkAndRestDetail',
  components: {
    Loading
  },
  props: {
    placeData: Object,
    scatterData: Array,
    startTime: [Array, String],
    endTime: [Array, String]
  },

  data () {
    return {
      dotList: Object.freeze(dotList),
      isLoading: false,
      chart1: null
    }
  },

  watch: {
    scatterData: {
      handler () {
        this.$nextTick(() => {
          this.initDayData(this.scatterData)
        })
      },
      deep: true,
      immediate: true
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.chart1 && this.chartResize()
    })
  },

  methods: {
    initDayData (list) {
      this.chart1 = new Xcharts('chart1', 'scatter', {
        tooltip: {
          trigger: 'item',
          formatter: function (v) {
            const { data } = v
            const sHour = parseInt(data[1].split(':')[0]) + 1
            const eHour = sHour < 10 ? '0' + sHour + ':00' : sHour + ':00'

            return `
               <div>${data[0]} ${data[1] + ' - ' + eHour}</div>
               <div>出现时间：${data[2]}（分钟）</div>
           `
          }
        },
        xAxis: {
          scaleX: true,
          data: this.creatXAxis(this.startTime, this.endTime),
          axisLine:{
            show:true,
            lineStyle:{
              color:['#353f51']
            }
          },
          splitLine:{
            show:true,
            lineStyle:{
              color:['#353f51']
            }
          }
        },
        yAxis: {
          scaleY: true,
          data: this.creatYAxis(),
          axisLine:{
            show:true,
            lineStyle:{
              color:['#353f51']
            }
          },
          splitLine:{
            show:true,
            lineStyle:{
              color:['#353f51']
            }
          }
        },
        // axisTick:{
        //   lineStyle:{
        //     color:'red'
        //   }
        // },
        series: [
          {
            type: 'effectScatter',
            symbolSize: function (data) {
              if (data[2] >= 50 || (data[2] > 20 && data[2] <= 30)) {
                return 16
              }

              if (data[2] > 40 || (data[2] > 10 && data[2] <= 20)) {
                return 12
              }

              if (data[2] > 30 || (data[2] > 0 && data[2] <= 10)) {
                return 8
              }

              return 0
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(216, 135, 0.5)',
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  /* eslint-enable */
                  { offset: 0, color: 'rgba(0, 216, 135, 1)' },
                  { offset: 1, color: 'rgba(0, 216, 135, .7)' }
                ])
              }
            }
          },
          {
            type: 'effectScatter',
            symbolSize: function (data) {
              if (data[2] >= 50 || (data[2] > 20 && data[2] <= 30)) {
                return 16
              }

              if (data[2] > 40 || (data[2] > 10 && data[2] <= 20)) {
                return 12
              }

              if (data[2] > 30 || (data[2] > 0 && data[2] <= 10)) {
                return 8
              }
              return data[2]
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(47, 137, 207, 0.5)',
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  /* eslint-enable */
                  { offset: 0, color: 'rgba( 47, 137, 207, 1)' },
                  { offset: 1, color: 'rgba(47, 137, 207, .7)' }
                ])
              }
            }
          }
        ],
        legend: {
          textStyle: {
            color: '#c0d0e7'
          }
        }
      }).setData({
        legendData: ['', ''],
        rows: list
      })
    },

    // 生成y轴，24小时
    creatYAxis () {
      let list = []
      for (let i = 1; i < 24; i++) {
        const h = i < 10 ? '0' + i + ':00' : i + ':00'
        list.push(h)
      }
      return list
    },

    // 生成X轴 日期
    creatXAxis (sTimestamp, eTimestamp) {
      let stime = dayjs.formatDate(sTimestamp, 'YYYY-MM-DD')
      let etime = dayjs.formatDate(eTimestamp, 'YYYY-MM-DD')
      //初始化日期列表，数组
      var diffdate = new Array()
      var i = 0
      //开始日期小于等于结束日期,并循环
      while (stime <= etime) {
        diffdate[i] = stime
        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime()
        //增加一天时间戳后的日期
        var next_date = stime_ts + 24 * 60 * 60 * 1000
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear() + '-'
        var next_dates_m =
          new Date(next_date).getMonth() + 1 < 10
            ? '0' + (new Date(next_date).getMonth() + 1) + '-'
            : new Date(next_date).getMonth() + 1 + '-'
        var next_dates_d =
          new Date(next_date).getDate() < 10
            ? '0' + new Date(next_date).getDate()
            : new Date(next_date).getDate()

        stime = next_dates_y + next_dates_m + next_dates_d

        //增加数组key
        i++
      }
      return diffdate
    },

    chartResize () {
      this.handlerResize = _.debounce(() => {
        this.chart1.chart && this.chart1.chart.resize()
      })
      window.addEventListener('resize', this.handlerResize)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.handlerResize)

        this.chart1.chart && this.chart1.chart.dispose()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.WorkAndRestDetail {
  height: calc(100vh - 320px);
  .placeData {
    display: flex;
    padding: 18px 0;
    font-size: 16px;
    color: var(--base-text-color-1);
    .placeDatai-item {
      margin-right: 40px;
      &:last-child {
        margin-right: 0px;
      }
      .placeDatai-item-key {
        color: var(--base-text-color-to-999999);
      }
    }
  }
  .dot-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--base-text-color-to-999999);
    .dot-list-item {
      display: flex;
      align-items: center;
      margin-right: 16px;
      .dot {
        margin-right: 8px;
        border-radius: 50%;
      }
    }
  }
}
</style>
