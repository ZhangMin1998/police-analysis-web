import { onMounted, watch } from '@vue/composition-api'
import * as echarts from "echarts"
import { useStore } from '@/store'

// 场所类型
const SITE_LEGEND = ['离线场所', '离线设备', '在线场所', '在线设备']
// 设备类型
const DEVICE_LEGEND = ['离线设备', '在线设备']

// 高亮
const emphasisStyle = { itemStyle: { shadowblur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }

const BASE_STYLE = {
  borderRadius: [20, 20, 0, 0]
}

// 柱子样子
const ITEM_STYLE_1 = {
  ...BASE_STYLE,
  color: '#266b95',
}

const ITEM_STYLE_2 = {
  color: '#20b7fe',
}
const ITEM_STYLE_3 = {
  ...BASE_STYLE,
  color: '#6046a2',
}
const ITEM_STYLE_4 = {
  color: '#9355f4',
}

// 类型映射表
const legendMap = {
  'site': SITE_LEGEND,
  'device': DEVICE_LEGEND,
  'vendor': SITE_LEGEND
}

const keyMap = {
  'site': 'placeType',
  'device': 'deviceType',
  'vendor': 'factoryType'
}

function findIndex (list, type, targetType) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][targetType] == type) return i
  }
  return -1
}

export default function useChart (tabType) {
  const store = useStore()
  const deviceTypeListMap = store.getters['Dict/deviceTypeListMap']
  const siteTypeListMap = store.getters['Dict/siteTypeListMap']

  const xAxisMap = {
    'site': siteTypeListMap,
    'device': deviceTypeListMap
  }

  const boxId = 'category'
  let myChart;

  const initView = () => {
    const chartDom = document.getElementById(boxId)
    myChart = echarts.init(chartDom)
    setChartOption([])
  }

  const setChartOption = (data = []) => {
    myChart?.setOption({
      grid: {
        left: '4%',
        right: '2%'
      },
      legend: {
        data: legendMap[tabType.value],
        right: "5%",
        textStyle: {
          color: '#C0D0E7'
        }
      },
      tooltip: {},
      barWidth: '20%',
      xAxis: {
        data: Object.values(xAxisMap[tabType.value]),
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: -15,
          textStyle: {
            color: '#8799BF'
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#8799BF', //左边线的颜色
            width: '1' //坐标线的宽度
          }
        },

      },
      yAxis: {
        name: '数量',
        nameTextStyle:{
          color:"#8799BF",
          fontSize:12,
      },

        axisLabel: {
          textStyle: {
            color: '#8799BF'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#4b566b',
            type: 'dashed'
          }
        },
      },
      series: formatChartDat(data),
    }, true)
  }

  // 这里有个坑，确保 data 和 类型的长度是一致的
  const formatChartDat = (data) => {
    if (data.length === 0) return []
    const res = []
    const data1 = []
    const data2 = []
    const data3 = []
    const data4 = []
    const type = 'bar'

    const list = xAxisMap[tabType.value]

    const curKey = keyMap[tabType.value]

    for (const item of Object.entries(list)) {
      const idx = findIndex(data, item[0], curKey)
      if (idx === -1) {
        data1.push(0)
        data2.push(0)
        data3.push(0)
        data4.push(0)
      } else {
        const curData = data[idx]
        data1.push(curData['placeAllTotal'] - curData['placeOnlineTotal'])
        data2.push(curData['placeOnlineTotal'])
        data3.push(curData['deviceAllTotal'] - curData['deviceOnlineTotal'])
        data4.push(curData['deviceOnlineTotal'])
      }
    }

    const spanStyle = (color) => {
      return `display:inline-block;width:12px;height:12px;background-color:${color};margin-right:8px;border-radius:50%;`
    }

    const data1ToolFn = {
      formatter: (obj) => {
        const { dataIndex, name, value } = obj
        const count = data2[dataIndex] + data1[dataIndex]
        return `
          <div>${name}场所（ ${count} ）</div>
          <div><span style="${spanStyle('#266b95')}"></span>离线  ${count - value}</div>
          <div><span style="${spanStyle('#20b7fe')}"></span>在线  ${value}</div>
        `
      }
    }

    const data2ToolFn = {
      formatter: (obj) => {
        const { dataIndex, name, value } = obj
        const count = data2[dataIndex] + data1[dataIndex]
        return `
        <div>${name}场所（ ${count} ）</div>
        <div><span style="${spanStyle('#266b95')}"></span>离线  ${value}</div>
        <div><span style="${spanStyle('#20b7fe')}"></span>在线  ${count - value}</div>
        `
      }
    }

    const data3ToolFn = {
      formatter: (obj) => {
        const { dataIndex, name, value } = obj
        const count = data4[dataIndex] + data3[dataIndex]
        return `
        <div>${name}设备（ ${count} ）</div>
        <div><span style="${spanStyle('#6046a2')}"></span>离线  ${count - value}</div>
        <div><span style="${spanStyle('#9355f4')}"></span>在线  ${value}</div>
        `
      }
    }

    const data4ToolFn = {
      formatter: (obj) => {
        const { dataIndex, name, value } = obj
        const count = data4[dataIndex] + data3[dataIndex]
        return `
        <div>${name}设备（ ${count} ）</div>
        <div><span style="${spanStyle('#6046a2')}""></span>离线  ${value}</div>
        <div><span style="${spanStyle('#9355f4')}"></span>在线  ${count - value}</div>
        `
      }
    }

    const tooltipStyle = {
      backgroundColor: '#445069',
      textStyle: {
        color: '#C0D0E7', //文字颜色
        fontSize: 14
      }, //文本样式
      padding: 8,
      align: 'left',
    }

    res.push({ type, name: '在线场所', stack: 'one', data: data2, itemStyle: ITEM_STYLE_2, emphasis: emphasisStyle, tooltip: { ...data1ToolFn, ...tooltipStyle } })
    res.push({ type, name: '离线场所', stack: 'one', data: data1, itemStyle: ITEM_STYLE_1, emphasis: emphasisStyle, tooltip: { ...data2ToolFn, ...tooltipStyle } })
    res.push({ type, name: '在线设备', stack: 'two', data: data4, itemStyle: ITEM_STYLE_4, emphasis: emphasisStyle, tooltip: { ...data3ToolFn, ...tooltipStyle } })
    res.push({ type, name: '离线设备', stack: 'two', data: data3, itemStyle: ITEM_STYLE_3, emphasis: emphasisStyle, tooltip: { ...data4ToolFn, ...tooltipStyle } })
    return res
  }

  watch(tabType, () => {
    setChartOption()
  })

  onMounted(() => {
    initView()
  })

  return { setChartOption };
}
