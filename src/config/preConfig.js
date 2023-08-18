import Vue from 'vue'
import * as filters from '@/utils/filters'
import commonFilters from '@/utils/commonFilters'
import OnlyMessage from '@/utils/onlyMsgbox'
import md5 from 'js-md5'
import Title from '@/commons/deviceMap/title'
import NavTitle from '@/components/BasicComponents/NavTitle'
import BackPrevious from '@/components/VisualComponents/BackPrevious'
import CusLineTitle from '@/components/BasicComponents/CusLineTitle'
import CusTitle from '@/components/BasicComponents/CusTitle'
import clickout from '@/directives/clickout'

Vue.component('ListTitle', Title)
Vue.component('NavTitle', NavTitle)
Vue.component('CusTitle', CusTitle)
Vue.component('CusLineTitle', CusLineTitle)
Vue.component('BackPrevious', BackPrevious)

Object.keys(filters.default).forEach(key => {
  Vue.filter(key, filters.default[key])
})

for (let key in commonFilters) {
  Vue.filter(key, commonFilters[key])
}

Vue.directive('clickout', clickout)

Vue.prototype.$messageTip = OnlyMessage

// bus 相关
const bus = new Vue()
Vue.prototype.bus = bus
Vue.prototype.$md5 = md5
