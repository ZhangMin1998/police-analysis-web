import request from '@/config/request'

// 获取所有人物类型
// export function getAllPersonTypes () {
//   return request({
//     url: '/person/findAllCriminalType',
//     method: 'get',
//   })
// }

export function addMenu (param) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    data: param
  })
}

export function updateMenu (param) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data: param
  })
}

// 删除菜单
export function deleteMenu (id) {
  return request({
    url: '/sys/menu/delete/' + id,
    method: 'post'
  })
}

// 查询菜单
export function getMenuTree () {
  return request({
    url: '/sys/menu/tree',
    method: 'get'
  })
}

/** --------------- 场所 / 设备 相关配置 ---------------- */

// 查询所有类型
export function getAllType () {
  return request({
    url: '/place/getAllType',
    method: 'get'
  })
}

// 新增场所
export function placeInsert (param) {
  return request({
    url: '/place/insert',
    method: 'put',
    data: param
  })
}

// 修改场所
export function placeUpdate (param) {
  return request({
    url: '/place/update',
    method: 'post',
    data: param
  })
}

// 删除场所
export function placeDeleteReq (id) {
  return request({
    url: '/place/delete/' + id,
    method: 'delete'
  })
}

// 新增设备
export function deviceInsert (param) {
  return request({
    url: '/device/insert',
    method: 'put',
    data: param
  })
}

// 修改设备
export function deviceUpdate (param) {
  return request({
    url: '/device/update',
    method: 'post',
    data: param
  })
}

// 通过id 获取设备详情
export function deviceGetById (id) {
  return request({
    url: '/device/getDevice/' + id,
    method: 'get'
  })
}

// 删除设备device/delete
export function deviceDeleteReq (id) {
  return request({
    url: '/device/delete/' + id,
    method: 'delete'
  })
}
/** --------------------------数据记录---------------- */

export function deviceList (param) {
  return request({
    url: '/monitoring/device/list',
    method: 'post',
    data: param,
    py: true
  })
}

/** 获取全局配置 */
export function updateGlobalConfig (data) {
  return request({
    url: '/login/system/configuration/update',
    method: 'post',
    data
  })
}
// ------------------------------测试页面--------------------------------


/** 菜单管理 按钮加入菜单 */
export function authMenuCreate (data) {
  return request({
    url: '/login/auth/menu/create',
    method: 'post',
    data
  })
}
/** 菜单管理 按钮加入菜单后的修改 */
export function authMenuUpdate (data) {
  return request({
    url: '/login/auth/menu/update',
    method: 'post',
    data
  })
}
/** 菜单管理 按钮加入菜单后的删除 */
export function authMenuDelete (params) {
  return request({
    url: '/login/auth/menu/delete',
    method: 'post',
    params
  })
}

/*********      测试配置的api*************/
// ------------------------------测试页面--------------------------------
export function getJob () {
  return request({
    url: '/immediately_job/get_job',
    method: 'get',
    py: true
  })
}
export function executeJob (params) {
  return request({
    url: '/immediately_job/job_star',
    method: 'get',
    py: true,
    params
  })
}

// ------------------------------------数据同步配置---------------------------------
export function graphScanNebula (params) {
  return request({
    url: '/graph/scan/nebula/cer',
    method: 'get',
    py: true,
    params
  })
}
export function graphScanDeadLetterHandle () {
  return request({
    url: '/graph/scan/nebula/dead_letter_handle/cer',
    method: 'get',
    py: true
  })
}
export function graphScanNebulaCar (params) {
  return request({
    url: '/graph/scan/nebula/car',
    method: 'get',
    py: true,
    params
  })
}
export function graphScanDeadLetterHandleCar () {
  return request({
    url: '/graph/scan/nebula/dead_letter_handle/car',
    method: 'get',
    py: true
  })
}

export function getRecordTotalType () {
  return request({
    url: '/config/statStage/list',
    method: 'get'
  })
}
// ------------------------------------系统监控---------------------------------
// 获取数据监控的数据类型列表，包括异常状态
export function getmonitoringDataType () {
  return request({
    url: '/monitoring/dataType',
    method: 'get',
    py: true
  })
}
// 获取系统监控的单个数据的列表数据
export function getSingleDataList (data) {
  return request({
    url: '/monitoring/dataStage/cnt',
    method: 'post',
    data,
    py: true
  })
}
// 获取系统监控的折线图数据
export function getChartsList (data) {
  return request({
    url: '/monitoring/statTrend',
    method: 'post',
    data,
    py: true
  })
}
// 获取系统监控--队列 的折线图数据
export function getQueueChartsList (data) {
  return request({
    url: '/monitoring/statTrend/queue',
    method: 'post',
    data,
    py: true
  })
}

// 获取服务器时间
export function getTimeStamp () {
  return request({
    url: '/monitoring/timeStamp',
    method: 'get',
    py: true
  })
}
