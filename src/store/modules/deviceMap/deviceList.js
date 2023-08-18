const state = {
  deviceList: [],
}
// getters
const getters = {
  modeType (state) {
    return state.mode == '列表模式' ? 'Map' : 'List'
  },
}
// actions
const actions = {}
// mutations
const mutations = {}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
