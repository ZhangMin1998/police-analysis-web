import router from '@/router/'
import store from '@/store/'
import whiteList from './whiteList'
import Vue from 'vue'
import Menu from '@/router/constant'
import config from '@/config/config.js'

import { addRouter } from '@/utils/addRouter'
import { getSysMenu, tokenDisplace } from '@/api/login'
import { initUserConfig } from '@/views/common/login/login.js'
let exeonce = true
function gotoRouter (to, next) {
  getSysMenu() // 获取动态路由的方法
    .then(res => {
      if (!res.menuList || res.menuList.length == 0) {
        Vue.prototype
          .$policeComfirm('此角色暂无任何权限！', { showCancelButton: false }).finally(() => {
            store.commit('Common/LogoutSys')
            sessionStorage.clear()
            next({ name: 'login' })
          })
        return false
      }
      // 将按钮权限保存到vuex中
      store.commit('Common/setPermissionsArray', res.permissions)
      // 存储数据中心接入的所有数据
      store.commit('Common/setDataCenterAllList', res.menuList)
      let asyncRouter
      if (config.dependBackendRouter) {
        // 依赖后端接口返回的路由生成路由
        asyncRouter = addRouter(res.menuList) // 进行递归解析
      } else {
        // 依赖前端文件生成路由
        asyncRouter = addRouter(Menu) // 进行递归解析
      }
      return asyncRouter
    })
    .then(asyncRouter => {
      store.dispatch('Common/setRouterList', asyncRouter) // 存储到vuex
      store.commit('Common/set_init', true)
      store.commit('User/setWaterMarker')  // 设置水印
      store.dispatch('Common/getDataTypeList') // 获取数据类型
      store.dispatch('Common/getNodeTypeList') // 获取实体对照表
      store.dispatch('Common/getAnalysisDataTypeList') // 获取分析研判-分析条件-数据类型
      store.dispatch('Common/getEntityIcon') // 获取图谱实体图标
      store.dispatch('Common/getIsShowImg') // 获取全息档案-人物数据-列表字段是否显示图片
      // store.dispatch('Dict/getExtraTypeList')
      store.dispatch('Dict/getTypeList')
      // store.dispatch('Dict/getNationList')
      // store.dispatch('Dict/getExtraAreaTypeList')
      // store.dispatch('Dict/getPersonTypeList')
      // store.dispatch('Dict/getExtraRelationTypeList')

      router.$addRoutes(store.state.Common.RouterList)

      // 删除隐藏的显示一级菜单
      const showFirstMenu = asyncRouter.filter(
        element => element.hidden === 'false' || !element.hidden
      )
      let firstMenu = showFirstMenu.map(element => {
        return {
          navTitle: element.itemName,
          secondtitle: element.meta.navList[0],
          name: element.path.split('/')[element.path.split('/').length - 1],
          componentName: element.path.split('/')[
            element.path.split('/').length - 1
          ]
        }
      })

      // store.commit('User/obtainHeaderList', [
      //   [...firstMenu.slice(0, firstMenu.length === 6 ? 3 : 2)],`
      //   [...firstMenu.slice(firstMenu.length === 6 ? 3 : 2)]
      // ])
      store.commit('User/obtainHeaderList', firstMenu)

      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
    })
    .catch(e => {
      console.log(e)
    })
}


router.beforeEach(async (to, from, next) => {
  // console.log(to, from, next)
  // console.log(54564654);
  // 跳转路由 默认为true 显示页面 。当接口返回无权限时 改为false
  // store.state.Common.permission = true
  /** 未登录状态时 重定向login页面 */
  // console.log(to, from)
  // 这里处理客户端跳转到web页面的问题,进行token置换并保存系统必须要的东西
  if (window.location.search.startsWith('?token=') && exeonce) {
    const queryString = window.location.search
    const urlParams = queryString.split('&')[0].split('=')[1]
    // console.log(urlParams)
    var formData = new FormData() // 当前为空
    formData.append('token', urlParams)
    const res = await tokenDisplace(formData)
    // console.log(res)
    if (res) {
      store.commit('Common/LoginSys', res)
      // 初始化用户配置
      initUserConfig(res)
      // 保存用户信息到vuex
      store.commit('User/setUserInfo', res)
      // next({path:to.path})
      // return false
      // router.push({path:to.path})
      // return false
      exeonce = false
    }
    // return false
  }
  let token = localStorage.getItem('token')
  // 如果没有token并且也不在白名单，则跳转到登陆页并且携带要去的页面
  if (!token && !whiteList.includes(to.name)) {
    if (to.path==='/') {
      next({ name: 'login' })
    }else{
      to.name === 'login' ? next({ name: 'login' }) : next({ name: 'login', query: { redirect: to.fullPath } })
    }
    return false
  }
  if (token) {
    // 判断cookice是否存在 不存在即为未登录
    if (to.name !== 'login') {
      if (store.state.Common.init) {
        // 获取了动态路由 data一定true,就无需再次请求 直接放行
        // console.log('获取了动态路由就无需再次请求 直接放行');
        // store.state.Ol.oMap = null
        // store.state.Common.cMap = null
        next()
      } else {
        // 这里需要再判断一下，如果进入的页面是whitespace里面的，则直接进去，不是才去获取动态路由(出现情况：nav接口错误，但是按理应不须登陆的界面可直接访问)
        if (whiteList.includes(to.name)) {
          next()
        } else {
          if (!to.name && to.path === '/') {
            next({ name: 'login' })
          } else {
            gotoRouter(to, next)
          }
        }
        // console.log(22222);
        // data为false,一定没有获取动态路由,就跳转到获取动态路由的方法
      }
    } else {
      // console.log('应该会来到这里啊有token,是登录也');
      // 应该是这里的to有问题,直接就进入到了login页面,因为to是login页面
      // console.log(to);
      next()
    }
  } else {
    // console.log(whiteList);
    // console.log(to);
    // let asyncRouter = addRouter(Menu)
    // store.dispatch('Common/setRouterList', asyncRouter) // 存储到vuex
    // store.commit('Common/set_init', true)
    // router.$addRoutes(store.state.Common.RouterList)
    // debugger
    if (whiteList.includes(to.name)) {
      // 免登陆白名单 直接进入
      // console.log('免登陆白名单 直接进入')
      next()
    } else {
      // console.log('ehhehee');
      if (to.name !== 'login') {
        Vue.prototype
          .$policeComfirm('您没有登录,请立即登录 !', { showCancelButton: false })
          .then(action => {
            if (action == 'confirm') {
              // console.log('没有token时,又进入了一次login页面');
              next({ name: 'login' })
              // next({ name: 'login' ,query:{ redirect: to.fullPath }})
            }
          })
      } else {
        next()
      }
    }
  }
})

