// const POS_LIST = [
//   [112.461577, 23.0727397], // 端州
//   [112.1670081449508, 29.421728664893582], // 安乡
//   [122.18084919894184, 37.42584439475032], // 威海
// ]

// const { _isOl } = require('@/config/user.js')

// const TITLE_LIST = [
//   '端州大数据实战平台',
//   '安乡大数据实战平台',
//   '威海数据实战平台',
//   '大数据实战平台',
// ]

// const search_city = ['肇庆', '常德', '威海']

// const judgeOnline = () => {
//   let olFlag = sessionStorage.getItem('isOl')
//   if ([true, 'true'].includes(olFlag)) {
//     return true
//   } else {
//     return false
//   }
// }

// let config = {
//   zoom: localStorage.getItem('zoom') || 13, // 默认缩放级别
//   zooms: [11, 20], // 缩放级别范围
//   centrePos: localStorage.getItem('centrePos')
//     ? JSON.parse(localStorage.getItem('centrePos'))
//     : POS_LIST[0], // 定位中心
//   baseUrl: '',
//   routeUrl: '',
//   geoserverUrl: '',
//   title: localStorage.getItem('title') || TITLE_LIST[0],
//   mapUrl: '/geoserver/china_pbf_e/wms',
//   leftMenuIcon: 'icon-0-person.png',
//   searchCity: localStorage.getItem('searchCity') || search_city[0],
//   headerList: [[], []],
//   isAdmin: true,
//   privateKeyStr: 'jiamikey',
//   isOl: judgeOnline() || false,
//   optionsTypes: ['mac', 'ip_addr', 'imsi', 'imei', 'mobile'],
// }

// if (!_isOl()) {
//   config.optionsTypes = ['mac', 'ip_addr', 'imsi', 'imei', 'mobile']
// }

// function set_config(key, val) {
//   if (key) {
//     sessionStorage.setItem(key, val)
//     if (key == 'centrePos') {
//       config[key] = JSON.parse(val)
//     } else {
//       config[key] = val
//     }
//   }
// }

// exports.set_config = set_config
// exports.config = config
let config = {
  dependBackendRouter: true // 提交代码要改成true
}
const keepAliveInclude = [
  'offlineDevicemap',
  'SuperSearch',
  'superSearchDetail',
  'ImageSearch',
  // 'ImageSearchDetail',
  'DataSearch',
  'Deduction',
  'SpaceRound',
  'WorkAndRest',
  'PeerAnalysis',
  'SpaceTimeCollision'
]

const MAP_INFO = {
  肇庆: {
    searchExtent: [24.24, 112.52, 22.47, 111.21],
    mapExtent: [111.357, 22.772, 112.878, 24.392],
    mapTilesPathName: 'mapTileZQ'
  },
  安乡: {
    searchExtent: [29.46, 112.18, 29.08, 110.59],
    mapExtent: [110.487, 28.408, 112.301, 30.129],
    mapTilesPathName: 'mapTileCD'
  },
  威海: {
    searchExtent: [37.35, 122.42, 36.41, 121.11],
    mapExtent: [120.807037, 36.639774, 123.075714, 37.610968],
    mapTilesPathName: 'mapTileWH'
  },
  荣成: {
    searchExtent: [38.27, 123.42, 35.45, 121.08],
    mapExtent: [120.807037, 36.639774, 123.075714, 37.610968],
    mapTilesPathName: 'mapTileWH'
  },
}

export default config

export const kInclude = keepAliveInclude

export const mapInfo = MAP_INFO
