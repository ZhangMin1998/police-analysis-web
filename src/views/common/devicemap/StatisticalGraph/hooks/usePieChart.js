import { onMounted, watch } from '@vue/composition-api'
import * as echarts from 'echarts'

const ALL_COLOR = '#20b0f4'
const ONLINE_COLOR = '#00fdd8'
const EMPTY_COLOR = '#fefefe'

export default function usePieChart (box, countRate) {
  let myChart
  const renderData = (data = [{ value: 0, name: '总数', itemStyle: { color: ALL_COLOR } }]) => {
    myChart?.setOption({
      series: [{
        name: '饼图',
        type: 'pie',
        radius: ['60%', '70%'],
        avoidLabelOverlap: false,
        startAngle: 305,
        label: {
          show: false,
          position: 'center',
          color: '#00fdd8',
          fontSize: 32,
          formatter: (obj) => {
            return parseInt(obj.percent) + '%'
          }
        },
        data
      }]
    })
  }

  const initView = () => {
    const dom = document.getElementById(box)
    if (!dom) return;
    myChart = echarts.init(dom)
  }

  const formatData = (data) => {
    const res = []
    if (data.total == 0) {
      res.push({
        value: 0,
        name: '总数',
        itemStyle: {
          color: EMPTY_COLOR
        }
      })
      return res
    }
    res.push({
      value: data.onlineTotal,
      name: '总数',
      itemStyle: {
        color: ONLINE_COLOR
      }
    })

    res.push({
      value: data.total - data.onlineTotal,
      name: ' 在线',
      itemStyle: {
        color: ALL_COLOR
      }
    })
    return res
  }

  watch(countRate, (val) => {
    const chartData = formatData(val)
    renderData(chartData)
  })

  onMounted(() => {
    initView()
    renderData()
  })
}
