import request from '@/config/request'

/* 布控规则 */

// 获取当前登录账号的角色
export function getUserRoleApi (params) {
  return request({
    url: '/login/auth/role/getByUser',
    method: 'get',
    params: params,
    /*loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '加载角色数据中'*/
  })
}

// 根据角色id获取对应的布控数据
export function getRoleDataApi (params) {
  return request({
    url: '/configurable/srcData/getDataTypeByRoleId',
    method: 'get',
    params: params
  })
}

// 添加布控规则
export function addControl (params) {
  return request({
    url: '/monitor/config/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中'
  })
}

// 修改布控规则
export function updateControl (params) {
  return request({
    url: '/monitor/config/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中'
  })
}

// 修改布控规则的状态
export function updateControlStatus (params) {
  return request({
    url: '/monitor/config/status/switch',
    method: 'post',
    data: params,
    formUpload: true,
    loading: true,
    loadingDom: '.control_list_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '修改中'
  })
}

// 删除布控规则
export function delControlApi (params) {
  return request({
    url: '/monitor/config/del',
    method: 'post',
    data: params,
    formUpload: true,
    loading: true,
    loadingDom: '.control_list_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

/* 特征设置分组 */

// 特征设置-获取分组列表
export function getFeatureGroup (params) {
  return request({
    url: '/monitor/features/group/list',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 特征设置-添加分组
export function addFeatureGroup (params) {
  return request({
    url: '/monitor/features/group/add',
    method: 'post',
    data: params
  })
}

// 特征设置-分组重命名
export function updateFeatureGroup (params) {
  return request({
    url: '/monitor/features/group/update',
    method: 'post',
    data: params
  })
}

// 特征设置-分组删除
export function delFeatureGroup (params) {
  return request({
    url: '/monitor/features/group/del',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 特征设置-特征新增
export function addFeature (params) {
  return request({
    url: '/monitor/features/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中'
  })
}

// 特征设置-特征修改
export function updateFeature (params) {
  return request({
    url: '/monitor/features/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '修改中'
  })
}

// 特征设置-特征批量删除
export function batchDelFeature (params) {
  return request({
    url: '/monitor/features/batchDel',
    method: 'post',
    data: params,
    formUpload: true,
    loading: true,
    loadingDom: '.feature_set_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '批量删除中'
  })
}

// 特征设置-特征规则删除
export function delFeatureApi (params) {
  return request({
    url: '/monitor/features/del',
    method: 'post',
    data: params,
    formUpload: true,
    loading: true,
    loadingDom: '.feature_set_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 特征设置-获取特征下拉框选项
export function getFeatureOptionsApi (params) {
  return request({
    url: '/configurable/graph_entity_label/manage/getTraceLabel',
    method: 'get',
    params: params
  })
}

// 特征设置-特征分组变更
export function changeGroup (params) {
  return request({
    url: '/monitor/features/group/change',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '变更分组中'
  })
}

/*布控地图*/

// 布控地图-获取本周触警
export function getWeekTotal (params) {
  return request({
    url: '/monitor/stat/trend/day',
    method: 'post',
    data: params
  })
}

// 布控地图-获取当天触警
export function getTodayTotal (params) {
  return request({
    url: '/monitor/stat/trend/hour',
    method: 'post',
    data: params
  })
}

// 布控地图-获取当天触警
export function getPandectTotal (params) {
  return request({
    url: '/monitor/stat/overview',
    method: 'get',
    params: params
  })
}

// 布控地图-获取全部布控区域
export function getAllControlRegion (params) {
  return request({
    url: '/monitor/config/regionRange/list',
    method: 'post',
    data: params
  })
}

// 布控地图-获取无坐标列表数据和地图预警点数据
export function getTriggerMapListApi () {
  return request({
    url: '/monitor/message/list',
    method: 'get'
  })
}

// 布控地图-修改预警的处理状态
export function updateWarnStatus (params) {
  return request({
    url: '/monitor/message/status/switch',
    method: 'get',
    params: params
  })
}

// 防控预警-获取触警列表的数据
export function getCurrentTriggerList (params) {
  return request({
    url: '/monitor/message/notification',
    method: 'get',
    params: params
  })
}

// 防控预警-获取触警列表的数据
export function handleTriggerRead (params) {
  return request({
    url: '/monitor/message/read',
    method: 'post',
    data: params
  })
}
