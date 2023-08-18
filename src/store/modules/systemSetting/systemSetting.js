const state = {
  /** 导入页面 -> 进度条状态  */
  isExporting: false,
  exportingNum: 0,
  curExportState: 0,
  organizationalTreeList: '',
  departmentTreeWithRoleList: '',
}
const mutations = {
  set_isExporting (state, boolean) {
    state.isExporting = boolean
  },
  set_exportingNum (state, num) {
    state.exportingNum = num
  },
  set_curExportState (state, status) {
    state.curExportState = status
  },
  set_organizationalTreeList (state, status) {
    state.organizationalTreeList = status
  },
  set_departmentTreeWithRoleList (state, status) {
    state.departmentTreeWithRoleList = status
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
