import dayjs from '@/utils/filters'
import { addWithMaxDecimal } from '@/utils/index'

function formatPx (num) {
  return num * document.documentElement.style.fontSize.split('px')[0] / 192
}

// 获取图表--折线、柱状图配置
function getLineBarConfig (isUpdate, bgColor, updateValue = {}, listData = [], fieldList = []) {
  let config = {
    x: updateValue.x || null, // X轴
    y: updateValue.y || null, // Y轴
    warningValue: updateValue.warningValue || null, // 警戒值
    darkLightMode: 'dark',
    backgroundColor: bgColor, // 图表背景色
    barDirection: updateValue.barDirection || 'portrait',
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    grid: {
      top: '15%',
      left: '1%',
      right: '1%',
      bottom: '0%'
    },
    legendStyle: { // 图例样式
      show: isUpdate ? (updateValue.legendShow ? true : false) : true,
      fontSize: 12,
      color: '--base-text-color-1',
      top: '4%',
      type: 'scroll', // plain/scroll
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    dataZoomStyle: {
      show: true,
      type: 'inside', // inside/slider
    },
    xAxisStyle: {
      fontSize: 12,
      color: '--base-text-color-to-999999',
      min: updateValue.xMin || null,
      max: updateValue.xMax || null,
      data: null // x轴字段
    },
    yAxisStyle: {
      position: 'left',
      fontSize: 12,
      color: '--base-text-color-to-999999',
      splitLineType: 'dashed', // solid/dashed/dotted
      splitLineColor: 'rgba(101, 116, 148, 0.24)',
      min: updateValue.yMin || null,
      max: updateValue.yMax || null,
      data: null // x轴字段
    },
    chartData: []
  }
  if (isUpdate && listData.length) {
    let category = 'x'
    let value = 'y'
    let configCategory = 'xAxisStyle'
    if (config.barDirection === 'crosswise') {
      category = 'y'
      value = 'x'
      configCategory = 'yAxisStyle'
    }
    updateValue[category] && (config[configCategory].data = listData.map(item => item[updateValue[category]]))
    updateValue[value] && updateValue[value].forEach(item => {
      const findItem = fieldList.find(field => field.fieldNameEn === item)
      const name = findItem ? findItem.fieldNameCn : item
      config.chartData.push({
        name,
        data: listData.map(info => info[item])
      })
    })
  }
  return config
}

// 获取图表--饼图配置
function getPieConfig (isUpdate, bgColor, updateValue = {}, listData = []) {
  let config = {
    proportionParam: updateValue.labelField || '',
    proportionValue: updateValue.valueField || '',
    darkLightMode: 'dark',
    // pieType: updateValue.pieType,
    pieType: updateValue.pieType || 'pie',
    backgroundColor: bgColor, // 图表背景色
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    legendStyle: { // 图例样式
      show: isUpdate ? (updateValue.legendShow ? true : false) : true,
      fontSize: 12,
      color: '--base-text-color-1',
      top: '7%',
      type: 'scroll', // plain/scroll
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    seriesStyle: {
      radius: updateValue.seriesRadius, // updateValue.pieType
      roseType: updateValue.seriesRoseType, // 玫瑰'radius'
      labelShow: isUpdate ? (updateValue.labelShow ? true : false) : true,
      labelPosition: updateValue.labelPosition || 'outside', // outside/inside/center
      labelFormatter: updateValue.labelFormatter || '{b}'
    },
    chartData: []
  }
  if (config.pieType === 'radius') {
    config.seriesStyle.roseType = 'radius'
    config.radius = '70%'
  } else {
    config.seriesStyle.roseType = ''
    config.radius = '70%'
  }
  if (isUpdate && listData.length && config.proportionParam && config.proportionValue) {
    listData.forEach(item => {
      config.chartData.push({
        name: item[config.proportionParam],
        value: item[config.proportionValue]
      })
    })
  }
  return config
}

// 获取图表--echarts地图分布配置
function getMapConfig (isUpdate, bgColor, updateValue = {}, listData = []) {
  let config = {
    province: updateValue.province || '山东', // 省份
    registerMapName: updateValue.registerMapName || 'wh',
    zoneParam: updateValue.zoneParam || '', // 区划字段
    valueParam: updateValue.valueParam || '', // 值字段
    darkLightMode: 'dark',
    backgroundColor: bgColor, // 图表背景色
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    visualMapStyle: {
      min: updateValue.min || 0,
      max: updateValue.max || 10000
    },
    seriesStyle: {
      labelShow: false,
      // labelFormatter: '{b}'
    },
    chartData: []
  }
  if (isUpdate && listData.length && config.zoneParam && config.valueParam) {
    listData.forEach(item => {
      config.chartData.push({
        name: item[config.zoneParam],
        value: item[config.valueParam],
        zoneFieldEn: config.zoneParam
      })
    })
  }
  return config
}

// 获取图表--轨迹图配置
function getMapTrackConfig (isUpdate, updateValue = {}, listData = []) {
  let config = {
    form: {
      chartTitle: isUpdate ? updateValue.titleText : '',
      longitudeParam: isUpdate ? updateValue.longitudeParam : '',
      latitudeParam: isUpdate ? updateValue.latitudeParam : '',
      isShowTitle: isUpdate ? (updateValue.isShowTitle ? true : false) : true,
      popParam: isUpdate ? updateValue.popParam : ''
    },
    tracksList: []
  }
  if (isUpdate && listData.length && config.form.longitudeParam && config.form.latitudeParam) {
    let lng = config.form.longitudeParam
    let lat = config.form.latitudeParam
    let popParam = config.form.popParam
    listData.forEach(item => {
      config.tracksList.push({
        latitude: item[lat],
        longitude: item[lng],
        location: [item[lng], item[lat]],
        popParam: item[popParam]
      })
    })
  }
  return config
}

// 获取图表--漏斗图配置
function getFunnelConfig (isUpdate, bgColor, updateValue = {}, listData = []) {
  let config = {
    proportionParam: updateValue.labelField || '',
    proportionValue: updateValue.valueField || '',
    darkLightMode: 'dark',
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    legendStyle: { // 图例样式
      show: isUpdate ? (updateValue.legendShow ? true : false) : true,
      fontSize: 12,
      color: '--base-text-color-1',
      top: '10%',
      type: 'scroll', // plain/scroll
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    seriesStyle: {
      min: updateValue.min || null,
      max: updateValue.max || null,
      labelShow: isUpdate ? (updateValue.labelShow ? true : false) : true,
      labelPosition: updateValue.labelPosition || 'inside',
    },
    chartData: []
  }
  if (isUpdate && listData.length && config.proportionParam && config.proportionValue) {
    listData.forEach(item => {
      config.chartData.push({
        name: item[config.proportionParam],
        value: item[config.proportionValue]
      })
    })
  }
  return config
}

// 获取图表-仪表盘配置
function getGaugeConfig (isUpdate, bgColor, updateValue = {}, listData = []) {
  let config = {
    proportionValue: updateValue.valueField || '',
    darkLightMode: 'dark',
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    legendStyle: { // 图例样式
      show: isUpdate ? (updateValue.legendShow ? true : false) : true,
      fontSize: 12,
      color: '--base-text-color-1',
      top: '10%',
      type: 'scroll', // plain/scroll
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    seriesStyle: {
      axisLabel: { // 刻度
        show: isUpdate ? (updateValue.axisLabelShow ? true : false) : true,
      },
      name: updateValue.name || null,
      min: updateValue.min || null,
      max: updateValue.max || null,
    },
    chartData: []
  }
  if (isUpdate && listData.length && config.proportionValue) {
    let numArr = []
    listData.forEach(item => {
      numArr.push(Number(item[config.proportionValue]))
    })
    let sum = addWithMaxDecimal(numArr)
    if (!isNaN(sum)) {
      config.chartData.push({
        name: config.seriesStyle.name,
        value: sum
      })
    }
  }
  return config
}

// 获取图表-词云图配置
function getWordcloudConfig (isUpdate, bgColor, updateValue = {}, listData = []) {
  let config = {
    proportionParam: isUpdate ? updateValue.labelField : '',
    proportionValue: isUpdate ? updateValue.valueField : '',
    darkLightMode: 'dark',
    titleStyle: { // 图表标题样式
      show: isUpdate ? (updateValue.titleShow ? true : false) : true,
      text: updateValue.titleText || '',
      fontSize: 14,
      color: '--base-text-color-1'
    },
    tooltipStyle: {
      fontSize: 12,
      color: '--base-text-color-1',
      backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
    },
    seriesStyle: {
      // axisLabel: { // 刻度
      //   show: isUpdate ? updateValue.axisLabelShow : true
      // },
      fontWeight: updateValue.fontWeight || 'normal',
      min: updateValue.min || 10,
      max: updateValue.max || 20,
    },
    chartData: []
  }
  if (isUpdate && listData.length && config.proportionParam && config.proportionValue) {
    listData.forEach(item => {
      config.chartData.push({
        name: item[config.proportionParam],
        value: item[config.proportionValue]
      })
    })
  }
  return config
}

export function getChartConfig (chartType, isUpdate, bgColor, updateValue = {}, listData = [], fieldList = []) {
  if (chartType === 'LineConfigChart' || chartType === 'BarConfigChart') {
    return getLineBarConfig(isUpdate, bgColor, updateValue, listData, fieldList)
  } else if (chartType === 'PieConfigChart') {
    return getPieConfig(isUpdate, bgColor, updateValue, listData)
  } else if (chartType === 'MapConfigChart') {
    return getMapConfig(isUpdate, bgColor, updateValue, listData)
  } else if (chartType === 'TrackConfigChart') {
    return getMapTrackConfig(isUpdate, updateValue, listData)
  } else if (chartType === 'FunnelConfigChart') {
    return getFunnelConfig(isUpdate, bgColor, updateValue, listData)
  } else if (chartType === 'GaugeConfigChart') {
    return getGaugeConfig(isUpdate, bgColor, updateValue, listData)
  } else if (chartType === 'WordcloudConfigChart') {
    return getWordcloudConfig(isUpdate, bgColor, updateValue, listData)
  }
}

// 结果字段计算宽度
export function countFieldWidth (list) {
  const size = formatPx(16)
  const fontSize = size < 12 ? 12 : size
  list.forEach(item => {
    let ele = document.createElement('span')
    ele.style.display = 'inline-block'
    ele.style.fontSize = `${fontSize}px`
    ele.innerText = `${item.fieldNameCn}`
    document.body.appendChild(ele)
    item.fieldWidth = ele.clientWidth
    document.body.removeChild(ele)
  })
  return list
}

// 结果字段排序
export function fieldSort (list) {
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].fieldSort > list[j].fieldSort) {
        let middle = list[j]
        list[j] = list[i]
        list[i] = middle
      }
    }
  }
  return list
}

