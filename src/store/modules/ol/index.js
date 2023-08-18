const { _pos } = require('@/config/user.js')

const state = {
  oMap: null, // 当前地图实例
  oMap1: null, // 当前地图实例
  oMapView: null, // 地图View
  zoom: 13,
  zooms: [12, 21],
  // mapCenter: [112.461577, 23.0727397], // 初始化中心
  // locationCenter: [112.484358, 23.05735], // 定位中心
  locationCenter: [122.18084919894184, 37.42584439475032], // 定位中心
  mapCenter: [122.18084919894184, 37.42584439475032],
  imgMap: {
    // 设备图标
    '1': 'icon-tab-small-1.png',
    '11': 'icon-tab-small-1-g.png',
    '2': 'icon-tab-small-2.png',
    '22': 'icon-tab-small-2-g.png',
    '3': 'icon-tab-small-3.png',
    '33': 'icon-tab-small-3-g.png',
    '4': 'icon-tab-small-4.png',
    '44': 'icon-tab-small-4-g.png',
    '5': 'icon-tab-small-5.png',
    '55': 'icon-tab-small-5-g.png',
    '6': 'icon-tab-small-6.png',
    '66': 'icon-tab-small-6-g.png',
    '7': 'icon-tab-small-7.png',
    '77': 'icon-tab-small-7-g.png',
    '8': 'icon-tab-small-8.png',
    '88': 'icon-tab-small-8-g.png',
    '9': 'icon-tab-small-9.png',
    '99': 'icon-tab-small-9-g.png',
  },
  searchShowObj: {
    flag: false,
    content: '',
    pos: [],
  },
  deviceFeatures: [], // 设备列表 features
}

const mutations = {
  // 改过地图显示级别
  setZoom (state, zoom) {
    state.zoom = zoom
  },
  setSearchObj (state, obj) {
    state.searchShowObj.flag = obj.flag
    state.searchShowObj.content = obj.name
    state.searchShowObj.pos = _pos(obj.longitude, obj.latitude)
  },
  setLocationCenter (state, positionArr) {
    state.mapCenter = positionArr
  },
}

const getters = {}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
