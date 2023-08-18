import request from '@/config/request'
// import axios from 'axios'

// --------------- 角色管理 -----------------
// 角色管理 分页表格
export function listRoleByPage (param) {
  return request({
    url: '/role/pager',
    method: 'post',
    data: param,
  })
}
// 角色管理 新建菜单查询
export function listPermissions (data) {
  return request({
    url: '/sys/menu/tree',
    method: 'get',
    data,
  })
}
// 角色管理 删除角色
export function deleteRole (id) {
  return request({
    url: '/role/deleteRole/' + id,
    method: 'delete',
  })
}
// 删除用户
export function deleteUser (id) {
  return request({
    url: '/authority/deleteUser/' + id,
    method: 'delete',
  })
}
// 角色管理 禁用/启用角色
export function onOffRole (param) {
  return request({
    url: '/role/onOffRole',
    method: 'post',
    data: param,
  })
}

// 角色管理 新建角色
export function addRole (param) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data: param,
  })
}
// 角色管理 更新角色
export function updateRole (param) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: param,
  })
}

// --------------- 日志管理 -----------------
// 新接口
export function statisticsLog (param) {
  return request({
    url: '/log/statisticsLog',
    method: 'post',
    data: param,
  })
}

// --------------- 个人信息 -----------------
// 个人信息 信息查询
export function authorityById (id) {
  return request({
    url: '/authority/' + id,
    method: 'get',
  })
}
// 修改个人信息
export function upCurrentUser (param) {
  return request({
    url: '/authority/upCurrentUser',
    method: 'post',
    data: param,
  })
}

// 修改密码
export function alter_password (param) {
  return request({
    url: '/authority/alter_password',
    method: 'post',
    data: param,
  })
}

// --------------- 用户管理 -----------------
// 用户管理 分页表格
export function listUserByPage (param) {
  return request({
    url: '/authority/listUserByPage',
    method: 'post',
    data: param,
  })
}

// 用户管理 禁用/启用用户
export function onOffUser (param) {
  return request({
    url: '/authority/onOffUser',
    method: 'post',
    data: param,
  })
}
// 用户管理 添加用户--查询所有可选角色列表
export function authorityListRoles (data) {
  return request({
    url: '/role/list',
    method: 'get',
    data,
  })
}
// 用户管理 添加用户
export function addUser (param) {
  return request({
    url: '/authority/addUser',
    method: 'post',
    data: param,
  })
}
// 用户管理 修改用户
export function updateUser (param) {
  return request({
    url: '/authority/updateUser',
    method: 'post',
    data: param,
  })
}

// 用户管理 重置密码
export function setDefaultPass (param) {
  return request({
    url: '/authority/setDefaultPass',
    method: 'post',
    data: param,
  })
}

// --------------- 文件上传 -----------------
export function importExcel (param) {
  return request({
    url: '/excel/import/excel',
    method: 'post',
    data: param,
  })
}

export function validationStart (params) {
  return request({
    url: '/devops/validation/start',
    method: 'get',
    params,
    py: true
  })
}

export function validationRecords (params) {
  return request({
    url: '/devops/validation/records',
    method: 'get',
    params,
    py: true
  })
}

// 短信记录
export function smsRecord (params) {
  return request({
    url: '/externals/sms/records',
    method: 'get',
    params,
    py: true
  })
}

// 配置校验
export function compareResult (params) {
  return request({
    url: '/compare/result',
    method: 'get',
    params,
    py: true
  })
}
// --------------- 申请管理 -----------------
// 申请管理 分页表格
export function listApplyByPage (params) {
  return request({
    url: '/login/oauth/applicationList',
    method: 'get',
    params
  })
}

// ------------------applicationManagement部门管理---------------------
// 创建部门
export function authOrgCreate (params) {
  return request({
    url: '/login/auth/org/create',
    method: 'post',
    data: params
  })
}
// 重命名部门
export function authOrgUpdate (params) {
  return request({
    url: '/login/auth/org/update',
    method: 'post',
    data: params
  })
}
// 删除部门
// export function authOrgCreate(params) {
//   return request({
//     url: '/auth/org/create',
//     method: 'post',
//     data: param
//   })
// }
// 查询部门树型
// let _cancel = ''
export function authOrgListWithTree (params) {
  // try {
  //   _cancel()
  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/login/auth/org/listWithTree',
    method: 'get',
    params,
    cancelMuchRequest: true
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   _cancel = cancel
    // })
  })
}
// 申请管理 点击重置
export function clickApplication (params) {
  return request({
    url: '/login/oauth/clickApplication',
    method: 'get',
    params
  })
}
// 删除，修改，停用角色
export function authRoleUpdate (params) {
  return request({
    url: '/login/auth/role/update',
    method: 'post',
    data: params
  })
}
// 根据部门查询角色列表
export function queryRoleByOrgId (params,loadingObj) {
  return request({
    url: '/login/auth/role/queryRoleByOrgId',
    method: 'get',
    params,
    ...loadingObj
  })
}
// 申请管理 获取密码
export function getPassWord (params) {
  return request({
    url: '/login/oauth/getPassWord',
    method: 'get',
    params,
    meta: {
      all: true
    }
  })
}
// 根据角色id查询菜单
// export function listWithTreeByRoleId (params) {
//   return request({
//     url: '/login/auth/menu/listWithTreeByRoleId',
//     method: 'get',
//     params
//   })
// }
// 根据角色id查询功能菜单
export function listWithTreeByRoleId (params,loadingObj) {
  return request({
    url: '/login/auth/module/listWithTreeByRoleId',
    method: 'get',
    params,
    ...loadingObj
  })
}
// --------------- 申请管理 -----------------
// 申请管理 分页表格
// export function listApplyByPage(params) {
//   return request({
//     url: '/login/oauth/applicationList',
//     method: 'get',
//     params
//   })
// }
// 查询菜单
// export function listWithTree () {
//   return request({
//     url: '/login/auth/menu/listWithTree',
//     method: 'get'
//   })
// }
// 查询功能菜单
export function listWithTree (params) {
  return request({
    url: '/login/auth/module/listWithTree',
    method: 'get',
    ...params
  })
}