// 格式化时间类型
export function formatTime (time) {
  if (!time) return '--'
  const result = dayjs.filtertoS(time)
  return result !== 'Invalid Date' ? result : time
}

// 将url参数转成对象
export function formatUrlParams (url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] =
      value === 'true' ? true : value === 'false' ? false : value
  }
  return params
}

// 格式化决策树算法的数据
// export function formatBinaryTreeData (info) {
//   let result = {
//     nodes: [
//       { id: 'root', label: '' }
//     ],
//     edges: []
//   }
//   let formatInfo = {
//     ...info,
//     parentId: 'root',
//     way: 'root'
//   }
//   let leftId = 0
//   let rightId = 0
//   const recursionFun = (obj, id) => {
//     const leftNodeId = `${obj.way}_left_${id}`
//     const rightNodeId = `${obj.way}_right_${id}`
//     result.nodes.push({ id: leftNodeId, label: obj['left_value'] })
//     result.nodes.push({ id: rightNodeId, label: obj['right_value'] })
//     result.edges.push({ source: obj.parentId, target: leftNodeId, label: obj['left_condition'] })
//     result.edges.push({ source: obj.parentId, target: rightNodeId, label: obj['right_condition'] })
//     if (obj['left_node']) {
//       leftId++
//       recursionFun(
//         {
//           ...obj['left_node'],
//           parentId: leftNodeId,
//           way: 'left'
//         },
//         leftId
//       )
//     }
//     if (obj['right_node']) {
//       rightId++
//       recursionFun(
//         {
//           ...obj['right_node'],
//           parentId: rightNodeId,
//           way: 'right'
//         },
//         rightId
//       )
//     }
//   }
//   recursionFun(formatInfo, 0)
//   return result
// }

