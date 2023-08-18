import request from '@/config/request'

// --------------- 登录 -----------------
// 用户登录
export function login (param) {
  return request({
    url: '/login/oauth/token',
    method: 'post',
    data: param,
  })
}
// 用户退出系统
export function logout (params) {
  return request({
    url: '/login/oauth/logout',
    method: 'get',
    params,
  })
}

// 用户退出系统
export function getloginSettings () {
  return request({
    url: '/login/system/configuration/loginConfig/query',
    method: 'get',
  })
}

// 获取用户菜单权限
// export function getSysMenu () {
//   return request({
//     url: '/sys/menu/nav',
//     method: 'get',
//   })
// }
export function getSysMenu () {
  return request({
    url: '/login/auth/menu/nav',
    method: 'get',
  })
}


// 获取 public
export function getpublicKey () {
  return request({
    url: '/login/oauth/publicKey',
    method: 'post',
  })
}

// 获取 验证码图片
export function getVerifyImage () {
  return request({
    url: '/login/oauth/kaptcha',
    method: 'get'
  })
}

// 首次登录修改密码
export function setFirstPassword (param) {
  return request({
    url: '/login/oauth/alter_password',
    method: 'post',
    data: param,
    meta:{
      all: true
    }
  })
}

// 忘记密码申请重置密码
export function resetPassword (param) {
  return request({
    url: '/login/oauth/applicationReset',
    method: 'post',
    data: param,
    meta:{
      all: true
    }
  })
}

// token置换
export function tokenDisplace (data) {
  return request({
    url: '/login/oauth/token/displace',
    method: 'post',
    data
  })
}

// 每次点击一二级菜单告诉后端
export function saveLog (params) {
  return request({
    url: '/log/saveLog',
    method: 'post',
    data: params
  })
}
