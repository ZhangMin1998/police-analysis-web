import Vue from 'vue'
import VueRouter from 'vue-router'

import offlineRouter from './offline'

Vue.use(VueRouter)

let curRoutes = []

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

curRoutes = offlineRouter

const router = new VueRouter({
  routes: [...curRoutes],
  mode: 'history',
})


/**
 * 清空路由 重新赋值路由
 **/
router.$addRoutes = params => {
  router.matcher = new VueRouter({ mode: 'history' }).matcher
  router.addRoutes(params)
}



export default router
