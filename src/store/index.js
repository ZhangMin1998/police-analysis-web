import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

import Map from './modules/deviceMap/map'
import DeviceList from './modules/deviceMap/deviceList'
import Common from './modules/common'
import trackWarning from './modules/trackWarning/index'
import analysisJudgement from './modules/analysisJudgement/index'
import DataCenter from './modules/dataCenter/dataCenter'
import SystemSetting from './modules/systemSetting/systemSetting'
import Ol from './modules/ol/index'
import User from './modules/user'
import Dict from './modules/dict'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    Map,
    DeviceList,
    Common,
    trackWarning,
    analysisJudgement,
    DataCenter,
    SystemSetting,
    Ol,
    User,
    Dict
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer (val) {
        return {
          User: val.User,
          Dict: val.Dict
        }
      }
    })]
})


export default store

export function useStore () {
  return store
}
