import request from '@/config/request'

// 新建应用
export function uploadFileApi (params) {
  return request({
    url: '/app/upload/file',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 获取可选数据
export function getDataSourceApi (params) {
  return request({
    url: '/app/modeling/dataSource/list',
    method: 'post',
    data: params
  })
}

/* 应用中心--应用设置 */

// 获取应用列表
export function getAppListApi (params, isLoad) {
  return request({
    url: '/app/settings/list',
    method: 'get',
    params: params,
    loading: isLoad,
    loadingDom: '.app_set_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '数据加载中'
  })
}

// 新建应用
export function addAppApi (params) {
  return request({
    url: '/app/settings/add',
    method: 'post',
    data: params
  })
}

// 修改应用
export function updateAppApi (params) {
  return request({
    url: '/app/settings/update',
    method: 'post',
    data: params
  })
}

// 停用应用
export function stopAppApi (params) {
  return request({
    url: '/app/settings/deactivate',
    method: 'post',
    data: params
  })
}

// 删除应用
export function delAppApi (params) {
  return request({
    url: '/app/settings/delete',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 公开应用
export function openAppApi (params) {
  return request({
    url: '/app/settings/communal',
    method: 'post',
    data: params
  })
}

// 复制应用
export function copyAppApi (params) {
  return request({
    url: '/app/settings/copy',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 获取全部角色
export function getAllRoleApi (params) {
  return request({
    url: '/login/auth/role/getAllRole',
    method: 'get',
    params: params,
  })
}

/* 应用中心--应用页面接口 */

// 应用页面查询
export function getAppPagesApi (params) {
  return request({
    url: '/app/page/list',
    method: 'get',
    params: params
  })
}

// 应用页面新增
export function addAppPageApi (params) {
  return request({
    url: '/app/page/add',
    method: 'post',
    data: params
  })
}

// 应用页面重命名
export function renameAppPageApi (params) {
  return request({
    url: '/app/page/rename',
    method: 'post',
    data: params
  })
}

// 应用页面删除
export function delAppPageApi (params) {
  return request({
    url: '/app/page/delete',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 应用页面置于首页
export function toHomePageApi (params) {
  return request({
    url: '/app/page/homepage',
    method: 'post',
    data: params,
    formUpload: true
  })
}

/* 应用中心--应用模块接口 */

// 应用模块查询
export function getAppPageModulesApi (params) {
  return request({
    url: '/app/container/list',
    method: 'get',
    params: params
  })
}

// 应用模块新增
export function addModuleApi (params) {
  return request({
    url: '/app/container/add',
    method: 'post',
    data: params
  })
}

// 应用模块删除
export function delModuleApi (params) {
  return request({
    url: '/app/container/delete',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 应用模块重命名修改
export function updateModuleApi (params) {
  return request({
    url: '/app/container/rename',
    method: 'post',
    data: params
  })
}

// 应用模块位置修改
export function updateModuleCoordinateApi (params) {
  return request({
    url: '/app/container/layout/update',
    method: 'post',
    data: params
  })
}

/* 应用中心--数据编辑 */

// 添加数据源
export function setModuleSourceApi (params) {
  return request({
    url: '/app/modeling/dataSource/add',
    method: 'post',
    data: params
  })
}

// 获取操作记录
export function getRecordApi (params) {
  return request({
    url: '/app/modeling/record/list',
    method: 'get',
    params: params
  })
}

// 获取当前应用的页面和容器
export function getAppPagesModulesApi (params) {
  return request({
    url: '/app/modeling/dataSource/list/container',
    method: 'get',
    params: params
  })
}

// 汇总--新增
export function addModuleCollectApi (params) {
  return request({
    url: '/app/modeling/aggregate/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 汇总--编辑
export function updateModuleCollectApi (params) {
  return request({
    url: '/app/modeling/aggregate/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 算法--新增
export function addModuleAlgApi (params) {
  return request({
    url: '/app/modeling/algorithm/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 算法--编辑
export function updateModuleAlgApi (params) {
  return request({
    url: '/app/modeling/algorithm/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 分组--新增
export function addModuleGroupApi (params) {
  return request({
    url: '/app/modeling/group/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 分组--编辑
export function updateModuleGroupApi (params) {
  return request({
    url: '/app/modeling/group/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 时间转换--新增
export function addModuleTimeApi (params) {
  return request({
    url: '/app/modeling/time_conversion/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 时间转换--编辑
export function updateModuleTimeApi (params) {
  return request({
    url: '/app/modeling/time_conversion/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 排序--新增
export function addModuleSortApi (params) {
  return request({
    url: '/app/modeling/sort/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 排序--编辑
export function updateModuleSortApi (params) {
  return request({
    url: '/app/modeling/sort/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 字段设置--新增
export function addModuleFieldApi (params) {
  return request({
    url: '/app/modeling/field/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 字段设置--编辑
export function updateModuleFieldApi (params) {
  return request({
    url: '/app/modeling/field/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 链接--新增
export function addModuleLinkApi (params) {
  return request({
    url: '/app/modeling/link/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 链接--编辑
export function updateModuleLinkApi (params) {
  return request({
    url: '/app/modeling/link/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 过滤--新增
export function addModuleFilterApi (params) {
  return request({
    url: '/app/modeling/filter/add',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 过滤--编辑
export function updateModuleFilterApi (params) {
  return request({
    url: '/app/modeling/filter/update',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 左右合并--新增
export function addModuleMergeApi (params) {
  return request({
    url: '/app/modeling/merge/add',
    method: 'post',
    data: params
  })
}

// 左右合并--编辑
export function updateModuleMergeApi (params) {
  return request({
    url: '/app/modeling/merge/update',
    method: 'post',
    data: params
  })
}

// 左右合并--获取合并表字段kudu
export function moduleMergeTableFiled (params) {
  return request({
    url: '/app/modeling/merge/table/field',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 左右合并--获取合并表字段csv
export function moduleMergeTableFiledCsv (params) {
  return request({
    url: '/app/modeling/merge/csv/field',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 展示方式--新增
export function addModuleModeApi (params, isLoad = false) {
  return request({
    url: '/app/modeling/display/add',
    method: 'post',
    data: params,
    loading: isLoad,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 展示方式--编辑
export function updateModuleModeApi (params, isLoad = false) {
  return request({
    url: '/app/modeling/display/update',
    method: 'post',
    data: params,
    loading: isLoad,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-1',
    loadingText: '提交中...'
  })
}

// 操作--查询接口
export function findModuleOperaApi (url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

// 操作--删除接口
export function delModuleOperaApi (url, params) {
  return request({
    url: url,
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 获取字段
export function getCanEditFieldApi (params) {
  return request({
    url: '/app/container/field/list',
    method: 'get',
    params: params
  })
}

// 获取模块数据
export function getModuleDataApi (params) {
  return request({
    url: '/app/modeling/result',
    method: 'post',
    data: params
  })
}

// 修改字段排序
export function changeFieldSortApi (params) {
  return request({
    url: '/app/container/field/sort',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.edit_page_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '修改中...'
  })
}

// 修改字段名
export function changeFieldNameApi (params) {
  return request({
    url: '/app/container/field/rename',
    method: 'post',
    data: params,
    formUpload: true,
    loading: true,
    loadingDom: '.edit_page_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '修改中...'
  })
}

// 运行
export function appDevopsApi (params) {
  return request({
    url: '/devops/app_center',
    method: 'post',
    data: params,
    py: true
  })
}

// 获取运行状态
export function getDevopsStatusApi (params) {
  return request({
    url: '/app/modeling/record/getNewRecord',
    method: 'get',
    params: params
  })
}

// 更新模块运行中的状态
export function updateStateApi (params) {
  return request({
    url: '/app/modeling/record/running',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// 释放资源
/*export function scannerCloseApi (params) {
  return request({
    url: '/app/modeling/scanner/close',
    method: 'post',
    data: params,
    formUpload: true
  })
}*/
