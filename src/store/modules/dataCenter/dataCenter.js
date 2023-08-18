import { queryTasks } from '@/api/taskManagement'
const state = {
  showTransition: false,
  jobNum: 0,
  timer: null,
  jobPanelShow: false,
  routeList: [],
  activeLabTitle: ''
}

const mutations = {
  openTransition (state) {
    state.showTransition = true
    this.dispatch('DataCenter/getTasks')
    setTimeout(() => {
      state.showTransition = false
    }, 1000)
  },
  setJobNum (state, num) {
    state.jobNum = num
    if (num !== 0 && !state.timer) {
      state.timer = window.setInterval(() => {
        this.dispatch('DataCenter/getTasks')
      }, 15000)
    } else if (num === 0) {
      if (state.timer) {
        window.clearInterval(state.timer)
        state.timer = null
      }
    }
  },

  // 任务管理面板 设置 显示/隐藏
  setJobPanelShow (state, isShow) {
    state.jobPanelShow = isShow
  },
  // 保存数据中心有权限的菜单
  setRouteList (state, data) {
    state.routeList = data
  },
  setActiveLabTitle (state, data) {
    state.activeLabTitle = data
  }
}

const actions = {
  // 获取任务数量
  getTasks ({ commit }) {
    return new Promise((resolve) => {
      queryTasks({ search_type: '', search_items: '' }).then(res => {
        commit('setJobNum', res.running_count || 0)
        resolve(res)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