// 格式化二叉树数据
export function formatBinaryTreeData (info) {
  let result = {
    nodes: [],
    edges: []
  }
  info.forEach((item, index) => {
    result.nodes.push({
      id: `root${index}`,
      label: ''
    })
    let formatInfo = {
      ...item,
      parentId: `root${index}`,
      way: `root${index}`,
      root: `root${index}`
    }
    let leftId = 0
    let rightId = 0
    const recursionFun = (obj, id) => {
      const leftNodeId = `${obj.root}_${obj.way}_left_${id}`
      const rightNodeId = `${obj.root}_${obj.way}_right_${id}`
      result.nodes.push({ id: leftNodeId, label: obj['left_value'] })
      result.nodes.push({ id: rightNodeId, label: obj['right_value'] })
      result.edges.push({ source: obj.parentId, target: leftNodeId, label: obj['left_condition'] })
      result.edges.push({ source: obj.parentId, target: rightNodeId, label: obj['right_condition'] })
      if (obj['left_node']) {
        leftId++
        recursionFun(
          {
            ...obj['left_node'],
            parentId: leftNodeId,
            way: 'left',
            root: `root${index}`
          },
          leftId
        )
      }
      if (obj['right_node']) {
        rightId++
        recursionFun(
          {
            ...obj['right_node'],
            parentId: rightNodeId,
            way: 'right',
            root: `root${index}`
          },
          rightId
        )
      }
    }
    recursionFun(formatInfo, 0)
  })
  return result
}

