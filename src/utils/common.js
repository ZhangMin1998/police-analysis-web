
const deviceTypeList = [
  { url: 'icon-tab-big-1', text: '公共场所上网审计', value: 1 },
  { url: 'icon-tab-big-3', text: '室外WIFI探针', value: 3 },
  { url: 'icon-tab-big-4', text: '室外侦码采集', value: 4 },
  { url: 'icon-tab-big-5', text: '人脸识别摄像头', value: 5 },
  { url: 'icon-tab-big-6', text: '人脸门禁', value: 6 },
  { url: 'icon-tab-big-7', text: '车牌识别摄像头', value: 7 },
  { url: 'icon-tab-big-8', text: '身份证阅读器', value: 8 },
  { url: 'icon-tab-big-9', text: '其他', value: 9 }
]

// 设备类型
const iconMiniData = [
  { type: 'wifi', text: '公共场所上网审计', url: 'icon-tab-big-1.png' },
  { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-big-3.png' },
  { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-big-4.png' },
  { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-big-5.png' },
  { type: 'wifi', text: '人脸门禁', url: 'icon-tab-big-6.png' },
  { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-big-7.png' },
  { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-big-8.png' },
  { type: 'wifi', text: '其他', url: 'icon-tab-big-9.png' },
  { type: 'wifi', text: '复合图标', url: 'icon-tab-big-10.png' },
  { type: 'wifi', text: '场所', url: 'icon-tab-big-11.png' },
]
const iconMiniLightData = [
  { type: 'wifi', text: '公共场所上网审计', url: 'icon-tab-big-1-light.png' },
  { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-big-3-light.png' },
  { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-big-4-light.png' },
  { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-big-5-light.png' },
  { type: 'wifi', text: '人脸门禁', url: 'icon-tab-big-6-light.png' },
  { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-big-7-light.png' },
  { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-big-8-light.png' },
  { type: 'wifi', text: '其他', url: 'icon-tab-big-9-light.png' },
  { type: 'wifi', text: '复合图标', url: 'icon-tab-big-10-light.png' },
  { type: 'wifi', text: '场所', url: 'icon-tab-big-11-light.png' },
]

/**
 * 连续触发在最后一次执行方法，场景：输入框匹配
 * @param {*} fn
 * @param {*} time
 * @returns
 */
let debounce = (fn, delay = 300) => {
  let timeLock = null

  return function () {
    if (timeLock) {
      clearTimeout(timeLock)
    }
    timeLock = setTimeout(() => {
      fn.apply(this, arguments)
      timeLock = null
    }, delay)
  }
}

/**
 * 在一定时间内只触发一次，场景：长列表滚动节流
 * @param {*} fn
 * @param {*} time
 * @returns
 */
let throttle = (fn, delay = 100) => {
  let timer = null

  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}


module.exports = {
  debounce,
  throttle,
  deviceTypeList,
  iconMiniData,
  iconMiniLightData
}
