import axios from 'axios'
import OnlyMessage from '@/utils/onlyMsgbox'
import vm from '@/main.js'
import Vue from 'vue'
import { Message } from 'element-ui'
import { isIE11 } from '@/utils/index'

import { enByDES, deByDES } from '@/utils/encryp.js'
import { obtainKey } from '../utils/index'

const preJava = '/police'
const prePython = '/py'
const preWarning = '/police/warning'

const request = args => {
  let { url } = args
  url = args.py ? prePython + url : args.warning ? preWarning + url : preJava + url
  return service({ ...args, url })
}

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000 // request timeout
})
const notTimeOut = [
  '/police/dc_wifi/pager',
  '/police/dc_fence/pager',
  '/police/case/insert',
  '/police/analysis/queryTimeTrack',
  '/police/analysis/getStartAndEnd',
  '/police/analysis/allData',
  '/police/analysis/spaceCrash',
  '/police/dc_audit/pager',
  '/police/excel/import/excel',
  '/police/device_details',
  '/police/device_list',
  '/police/analysis/peerRelevance/ax',
  '/police/sparkTask/save',
  '/police/fr/search',
  '/police/configurable/srcData/create',
  '/police/configurable/srcData/update'
]
const disEnByDES = [
  '/police/login/oauth/token',
  '/police/fr/search',
  '/police/suspects/searchCriminalByPage',
  '/police/suspects/queryNexus'
]
const reqMethod = ['put', 'post']
// request interceptor


let loading = false
function openLoading (loadingDom, loadingBg, text) {
  loading = Vue.prototype.$pLoading({
    lock: true,
    text: text,
    spinner:'el-icon-loading',
    background: loadingBg,
    target: loadingDom || 'body'
  })
}
function closeLoading () {
  loading && loading.close()
}

function isColor (strColor) {
  let reg = /^#[0-9A-F]{6}$/i
  if (reg.test(strColor)) return true
  let s = new Option().style
  s.color = strColor
  return s.color === strColor
}

const pendingMap = new Map();

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey (config) {
  let {url, method, params, data} = config;
  if(typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending (config) {
  const pendingKey = getPendingKey(config);
  // console.log(pendingKey);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel);
    }
  });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending (config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
     const cancelToken = pendingMap.get(pendingKey);
     cancelToken(pendingKey);
     pendingMap.delete(pendingKey);
  }
}

// function removeAllPending(){
//   console.log(pendingMap);
//   pendingMap.forEach((key,value)=>{
//     console.log('key',key)
//     console.log('value',value);
//     // key()
//   })
// }
// window.removeAllPending = removeAllPending

service.interceptors.request.use(
  config => {
    // console.log(config);
    // 配置多次发送请求时 取消上一次的接口请求（或不接收上一次的接口请求）
    removePending(config)
    config.cancelMuchRequest && addPending(config)
    // 配置请求的loading
    if (config.loading) {
      let loadBg = config.loadingBg || '--bg-color-2'
      let loadingBg = isColor(loadBg) ? loadBg : Vue.prototype.$themeColor(loadBg)
      openLoading(
        config.loadingDom,
        loadingBg,
        config.loadingText ? config.loadingText : '数据正在加载中'
      )
    }

    if (config.method == 'get') {
      if (isIE11()) {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
    }

    // 请求参数 加密 排除py接口
    if (localStorage.getItem('encOpen') === 'true' && !config.py && !config.warning) {
      /**  post/put请求统一加密参数 排除白名单  */
      console.log('====================================')
      console.log('请求url' + config.url + ' ,请求参数：' + JSON.stringify(config.data))
      console.log('====================================')

      // post 和 put 请求加密   以及个别例外接口
      if (reqMethod.includes(config.method) && !disEnByDES.includes(config.url)) {
        config.data = enByDES(JSON.stringify(config.data))
      }

      /**  强制设置请求头  */
      if (config.url == '/police/oauth/token' || reqMethod.includes(config.method)) {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
      if (config.formUpload) {
        config.headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      }
    }

    let token = localStorage.getItem('token')

    const isLong = notTimeOut.some(element => element === config.url)

    /** 设置白名单不超时 */
    if (isLong || config.py) {
      config.timeout = 10000000000000
    }

    if (token) {
      //将token放到请求头发送给服务器,将tokenkey放在请求头中
      config.headers.token = token
      // config.headers.withCredentials = true
      // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    } else {
      // config.headers.withCredentials = false
    }

    return config
  },

  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const codeMessage = {
  500: '服务器发生错误，请稍后刷新重试。'
}
const codeMessageStr = ['500']

let responseAll = ['/police/table/insertUserOrRoleOrMenuData']
// response interceptor
service.interceptors.response.use(
  response => {
    // 已完成请求的删除请求中数组
    removePending(response.config);
    // 关闭loading效果
    if (response.config.loading) {
      closeLoading()
    }
    let res = response.data
    /**后台加密 拿到加密返回数据 解密再去显示 */
    if (localStorage.getItem('encOpen') == 'true') {
      if (typeof response.data == 'string') {
        /** 将 localStorage 中PrivateKey 用固定字符串解密后 再去解密返回数据*/
        let key = deByDES(localStorage.getItem('PrivateKey'), obtainKey())
        res = JSON.parse(deByDES(response.data, key))
        console.log('====================================')
        console.log(response.config.url, res)
        console.log('====================================')
      }
    }

    // 通过 meta 中的 all 配置来取决后台是否返回所有数据
    const isAll = response.config.meta && response.config.meta.all
    if (isAll || responseAll.includes(response.config.url)) {
      return res
    } else {
      if (res.code == 1) {
        return res.data
      } else if (res.code == '401' || res.code == '403') {
        OnlyMessage.warning('登录已失效,请立即重新登录 !')
        vm.$store.commit('Common/LogoutSys')

        vm.$router.history.push({
          path: '/ol/login'
        })
        // 处理token失效时,登录再回到原来的界面
        // const baseUrl = window.location.origin + '/'
        // vm.$router.history.push({
        //   path: '/ol/login',
        //   query:{
        //     redirect:window.location.href.split(baseUrl)[1]
        //   }
        // })
        return
      } else if (res.code == 2) {
        return res
      } else {
        if(res.msg === '账号或者密码错误' || res.msg === '验证码有误！') {
          vm.$store.commit('Common/setPasswordErrorTimes', Number(res.data))
          return Promise.reject(new Error(res.msg || 'Error'))
        }
        console.log('====================================')
        console.log(res.msg)
        console.log('====================================')
        Message.error(res.msg)
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    }
  },
  error => {
    error.config && removePending(error.config);
    closeLoading()
    let str = 'err' + error
    let code = str.substring(str.length - 3, str.length)

    if (codeMessageStr.includes(code)) {
      OnlyMessage.error(codeMessage[code])
      return Promise.reject(error)
    }

    if (str.indexOf('timeout') !== -1) {
      OnlyMessage.error('请求超时,请刷新重试！')
    }

    return Promise.reject(error)
  }
)

export default request
