import Vue from 'vue'
import dayjs from '@/utils/filters'

const { _pos } = require('@/config/user.js')

import { getAllDevice, queryAllSitePlace, getPlaceDetail, getAllDeviceByLoction } from '@/api/equipMap'
// import { UtilHandleBigData } from '@/utils/index'

const state = {
  isCloseLable: false, //关闭点击设备/场所的信息窗体
  zoom: 14, //地图缩放级别
  zooms: [11, 20], //地图缩放范围
  mode: '列表模式',
  devicePopShow: false, //是否显示设备详情
  roomPopShow: false, //是否显示场所详情
  roomListData: [], //场所列表
  roomDetailData: [], //场所详情
  rootListChoose: [], // 场所选择
  currentRoomData: [], //当前点击场所
  placeCode: '', //设备code
  roomColumnList: [
    { label: '场所', minWidth: '10.25%', prop: 'placeName' },
    { label: '场所编码', minWidth: '13.48%', prop: 'placeCode' },
    // { label: '场所区域', width: '250', prop: '' }
    { label: '场所类型', minWidth: '9.7%', prop: 'placeType' },
    { label: '正常/总数', minWidth: '9.7%', prop: 'onlineTotal' },
    { label: '经度', minWidth: '6.47%', prop: 'longitude' },
    { label: '纬度', minWidth: '6.47%', prop: 'latitude' },
    { label: '场所详址', minWidth: '10.78%', prop: 'siteAddress' }
    // { label: '重点关注场所', width: '180', prop: '' }
  ], //场所详情每列数据
  currentDeviceDetail: {
    tableData: [],
    pageData: {
      pageSize: 5,
      total: 0,
      curPage: 1
    }
  }, //当前设备的详情数据
  originDeviceList: [], // 设备列表（不可变）
  noClickNav: true,
  roomDeviceList: [], //场所设备列表
  roomDeviceColumnList: [
    { label: '设备', minWidth: '9.41%', prop: 'deviceName' },
    { label: '设备类型', minWidth: '8.31%', prop: 'type' },
    // { label: '设备编码', minWidth: '200', prop: 'deviceNo' },
    { label: '状态', minWidth: '5.54%', prop: 'dataStatusName' },
    { label: 'MAC', minWidth: '11.07%', prop: 'deviceMac' },
    { label: '经度', minWidth: '6.64%', prop: 'longitude' },
    { label: '纬度', minWidth: '6.64%', prop: 'latitude' },
    { label: '更新时间', minWidth: '9.97%', prop: 'updateTime' },
    { label: '安装时间', minWidth: '9.97%', prop: 'createTime' },
    { label: '设备厂商', minWidth: '9.97%', prop: 'factory' }
  ], //场所中设备每列数据
  roomOverlayActiveIndex: -1, //当前点击的场所图标
  deviceTypeObj: {
    '1': '公共场所上网审计',
    '3': '室外WIFI探针',
    '4': '室外侦码采集',
    '5': '人脸识别摄像头',
    '6': '人脸门禁',
    '7': '车辆识别摄像头',
    '8': '身份证阅读器',
    '9': '其他'
  },
  deviceTypeNumObj: {
    'device_audit_type': '1',
    'device_outdoor_probe_type': '3',
    'device_outdoor_code_collect_type': '4',
    'device_face_recognition_type': '5',
    'device_face_entrance_guard_type': '6',
    'device_car_discern_type': '7',
    'device_id_card_reader_type': '8',
    'device_other_type': '9'
  },
  deviceIconShow: [true, true, true, true, true, true, true, true], //每种设备图标在地图是否显示
  deviceMarkers: [], //设备点聚合数组
  roomMarkers: [], //场所点聚合数组
  showDeviceOverlay: false, //是否显示设备图标
  isShowDevice: true, //当前是否显示设备类型,默认显示设备不显示场所
  showRoomOverlay: false, //是否显示场所图标
  placeDataClicked: {},
  deviceIdsClicked: []
}
// getters
const getters = {
  // 获取当前模式
  modeType (state) {
    return state.mode == '列表模式' ? 'Amap' : 'List'
  },
  activedRoomData (state) {
    return state.roomListData.filter(_c => _c.isActive)
  }
}
// actions
const actions = {
  // 获取场所列表
  getRoomList ({ commit }) {
    if (state.roomListData.length > 0) return
    return new Promise((resolve) => {
      queryAllSitePlace().then(res => {
        commit('getRoomListCallBackC', res)
        resolve(res)
        // res = res.filter(item => {
        //   if (item.latitude && item.longitude) {
        //     let numLongitude = parseFloat(item.longitude)
        //     let numLatitude = parseFloat(item.latitude)
        //     return !isNaN(numLongitude) || !isNaN(numLatitude)
        //   }
        // })
        // let arr = res.map(item => {
        //   let obj = {}
        //   obj.position = []
        //   obj.data = {}
        //   obj.isActive = false
        //   obj.position = _pos(item.longitude, item.latitude)
        //   item.hoverName = item.placeName
        //   Object.assign(obj, item)
        //   return obj
        // })
        // state.rootListChoose = arr

        // let arr2 = res.map(item => {
        //   item.position = _pos(item.longitude, item.latitude)
        //   item.isActive = false
        //   return item
        // })
        // state.roomListData = arr2
        // console.log(res);
      })
    })
  },
  // 获取设备列表
  getDeviceList ({ commit }) {
    // commit('clearRoomDeviceList');
    if (state.roomDeviceList.length > 0) return

    return new Promise((resolve) => {
      commit('clearRoomDeviceList')
      getAllDevice().then(res => {
        // 为了不卡顿，只取前2w个数据
        if (res.length >= 21868) {
          res = res.slice(0, 21868)
        }
        commit('getDeviceListCallBack', res)
        resolve(res)
      })
    })
  },
  getDeviceListByLocation ({ commit, rootState }, list) {
    return new Promise((resolve) => {
      //  登陆之后再退出，再进入无登录页面因为调了getAllDeviceByLoction这个接口，会401，所以出现了会退出到login页面的原因
      // 所以，如果是退出状态下，那么就不调用这个方法，只有再登录成功的时候会去调这个方法
      if (rootState.Common.init) {
        getAllDeviceByLoction(list).then(res => {
          commit('getDeviceListByLocationCallBack', [...res])
          resolve(res)
        })
      }
    })
  },
  // 根据场所code 获取场所信息
  async getRoomListDetail ({ commit }, ids) {
    const list = await getPlaceDetail({
      placeCodes: ids
    })
    commit('showRoomPop', list)
  }
}
// mutations
const mutations = {
  backInitialStatus (boolean) {
    state.devicePopShow = boolean // 隐藏设备
    state.roomPopShow = boolean // 展示场所
  },
  // 点击保存场所
  setPlaceDataClicked (state, obj) {
    state.placeDataClicked = obj
    state.devicePopShow = false // 隐藏设备
    state.roomPopShow = true // 展示场所
  },
  // 点击保存设备ids 数组
  setDeviceIdsClicked (state, array) {
    state.deviceIdsClicked = array
    state.roomPopShow = false // 隐藏设备
    state.devicePopShow = true // 展示场所
  },

  // 获取场所列表回调
  getRoomListCallBackC (state, data) {
    if (!data || data.length === 0) return
    // let dataView = []
    data = data.filter(item => {
      if (item.latitude && item.longitude) {
        let numLongitude = parseFloat(item.longitude)
        let numLatitude = parseFloat(item.latitude)
        item.hoverName = item.placeName
        item.isActive = false
        item.position = _pos(item.longitude, item.latitude)
        return !isNaN(numLongitude) || !isNaN(numLatitude)
      }
    })
    // data=[...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data]
    // data=[...data,...data,...data]
    // let arr = data.map(item => {
    //   let obj = {}
    //   obj.position = []
    //   obj.data = {}
    //   obj.isActive = false
    //   obj.position = _pos(item.longitude, item.latitude)
    //   item.hoverName = item.placeName
    //   Object.assign(obj, item)
    //   return obj
    // })
    // console.log(arr);
    state.rootListChoose = data

    // let arr2 = data.map(item => {
    //   item.position = _pos(item.longitude, item.latitude)
    //   item.isActive = false
    //   return item
    // })
    state.roomListData = data
    // console.log(state.roomListData);
    // UtilHandleBigData(data, (item) => {
    //   console.log(item);
    //   let a = item.filter(item1 => {
    //     if (item1.latitude && item1.longitude) {
    //       let numLongitude = parseFloat(item1.longitude)
    //       let numLatitude = parseFloat(item1.latitude)
    //       return !isNaN(numLongitude) || !isNaN(numLatitude)
    //     }
    //   })
    //   dataView.push(...a)
    //   // console.log(dataView);
    // },1000)
    // dataView = data.slice(0,10000)
    // console.log(data);
    // console.log(dataView);

  },
  // 获取设备列表回调
  getDeviceListCallBack (state, data) {
    if (!data || data.length === 0) return
    data = data.filter(item => {
      if (item.latitude && item.longitude) {
        let numLongitude = parseFloat(item.longitude)
        let numLatitude = parseFloat(item.latitude)
        return !isNaN(numLongitude) || !isNaN(numLatitude)
      }
    })

    state.roomDeviceList = data.map(item => {
      item.position = _pos(item.longitude, item.latitude)
      item.isActive = false
      item.hoverName = item.deviceName
      item.online = dayjs.getOnlineState(item.updateTime)
      // item.deviceType = item.deviceType || 1
      item.deviceType = state.deviceTypeNumObj[item.deviceType] || '9'
      item.otype = item.deviceType
      return item
    })
    if (state.roomDeviceList.length >= 21868) {
      state.roomDeviceList = state.roomDeviceList.slice(0, 21868)
    }
  },
  // 获取设备列表回调
  getDeviceListByLocationCallBack (state, data) {
    if (!data || data.length === 0) return
    if (data.length >= 21868) {
      data = data.slice(0, 21868)
    }
    data = data.filter(item => {
      if (item.latitude && item.longitude) {
        let numLongitude = parseFloat(item.longitude)
        let numLatitude = parseFloat(item.latitude)
        return !isNaN(numLongitude) || !isNaN(numLatitude)
      }
    })

    const formatList = data.map(item => {
      item.position = _pos(item.longitude, item.latitude)
      item.isActive = false
      item.hoverName = item.deviceName
      item.online = dayjs.getOnlineState(item.updateTime)
      item.deviceType = state.deviceTypeNumObj[item.deviceType] || '9'
      item.otype = item.deviceType
      return item
    })
    state.roomDeviceList = [...state.roomDeviceList, ...formatList]
    if (state.roomDeviceList.length >= 15000) {
      state.roomDeviceList = state.roomDeviceList.slice(0, 15000)
    }
  },
  // 关闭设备详情
  closeDevicePop (state) {
    state.devicePopShow = false
  },
  // 关闭场所详情
  closeRoomPop (state) {
    state.roomPopShow = false
    state.roomOverlayActiveIndex = -1
  },
  showRoomPop (state, list) {
    // 这里需要区分 数组 和 非数组
    list = Array.isArray(list) ? list : [list]
    state.devicePopShow = false // 隐藏设备
    state.roomPopShow = true // 展示场所
    state.currentRoomData = list.map(site => {
      site.placeType = state.placeType[site.placeType]
      site.accessType = state.accessType[site.accessType]
      site.updateTime = dayjs.filterSS(site.updateTime)
      return site
    })
  },
  // 是否显示某一类图标
  toggleDeviceIcon (state, index) {
    Vue.set(state.deviceIconShow, index, !state.deviceIconShow[index])
  },
  resetDeviceIcon (state) {
    state.deviceIconShow = [true, true, true, true, true, true, true, true]
  },
  // 点聚合数组
  addDeviceMarkers (state, marker) {
    state.deviceMarkers.push(marker)
  },
  // 收集聚合点（仅第一次有效）
  addDeviceMarkersOrigin (state, marker) {
    if (state.noClickNav) {
      state.originDeviceList.push(marker)
    }
  },
  changeDeviceMarkers (state, marker) {
    state.deviceMarkers = marker
  },
  // 添加地图overlay
  addRoomMarkers (state, marker) {
    state.roomMarkers.push(marker)
  },
  clearRoomMarkers (state) {
    state.roomMarkers = []
  },
  // 设置地图zoom
  setZoom (state, zoom) {
    state.zoom = zoom
  },
  updateRoomList (
    state,
    payload = {
      idx: -1,
      flag: false
    }
  ) {
    if (payload.flag) {
      state.roomListData[payload.idx].isActive = payload.flag
    } else {
      state.roomListData[payload.idx].isActive = !state.roomListData[payload.idx].isActive
    }
  },
  // 清空设备
  clearRoomDeviceList (state) {
    state.deviceMarkers = []
  },
  changeRoomList (state, list) {
    state.roomListData = state.roomListData.map(item => {
      if (list.includes(item.id)) {
        item.isActive = true
      } else {
        item.isActive = false
      }
      return item
    })
  },
  // 清除内存
  resetLinkMarker (state) {
    state.deviceMarkers = []
    state.originDeviceList = []
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
