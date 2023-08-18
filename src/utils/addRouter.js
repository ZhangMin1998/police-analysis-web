/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */

import Layout from '@/components/layout'
const { _isOl } = require('@/config/user.js')

// 路径前缀 isOl ? 在线：离线
function judgeIsOnline (isOl) {
  return isOl ? 'online' : 'offline'
}

// 接口nav处理 返回路由
export function addRouter (nav) {
  // 1. 删除隐藏的一级菜单
  // const menus = filterHiddenNav(nav)

  // 2. 处理菜单为路由
  const routers = formatRouter(nav)
  // console.log(routers);
  return routers
}

function checkList (list) {
  if (!list) return
  return filterHiddenNav(list).length
}

// 默认设备地图数据
function defalutDevicemap (navList) {
  return [
    {
      hidden: false,
      pathName: 'devicemap',
      component: 'NotPermission',
      parentId: navList.find(ele => ele.itemName === '设备地图').id || 0,
      meta:
        '{"common":false,"hidden":true,"icon":"link","icon-h":"","belong":""}'
    }
  ]
}

// 默认设备地图数据
function defalutSysconfig (navList) {
  return [
    {
      hidden: false,
      pathName: 'departmentManagement',
      component: 'NotPermission',
      parentId: navList.find(ele => ele.itemName === '系统设置').id || 0,
      meta:
        '{"common":false,"hidden":true,"icon":"link","icon-h":"","belong":""}'
    }
  ]
}

// 判断是否有设备地图
function hasDevicemap (list) {
  return list.findIndex(ele => ele.itemName === '设备地图') === -1
}

// 处理nav
function formatRouter (navList, parentName) {
  const preFix = judgeIsOnline(_isOl())
  try {
    return navList.map(element => {
      if (element.parentId === 0) {
        // 设备地图为固定 如果没有给默认

        if (element.itemName === '设备地图' && hasDevicemap(element.list)) {
          element.list = defalutDevicemap(navList)
        }

        if (
          element.itemName === '系统设置' &&
          filterHiddenNav(element.list).length === 0
        ) {
          element.list = defalutSysconfig(navList)
        }
        // console.log(element);
        // debugger
        return {
          id: element.id,
          itemName: element.itemName,
          component: Layout,
          hidden: element.hidden, // 一级菜单隐藏属性
          path: defaultPath(element.list, element.id),
          children: checkList(element.list)
            ? formatRouter(element.list, element.itemName)
            : [
                {
                  path: '/ol/' + defaultPath(element.list, element.id),
                  name: defaultPath(element.list, element.id),

                  component: () => import('@/views/NotPermission'),
                  componentstr: `() => import('@/views/NotPermission')`,
                  meta: {
                    hidden: true,
                    common: true,
                    parentName: element.itemName
                  }
                }
              ],
          meta: {
            navList: checkList(element.list) ? formatLeftNav(element.list) : []
          }
        }
      } else {
        return {
          path: '/ol/' + fomatUrlPath(element.pathName),
          name: element.pathName,
          component: () =>
            Promise.resolve(require(`@/views/${
              element.component === 'NotPermission'
                ? ''
                : element.component.includes('common')
                  ? ''
                  : preFix + '/'
            }${element.component}`).default),
          componentstr: `@/views/${
            element.component.includes('common') ? '' : preFix + '/'
          }${element.component}`,
          meta: {
            parentId: element.parentId,
            parentName: parentName,
            title: element.itemName,
            perms: element.perms || '',
            hidden: formatMeta(element.meta, 'hidden'), // 左侧显示隐藏。但是路由仍然在
            common: formatMeta(element.meta, 'common'),
            belong: formatMeta(element.meta, 'belong'),
            layout: formatMeta(element.meta, 'layout')
            // common true 公共组件（与地图无关系） false（与地图相关）
          }
        }
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

// 过滤隐藏的nav
function filterHiddenNav (list) {
  if (!list) return []
  return list.filter(element => element.hidden === 'false' || !element.hidden)
}

// 格式化路径
function fomatUrlPath (path) {
  return path.includes('/') ? path.substr(1) : path
}

// 处理meta
function formatMeta (string, prop) {
  if (!string) return true

  const meta = JSON.parse(string)
  if (prop === 'hidden') {
    meta[prop] = meta[prop] === 'false' ? false : Boolean(meta[prop])
  } else if (prop === 'common') {
    meta[prop] = meta[prop] == undefined
    meta[prop] = meta[prop] === 'false' ? false : Boolean(meta[prop])
  }

  return meta[prop]
}

// 处理左边导航icon
function formatLeftNav (list) {
  if (!list || list.length === 0) return []
  const showNav = filterHiddenNav(list)
  const hasIconNav = showNav.filter(element => {
    const meta = element.meta ? JSON.parse(element.meta) : {}
    return meta.icon && meta.icon != 'link'
  })
  const navList = hasIconNav.map(element => {
    const meta = element.meta ? JSON.parse(element.meta) : {}

    return {
      pathName: element.pathName,
      title: element.itemName,
      normalImg: meta.icon || '',
      activeImg: meta['icon-h'] || '',
      hidden: meta.hidden
    }
  })
  return navList
}

// 默认math
function defaultPath (list = [], id = 0) {
  if (list.length === 0) return 'NotPermission' + id
  const item = list.find(
    element => element.hidden === 'false' || !element.hidden
  )
  return item ? '/ol/' + item.pathName : 'NotPermission' + id
}