// 应用图标数据
export const ICON_INFO = [
  'icon-daohang',
  'icon-youkachongzhi',
  'icon-xinchebaojia',
  'icon-fakuandaijiao',
  'icon-weixiu',
  'icon-weixianhuaxuepin',
  'icon-zizhuxiche',
  'icon-a-zu6175',
  'icon-a-zu6172',
  'icon-a-zu6186',
  'icon-a-zu6184',
  'icon-a-zu6181',
  'icon-a-zu6185',
  'icon-a-zu6187',
  'icon-a-zu6179',
  'icon-goumai',
  'icon-a-zu6180',
  'icon-a-zu6174',
  'icon-a-zu6173',
  'icon-a-zu6188',
  'icon-a-zu6192',
  'icon-a-zu6176',
  'icon-a-zu6198',
  'icon-a-zu6189',
  'icon-a-zu6177',
  'icon-a-zu6197',
  'icon-a-zu6183',
  'icon-a-zu6178',
  'icon-a-zu6199',
  'icon-a-zu6182',
  'icon-a-zu6193',
  'icon-a-zu6204',
  'icon-a-zu6190',
  'icon-a-zu6191',
  'icon-a-zu6221',
  'icon-a-zu6205',
  'icon-a-zu6208',
  'icon-a-zu6202',
  'icon-a-zu6194',
  'icon-zuobaoyang',
  'icon-a-zu6220',
  'icon-a-zu6212',
  'icon-a-zu6217',
  'icon-a-zu6207',
  'icon-a-zu6195',
  'icon-a-zu6200',
  'icon-a-zu6209',
  'icon-a-zu6213',
  'icon-a-zu6216',
  'icon-a-zu6211',
  'icon-a-zu6219',
  'icon-a-zu6201',
  'icon-a-zu6206',
  'icon-a-zu6215',
  'icon-a-zu6224',
  'icon-a-zu6210',
  'icon-a-zu6214',
  'icon-a-zu6218',
  'icon-a-zu6223',
  'icon-a-zu6011',
  'icon-a-zu6013',
  'icon-a-zu6015',
  'icon-linqu_kakou',
  'icon-jiudianzhusu',
  'icon-jingshenbing',
  'icon-matou',
  'icon-yinhangka1',
  'icon-zhihuijiaotong',
  'icon-yulechangsuo',
  'icon-weixiancheliangjiance',
  'icon-yundong',
  'icon-zhibanbiao',
  'icon-zhihuixiaofangshuan',
  'icon-lvyoudujia',
  'icon-tingchechang',
  'icon-jiaoyi',
  'icon-a-zu6130',
  'icon-yikaduoji',
  'icon-shikongguiji1',
  'icon-juzhongxidu',
  'icon-shehuangfenxi',
  'icon-juzhongdubo',
  'icon-tonghangfenxi1',
  'icon-jujifenxi',
  'icon-a-zu4880',
  'icon-tupiansousuo1',
  'icon-bumenguanli',
  'icon-huizongjieguo',
  'icon-shebeiguanli',
  'icon-gangaotonghangzheng',
  'icon-lvyeshuju',
  'icon-renlianzhuapai',
  'icon-tanzhenshuju',
  'icon-shouji',
  'icon-a-zu5999',
  'icon-a-zu6000',
  'icon-a-zu6001',
  'icon-a-zu6003',
  'icon-a-zu6004',
  'icon-a-zu6005',
  'icon-a-zu6007',
  'icon-a-zu6009',
  'icon-a-zu6016',
  'icon-a-zu6017',
  'icon-a-zu6019',
]
