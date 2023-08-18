import Layout from '@/components/layout'
import BigScreenSysLayout from '@/views/BigScreenSys/Layout'
const { _isOl } = require('@/config/user.js')
const mapPath = _isOl() ? 'OnLine' : 'OffLine'
export default [
  {
    path: '/ol/login',
    name: 'login',
    component: resolve => require(['@/views/common/login'], resolve)
  },
  {
    path: '/ol/NotPermission',
    component: Layout,
    children: [
      {
        component: resolve => require(['@/views/NotPermission'], resolve),
        meta: {
          hidden: false,
          common: true
        },
        name: 'NotPermission',
        path: '/ol/NotPermission'
      }
    ]
  },
  {
    path: '/ol/BScreen',
    name: 'BScreen',
    component: resolve => require(['@/views/BScreen'], resolve)
  },
  {
    path: '/ol/StatisticalGraph',
    component: Layout,
    children: [
      {
        component: resolve => require(['@/views/common/devicemap/StatisticalGraph'], resolve),
        meta: {
          hidden: true,
          common: true
        },
        name: 'StatisticalGraph',
        path: '/ol/StatisticalGraph'
      }
    ]
  },
  {
    path: '/ol/config',
    component: Layout,
    hidden: false,
    meta: {
      navList: [
        {
          normalImg: 'icon-caidanguanli',
          activeImg: 'icon-0-config-active.png',
          pathName: 'config',
          title: '菜单管理',
          hidden: false
        },
        {
          normalImg: 'icon-shebeiguanli',
          activeImg: 'icon-1-config-active.png',
          pathName: 'deviceManage',
          title: '设备管理',
          hidden: false
        },
        {
          normalImg: 'icon-quanjupeizhi',
          activeImg: 'icon-2-config-active.png',
          pathName: 'globalConfig',
          title: '全局配置',
          hidden: false
        },
        // {
        //   normalImg: 'icon-quanjupeizhi',
        //   activeImg: 'icon-2-config-active.png',
        //   pathName: 'relationship-deduction',
        //   title: '关系推演',
        //   hidden: true
        // },
        {
          normalImg: 'icon-quanjupeizhi',
          activeImg: 'icon-2-config-active.png',
          pathName: 'maintain',
          title: '维护管理',
          hidden: false
        },
        {
          normalImg: 'icon-danganguanli',
          activeImg: 'icon-6-sys-active.png',
          pathName: 'systemMonitor',
          title: '系统监控',
          hidden: false
        },
        {
          normalImg: 'icon-duanxinjilu',
          activeImg: 'icon-3-config-active.png',
          pathName: 'smsRecord',
          title: '短信记录',
          hidden: false
        },
        {
          normalImg: 'icon-ceshipeizhi',
          activeImg: 'icon-5-config-active.png',
          pathName: 'testConfiguration',
          title: '测试配置',
          hidden: false
        },
        {
          normalImg: 'icon-ceshipeizhi',
          activeImg: 'icon-5-config-active.png',
          pathName: 'dataSynchronization',
          title: '数据同步配置',
          hidden: false
        },
        {
          normalImg: 'icon-peizhipipei',
          activeImg: 'icon-7-config-active.png',
          pathName: 'contrastConfig',
          title: '配置匹配',
          hidden: false
        }
      ]
    },
    children: [
      {
        name: 'config',
        path: '/ol/config',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/config/index.vue'], resolve)
      },
      {
        name: 'MenusTable',
        path: '/ol/config/MenusTable',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/config/menus-table'], resolve)
      },
      {
        name: 'deviceManage',
        path: '/ol/config/deviceManage',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/devicemap/deviceList'], resolve)
      },
      {
        name: 'addPlace',
        path: '/ol/config/addPlace',
        meta: {
          hidden: false,
          common: true,
          belong: '设备管理'
        },
        component: resolve => require(['@/views/common/devicemap/components/addPlace'], resolve)
      },
      {
        name: 'editPlace',
        path: '/ol/config/editPlace/:id',
        meta: {
          hidden: false,
          common: true,
          belong: '设备管理'
        },
        component: resolve => require(['@/views/common/devicemap/components/addPlace'], resolve)
      },
      {
        name: 'addDevice',
        path: '/ol/config/addDevice/:placeid',
        meta: {
          hidden: false,
          common: true,
          belong: '设备管理'
        },
        component: resolve => require(['@/views/common/devicemap/components/addDevice'], resolve)
      },
      {
        name: 'editDevice',
        path: '/ol/config/editDevice/:id',
        meta: {
          hidden: false,
          common: true,
          belong: '设备管理'
        },
        component: resolve => require(['@/views/common/devicemap/components/addDevice'], resolve)
      },
      {
        name: 'globalConfig',
        path: '/ol/config/globalConfig',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/global-config'], resolve)
      },
      // {
      //   name: 'relationship-deduction',
      //   path: '/ol/config/relationship-deduction',
      //   meta: {
      //     hidden: true,
      //     common: true
      //   },
      //   component: resolve => require(['@/views/common/analysis/relationship-deduction'], resolve)
      // },
      {
        name: 'maintain',
        path: '/ol/config/maintain',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/maintain'], resolve)
      },
      {
        name: 'systemMonitor',
        path: '/ol/config/systemMonitor',
        meta: {
          hidden: false,

          common: true
        },
        component: resolve => require(['@/views/common/config/system-monitor'], resolve)
      },
      {
        name: 'smsRecord',
        path: '/ol/config/smsRecord',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/sms-record'], resolve)
      },
      {
        name: 'testConfiguration',
        path: '/ol/config/testConfiguration',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/test-configuration'], resolve)
      },
      {
        name: 'dataSynchronization',
        path: '/ol/config/dataSynchronization',
        meta: {
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/common/config/data-synchronization'], resolve)
      },
      {
        name: 'contrastConfig',
        path: 'contrastConfig',
        meta: {
          hidden: false,
          common: true,
          parentId: 1
        },
        component: resolve => require(['@/views/common/config/contrast-config'], resolve)
      }
    ]
  },
  {
    path: '/ol/check',
    component: Layout,
    hidden: false,
    meta: {
      navList: [
        {
          normalImg: 'icon-fuhetubiao',
          activeImg: 'icon-3-query-active.png',
          pathName: 'check',
          title: 'ODS校验',
          hidden: false
        },
        {
          normalImg: 'icon-fuhetubiao',
          activeImg: 'icon-3-query-active.png',
          pathName: 'datacheck',
          title: '源数据校验',
          hidden: false
        },
        {
          normalImg: 'icon-bumenguanli',
          activeImg: 'icon-0-sys-active.png',
          pathName: 'test',
          title: '离线任务调度',
          hidden: false
        }
      ]
    },
    children: [
      {
        name: 'check',
        path: '/',
        meta: {
          title: 'ODS校验',
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/white-pages/check/ods-check'], resolve)
      },
      {
        name: 'datacheck',
        path: 'datacheck',
        meta: {
          title: '源数据校验',
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/white-pages/check/data-check'], resolve)
      },
      {
        name: 'test',
        path: 'test',
        meta: {
          title: '离线任务调度',
          hidden: false,
          common: true
        },
        component: resolve => require(['@/views/white-pages/check/test'], resolve)
      }
    ]
  },
  {
    path: '/ol/initial',
    component: Layout,
    hidden: false,
    meta: {
      navList: [
        {
          normalImg: 'icon-dianweishuju',
          activeImg: 'icon-6-query-active.png',
          pathName: 'initial',
          title: '初始化',
          hidden: false
        }
      ]
    },
    children: [
      {
        name: 'initial',
        path: '/',
        meta: {
          hidden: false,
          common: true,
          all: true
        },
        component: resolve => require(['@/views/white-pages/initial/initial'], resolve)
      }
    ]
  },
  {
    path: '/ol/deduce',
    component: Layout,
    hidden: false,
    meta: {
      navList: [
        {
          normalImg: 'icon-guanxituiyan',
          activeImg: 'icon-dedution-active.png',
          pathName: 'deduce',
          title: '关系推演',
          hidden: false
        },
        {
          normalImg: 'icon-zuoxifenxi',
          activeImg: 'icon-zuoxi-active.png',
          pathName: 'WorkAndRest',
          title: '作息分析',
          hidden: false
        },
        {
          normalImg: 'icon-shikongtezhengpengzhuang',
          activeImg: 'icon-pengzhuang-active.png',
          pathName: 'spaceTimeCollision',
          title: '时空特征碰撞',
          hidden: false
        },
        {
          normalImg: 'icon-tonghangfenxi',
          activeImg: 'icon-tongxing-active.png',
          pathName: 'peerAnalysis',
          title: '同行分析',
          hidden: false
        },
        {
          normalImg: 'icon-shikongguiji',
          activeImg: 'icon-guiji-active.png',
          pathName: 'queryTimeTrack',
          title: '时空轨迹',
          hidden: false
        }
      ]
    },
    children: [
      {
        name: 'deduce',
        path: '/',
        meta: {
          hidden: false,
          common: true,
          parentName:'应用中心'
        },
        component: resolve => require(['@/views/common/analysis/relationship-deduction'], resolve)
      },
      {
        name: 'WorkAndRest',
        path: 'WorkAndRest',
        meta: {
          hidden: false,
          common: true,
          parentName:'应用中心'
        },
        component: resolve => require(['@/views/offline/analysis/work-and-rest-analysis'], resolve)
      },
      {
        name: 'spaceTimeCollision',
        path: 'spaceTimeCollision',
        meta: {
          hidden: false,
          common: true,
          parentName:'应用中心'
        },
        component: resolve => require(['@/views/offline/analysis/space-time-collision'], resolve)
      },
      {
        name: 'peerAnalysis',
        path: 'peerAnalysis',
        meta: {
          hidden: false,
          common: true,
          parentName:'应用中心'
        },
        component: resolve =>
          require(['@/views/offline/analysis/walking-togethe-analysis'], resolve)
      },
      {
        name: 'queryTimeTrack',
        path: 'queryTimeTrack',
        meta: {
          hidden: false,
          common: true,
          parentName:'应用中心'
        },
        component: resolve => require(['@/views/offline/analysis/space-time-trajectory'], resolve)
      }
    ]
  },
  {
    path: '/ol/bigScreenlogin',
    name: 'bigScreenlogin',
    component: resolve => require(['@/views/BigScreenSys/Login'], resolve)
  },
  {
    path: '/ol/bigScreen',
    component: BigScreenSysLayout,
    children: [
      {
        name: 'bigScreenIndex',
        path: 'bigScreenIndex',
        component: resolve => require([`@/views/BigScreenSys/Map/${mapPath}/index`], resolve)
      }
    ]
  }
  // {
  //   name: 'maintainhtml',
  //   path: '/ol/maintainhtml',
  //   meta: {
  //     hidden: false,
  //     common: true
  //   },
  //   component: resolve => require(['@/views/common/config/maintain/components/Maintain.vue'], resolve)
  // },
]
