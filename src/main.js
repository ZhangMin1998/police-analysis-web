import "babel-polyfill"
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
// import ElementUI from 'element-ui'
import router from './router'
import store from './store'
import { backPermissionsArray, pxToRem, themeColor } from '@/utils/index'
import 'normalize.css/normalize.css'
import '@/assets/css/basic.css' // 全局样式

import '@/directives/permission.js'
import policeLoading from '@/directives/police-loading/policeLoad.js'
import Debounce from './directives/debounce.js' //防抖自定义指令
import MessageBox from '@/components/VisualComponents/MessageBox/index.js'
// 一些预加载
import './config/element-ui'
import './config/preConfig'
import '@/utils/sub-event'
import './config/routerLife'
import '@/utils/lib-flexible/flexible'
import App from './App.vue'

import { initTheme } from '@/assets/js/theme'
let theme = localStorage.getItem('theme') === 'light' ? false : true
initTheme(theme)
// Vue.prototype.config = config
Vue.prototype.$backPermissionsArray = backPermissionsArray

Vue.prototype.$policeComfirm = MessageBox.install

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$pxToRem = pxToRem
Vue.prototype.$themeColor = themeColor
Vue.use(VueCompositionAPI)

if (!Vue.prototype.$isServer) {
  Vue.directive('pLoading', policeLoading['pLoading'])
  Vue.prototype.$pLoading = policeLoading['pLoadingFun']
}

// Vue.use(ElementUI)
// console.log('store', store)

Debounce(Vue)

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


export default vm
