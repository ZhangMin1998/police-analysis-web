import { queryCase as queryCaseReq } from '@/api/analysis'
const state = {
  screenHeight: 937,
  screenWidth: 1920,
  // 时空碰撞
  isResult: false,
  isNotice: 'trans', //trans 显示消息面板  ''为隐藏面板
  isAddCase: false,
  caseList: [], //消息面板中 案件列表
  // 同行分析
  anaFormParams: {},
  personIdList: [],
  placeList: []
}
const getters = {}
const mutations = {
  updateScreenHeight (state, height) {
    state.screenHeight = height
  },
  updateScreenWidth (state, width) {
    state.screenWidth = width
  },
  updatePersonIdList (state, payload) {
    state.personIdList = [...payload]
  },
  updatePlaceList (state, payload) {
    state.placeList = [...payload]
  },
  // --------------- 时空碰撞-----------------------
  queryCaseCallback (state, list) {
    state.caseList = [...list]
  }
}
const actions = {
  queryCase ({ commit }) {
    queryCaseReq(localStorage.getItem('personId')).then(res => {
      commit('queryCaseCallback', res)
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