// 新增角色
export function authRoleCreate (params) {
  return request({
    url: '/login/auth/role/create',
    method: 'post',
    data: params
  })
}

// 角色的删除，停用，启用
export function roleUpdateByRoleId (id, params) {
  return request({
    url: '/login/auth/role/updateByRoleId/' + id,
    method: 'put',
    params
  })
}


// 根据树id去查询用户
export function queryUserByOrgId (params) {
  return request({
    url: '/login/auth/user/queryUserByOrgId',
    method: 'get',
    params
  })
}
// 权限复制查询菜单和角色树
export function listTreeWithRole () {
  return request({
    url: '/login/auth/org/listTreeWithRole',
    method: 'get'
  })
}

// 新增用户
export function authUserCreate (params) {
  return request({
    url: '/login/auth/user/create',
    method: 'post',
    data: params
  })
}
// 修改用户
export function authUserUpdate (params) {
  return request({
    url: '/login/auth/user/update',
    method: 'post',
    data: params
  })
}
// 删除、启用禁用
export function updateByUserId (id, params) {
  return request({
    url: '/login/auth/user/updateByUserId/' + id,
    method: 'put',
    params,
    meta: {
      all: true
    }
  })
}

// 删除、启用禁用
export function userChangeOrgBatch (params) {
  return request({
    url: '/login/auth/user/changeOrgBatch',
    method: 'put',
    data: params
  })
}
// 根据用户的id去查所有的角色
export function getAllRoleByUserId (params) {
  return request({
    url: '/login/auth/user/getAllRoleByUserId',
    method: 'get',
    params
  })
}
// 数据导入修改同步状态
export function recImpChangeFlag (params) {
  return request({
    url: '/configurable/srcData/sync',
    method: 'post',
    data: params
  })
}
// 数据导入创建数据
export function recImpCreate (params) {
  return request({
    url: '/configurable/srcData/create',
    method: 'post',
    data: params
  })
}
// 数据导入创建数据
export function recImpUpdate (params) {
  return request({
    url: '/configurable/srcData/update',
    method: 'post',
    data: params
  })
}
// 获取数据导入的类型
export function getRecImpType (params, loadingDom, isLoading = true) {
  return request({
    url: '/configurable/srcData/typeList',
    method: 'post',
    data: params,
    loading: isLoading,
    loadingDom: loadingDom,
    loadingBg: '--loading-color-1'
  })
}

export function recImpUploadSql (params) {
  return request({
    url: '/configurable/srcData/sqlInsert',
    method: 'post',
    formUpload: true,
    data: params
  })
}
// --------------- 档案管理 -----------------
// 列头字段查询
export function getColumnList (params) {
  return request({
    url: '/configurable/person/data/config/list',
    method: 'get',
    params
  })
}
// 修改配置字段
export function updateCheckList (params) {
  return request({
    url: '/configurable/person/data/config/update',
    method: 'post',
    data: params
  })
}

// locationTest为连接本地后台测试使用，正式环境删除

/* 数据管理 */

export function getUseStandardApi () {
  return request({
    url: '/configurable/data_standard/used',
    method: 'post'
  })
}

// 标签库--获取实体的数据
export function getEntityListApi (params, loading = false) {
  return request({
    url: '/configurable/graph_entity/manage/list',
    method: 'post',
    data: params,
    loading: loading,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1'
  })
}

// 标签库--获取数据标准的数据
export function getStandardListApi (params, loading = false) {
  return request({
    url: '/configurable/data_standard/list',
    method: 'post',
    data: params,
    loading: loading,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1'
  })
}

// 标签库--获取数据标准的数据
export function getRelationApi (params, loading = false) {
  return request({
    url: '/configurable/graph_relationship/manage/list',
    method: 'post',
    data: params,
    loading: loading,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
  })
}

