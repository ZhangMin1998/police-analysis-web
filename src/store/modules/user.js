import warterMark from "@/utils/waterMark"
const state = {
  isAdmin: false, // 是否是超管
  userInfo:{},
  // originZoom: 13,
  zoom: 13,
  zooms: [11, 20],
  isOl: false, // 在线还是离线
  centrePos: [], // 中心点
  title: '', // 系统标题
  searchCity: '', // 搜索城市
  privateKeyStr: 'jiamikey',
  mapUrl: '/geoserver/wms',
  baseUrl: '',
  headerList: [],
  // leftMenuIcon: 'icon-0-person.png',
  routeUrl: '',
  geoserverUrl: '',
  imagePrefix: '',
  faceBase64: null,
  optList: [], // 下拉菜单配置
  cooSystem: '', // 坐标系
  theme: '',
  statStage: '',
  dataManageIsEdit:'',
  dataManageTagIsEdit:'',
  fuzzySearch:'',
  loginTitle:'',
  loginVersion:'',
  loginCity:'',
  loginMap:'',
  rongChengMapUrl:'',
  loginSettings:[],
  globalSettings:[],
  tianMapInfo: {}, // 天地图显示范围和瓦片文件名
  isMaintain: null,
  maintainDesc:'',
  maintainTime:''
}

const getter = {
  online: state => [true, 'true'].includes(state.isOl),
}

const mutations = {
  // 设置天地图显示范围和瓦片文件名
  setTianMapInfo (state, obj) {
    state.tianMapInfo = obj
  },
  setSysConfig (state, obj) {
    for (const key in obj) {
      state[key] = obj[key]
    }
  },
  setLoginSettings (state, data) {
    state.loginSettings = data
  },
  setGlobalSettings (state, data) {
    state.globalSettings = data
  },
  setTheme (state, data) {
    state.theme = data
  },
  obtainHeaderList (state, list) {
    state.headerList = list
  },
  setZoom (state, val) {
    state.zoom = val
  },
  setFaceBase64 (state, val) {
    state.faceBase64 = val
  },
  setUserInfo (state, val) {
    state.userInfo = val
  },
  // 设置系统水印
  setWaterMarker (state){
    const personInfo = state.userInfo.realName + ' ' + state.userInfo.jobNumber
    warterMark.set(personInfo)
  }
}

export default {
  namespaced: true,
  state,
  getter,
  mutations,
}
