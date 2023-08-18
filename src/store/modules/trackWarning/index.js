// 防控级别
const LEVEL_OBJ = {
  GENERAL_LEVEL: '一般防控',
  MEDIUM_LEVEL: '中等防控',
  EMPHASIS_LEVEL: '重点防控'
}

// 防控级别颜色
const LEVEL_COLOR = {
  EMPHASIS_LEVEL: '#F03F58',
  MEDIUM_LEVEL: '#D8B733',
  GENERAL_LEVEL: '#4596E6'
}

const state = {
  levelObj: LEVEL_OBJ,
  levelColorObj: LEVEL_COLOR,
  selectedSiteList: new Set(), // 已经选择的场合集合
  selectedSiteInfo: {}, // 已经选择的场合具体信息的集合
  siteMode: true //  true 是新增模式 false 是编辑模式
}
const getters = {}
const mutations = {
  // type 的取值范围 add del clear
  addSelectedSite (state, item) {
    state.selectedSiteList.add(item.id)
    state.selectedSiteInfo[item.id] = item
  },
  delSelectedSite (state, item) {
    state.selectedSiteList.delete(item.id)
    delete state.selectedSiteInfo[item.id]
  },
  clearSelectdInfo (state) {
    state.selectedSiteInfo = {}
  },
  clearSelectedSite (state) {
    state.selectedSiteList.clear()
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
