import { login, logout, getpublicKey } from '@/api/login'
import { configurableSrcDataAll } from '@/api/warn'
import { getFeatureOptionsApi } from '@/api/warnControl.js'
// import { queryTypeList } from '@/api/dataCenter'
import { getNodeType, getEntityIcon } from '@/api/analysis'
import { getIsShowImg } from '@/api/allArchives'
import offlineRouter from '@/router/offline'

const state = {
  zoom: 13,
  zooms: [11, 20],
  isOl: false, // 在线还是离线
  centrPos: [], // 中心点
  title: '', // 系统标题
  searchCity: '', // 搜索城市
  mapCenter: [],
  cMap: null, // 当前地图实例
  cSockets: false, // 判断 websocket 是否连接
  token: '',
  userName: '',
  personId: 0,
  RouterList: [], // 动态路由
  init: false,
  permission: true,
  pbKey: '', // public key
  // currentIndex: 0, // 一级菜单高亮索引
  typeOptionList: [],
  EchatsState: false,
  passwordErrorTimes: 0, //登录密码错误次数
  permissionsArray: [], // 按钮权限数组
  tableCurrentPage: null,
  dataCenterAllList: [], // 数据中心所有的数据
  dataTypeList: [],
  dataTypeObj:{},
  iconObj: {}, // 图谱实体图片
  isShowImgArray: [], // 档案列表需要显示图片的字段id
  usefulRelationTypeList: [],
  usefulRelationTypeListMap: {},
  dataTypeFormList: [], // 分析研判-分析条件-数据类型
  isFullScreen: false
}
// getters
const getters = {}
// actions
const actions = {
  // 获取分析研判-分析条件-数据类型
  async getAnalysisDataTypeList ({commit}) {
    const obj = await getFeatureOptionsApi()
    commit('setDataTypeFormList', obj)
  },
  // 获取数据类型
  async getDataTypeList ({commit}) {
    const obj = await configurableSrcDataAll()
    commit('setDataTypeList', obj)
  },
  // 获取实体对照表
  async getEntityIcon ({commit}) {
    const list = await getNodeType()
    let tempList = []
    let tempObj = {}
    list.forEach(item => {
      let temp = {}
      temp.typeCode = item.entity_type_en_name
      temp.typeName = item.entity_type_zh_name
      tempList.push(temp)
      tempObj[item.entity_type_en_name] = item.entity_type_zh_name
    })
    commit('setUsefulRelationTypeList',tempList)
    commit('setUsefulRelationTypeListMap',tempObj)
  },
  // 获取实体图标
  async getNodeTypeList ({commit}) {
    let obj = await getEntityIcon()
    commit('setIconObj',obj)
  },
  // 获取全息档案-人物数据-列表字段是否显示图片
  async getIsShowImg ({commit}) {
    let obj = await getIsShowImg()
    commit('setIsShowImgArray',obj)
  },
  obtainKey ({ commit }) {
    return new Promise((resolve, reject) => {
      getpublicKey()
        .then(res => {
          commit('getPbKey')
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
   *登录系统
   *
   * @param {*} { commit }
   * @param {*} str 登录账号密码 密码md5加密一次 rsa 加密
   * @return {*}
   */
  Login ({ commit }, obj) {
    return new Promise((resolve, reject) => {
      login(obj)
        .then(res => {
          commit('LoginSys', res)
          resolve(res)
        })
        .catch(error => {
          console.log(error)
          console.log('error')
          reject(error)
        })
    })
  },
  /**
   * 退出系统
   *
   * @param {*} { commit }
   * @return {*}
   */
  LoginOut ({ commit }) {
    return new Promise(resolve => {
      logout({type:'web'}).then(res => {
        commit('LogoutSys')
        resolve(res)
      })
    })
  },
  /**
   * 动态设置路由 此为设置途径
   *
   * @param {*} { commit }
   * @param {*} routerList
   */
  setRouterList ({ commit }, routerList) {
    if (!routerList || (routerList && routerList.length == 0)) {
      routerList = []
    }
    commit('set_router', routerList.concat(offlineRouter)) // 进行路由拼接并存储
  },
  // obtainOptionsList ({ commit, rootState }) {
  //   const filterList = rootState.User.optList || []
  //   return new Promise((resolve) => {
  //     queryTypeList().then(res => {
  //       commit(
  //         'filterOptions',
  //         res.filter(item => filterList.includes(item.typeCode))
  //       )
  //       resolve(res)
  //     })
  //   })
  // }
}
// mutations
const mutations = {
  setDataTypeFormList (state, data) {
    state.dataTypeFormList = data
  },
  setPasswordErrorTimes (state, data) {
    state.passwordErrorTimes = data
  },
  setEchatsState (state, boolean) {
    state.EchatsState = boolean
  },
  setPermissionsArray (state, val) {
    state.permissionsArray = val
  },
  setDataCenterAllList (state, val) {
    try {
      let dataList = val.filter((item) => {
        return item.itemName === '数据中心'
      })
      if (dataList[0].list.length) {
        let arr = []
        dataList[0].list.forEach((item) => {
          if (!item.hidden && item.itemName !== '全部' && item.enModuleName) {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.enModuleName.slice(7)
            obj.personArchivesFlag = item.personArchivesFlag
            arr.push(obj)
          }
        })
        state.dataCenterAllList = arr
      }else{
        state.dataCenterAllList = []
      }
    } catch (err) {
      console.log(err);
      state.dataCenterAllList = []
    }
  },
  initMap (state, val) {
    // 初始化地图
    state.cMap = val
  },
  getPbKey (state, key) {
    state.pbKey = key
  },
  setDataTypeList (state, val) {
    state.dataTypeList = val
    val.forEach((item)=>{
      state.dataTypeObj[item.srcNameEn] = item.srcNameCn
    })
  },
  setUsefulRelationTypeList (state, val) { // 图谱对照表
    state.usefulRelationTypeList = val
  },
  setUsefulRelationTypeListMap (state, val) { // 图谱对照表
    state.usefulRelationTypeListMap = val
  },
  setIconObj (state, val) { // 图谱实体图片
    state.iconObj = val
  },
  setIsShowImgArray (state, val) { // 需要显示图片的字段id
    state.isShowImgArray = val
  },
  /**
   * 登录系统
   * 存储 token personId
   * @param {*} state
   */
  LoginSys (state, data) {
    state.token = data.token
    state.personId = data.id
    state.userName = data.username
    localStorage.setItem('personId', data.id)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userName', data.username)
  },
  /**
   * 退出系统
   * 清除 token personId
   * @param {*} state
   */
  LogoutSys (state) {
    state.token = ''
    state.userName = ''
    state.init = false
    state.personId = 0
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('curMapWarnCurTab')
    localStorage.removeItem('personId')
    // localStorage.clear()
  },
  /**
   * 设置动态路由
   * @param {*} state
   * @param {*} RouterList 动态路由数组
   */
  set_router: (state, RouterList) => {
    RouterList.push({
      path: '*',
      redirect: '/ol/login'
    })
    state.RouterList = RouterList
  },
  /**
   * 设置是否未登录状态
   */
  set_init: (state, Boo) => {
    state.init = Boo
  },
  //
  setZoom (state, zoom) {
    state.zoom = zoom
  },
  filterOptions (state, list) {
    // const filterList = config.optionsTypes
    // if (filterList.length === 0) {
    //   state.typeOptionList = list
    // } else {
    //   const re = list.filter(item => filterList.includes(item.typeCode))
    //   state.typeOptionList = re
    // }
    state.typeOptionList = list
  },
  setTablePage (state, num) {
    state.tableCurrentPage = num
  },
  setIsFullScreen (state, value) {
    state.isFullScreen = value
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