// 标签库--获取数据标准的数据
export function getTrailApi (params, loading = false) {
  return request({
    url: '/configurable/label_trace/manage/list',
    method: 'post',
    data: params,
    loading: loading,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
  })
}

// 标签库--数据标准的新建和更新
export function operaStandardApi (params, way = 'insert') {
  return request({
    url: `/configurable/data_standard/${way}`,
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-2',
    loadingText: '提交中'
  })
}

// 标签库--数据标准的新建和更新
export function delStandardApi (params) {
  return request({
    url: '/configurable/data_standard/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 标签库--实体属性的新建和更新
export function operaEntityAttr (params, way = 'insert') {
  return request({
    url: `/configurable/graph_entity_label/manage/${way}`,
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-2',
    loadingText: '提交中'
  })
}

// 标签库--实体属性的删除
export function delEntityAttr (params) {
  return request({
    url: '/configurable/graph_entity_label/manage/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 标签库--实体的新建和更新
export function operaEntity (params, way = 'insert') {
  return request({
    url: `/configurable/graph_entity/manage/${way}`,
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-2',
    loadingText: '提交中'
  })
}

// 标签库--实体的删除
export function delEntity (params) {
  return request({
    url: '/configurable/graph_entity/manage/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 标签库--关系的新建和更新
export function operaRelation (params, way = 'insert') {
  return request({
    url: `/configurable/graph_relationship/manage/${way}`,
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.pop_dialog',
    loadingBg: '--loading-color-2',
    loadingText: '提交中'
  })
}

// 标签库--关系的删除
export function delRelation (params) {
  return request({
    url: '/configurable/graph_relationship/manage/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 标签库--数据轨迹 人/物的新建和更新
export function operaTrailAttr (params, way = 'insert') {
  return request({
    url: `/configurable/label_trace/manage/${way}`,
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-2',
    loadingText: '提交中'
  })
}

// 标签库--数据轨迹 人/物的删除
export function delTrailAttr (params) {
  return request({
    url: '/configurable/label_trace/manage/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.records_manage_wrap',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

/* 数据轨迹 */

// 数据轨迹--单个数据已有的轨迹规则列表
export function getTrailDetail (params) {
  return request({
    url: '/configurable/label_trace/rule/list',
    method: 'post',
    data: params
  })
}

// 获取数据轨迹单个数据的字段规则
export function getTrailAttrApi (params) {
  return request({
    url: '/configurable/label_trace/rule/listField',
    method: 'post',
    data: params
  })
}

// 数据轨迹--新增和修改轨迹规则
export function operaTrail (params, way = 'insert') {
  return request({
    url: `/configurable/label_trace/rule/${way}`,
    method: 'post',
    data: params
  })
}

// 数据轨迹--新增和修改轨迹规则
export function delTrail (params) {
  return request({
    url: '/configurable/label_trace/rule/delete',
    method: 'post',
    data: params
  })
}

/* 数据图谱 */

// 数据图谱--获取图标
export function getAtlasIconApi (params) {
  return request({
    url: '/configurable/graph_icon/list',
    method: 'post',
    data: params
  })
}

// 数据图谱--图标上传
export function atlasIconUpload (params) {
  return request({
    url: '/configurable/graph_icon/insert',
    method: 'post',
    formUpload: true,
    data: params
  })
}
// 数据图谱--图标删除
export function delAtlasIcon (params) {
  return request({
    url: '/configurable/graph_icon/delete',
    method: 'post',
    data: params,
    loading: true,
    loadingDom: '.wrap_content',
    loadingBg: '--loading-color-1',
    loadingText: '删除中'
  })
}

// 获取图谱数据
export function getAtlasDataApi (params) {
  return request({
    url: '/configurable/graph_entity/mapping/list',
    method: 'post',
    data: params
  })
}

// 数据图谱--获取数据可编辑的实体
export function getAtlasEntityApi (params) {
  return request({
    url: '/configurable/graph_entity/mapping/listEntityOptional',
    method: 'post',
    data: params
  })
}

// 数据图谱--获取数据可编辑的实体的属性
export function getAtlasEntityAttr (params) {
  return request({
    url: '/configurable/graph_entity/mapping/listFieldOptional',
    method: 'post',
    data: params
  })
}

// 数据图谱--新增实体
export function addAtlasEntity (params, way) {
  return request({
    url: `/configurable/graph_entity/mapping/${way}`,
    method: 'post',
    data: params
  })
}

// 数据图谱--更新时清空实体属性
// export function delAtlasEntityAttr (params) {
//   return request({
//     url: '/configurable/graph_entity_label/mapping/delete',
//     method: 'post',
//     data: params
//   })
// }

// 数据图谱--删除实体
export function delAtlasEntity (params) {
  return request({
    url: '/configurable/graph_entity/mapping/delete',
    method: 'post',
    data: params
  })
}

// 数据图谱--删除实体的关系
// export function delAtlasRelation (params) {
//   return request({
//     url: '/configurable/graph_relationship/mapping/delete',
//     method: 'post',
//     data: params
//   })
// }
