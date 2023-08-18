import request from '@/config/request'

// 模糊匹配搜索设备
export function deviceFindPage (params) {
  return request({
    url: '/device/fuzz/match/findPage',
    method: 'post',
    data: params
  })
}

//
export function findPageBySearchKeyAndType (params) {
  return request({
    url: '/place/findPageBySearchKeyAndType',
    method: 'post',
    data: params
  })
}


// 设备地图->列表模式 下级数据
export function queryCurrentRoomDeviceList (params) {
  return request({
    url: '/device/getPageByPlace',
    method: 'post',
    data: params
  })
}
// 设备地图->点击场所mark 弹出设备详情pop
export function queryDeviceList (params) {
  return request({
    url: '/device/getPageByPlace',
    method: 'post',
    data: params
  })
}

// 根据 设备ID 查询设备详情
export function queryDeviceDetail (data) {
  return request({
    url: '/device/getDevicePagerByIds',
    method: 'post',
    data
  })
}

// 设备地图->点击场所mark 弹出设备详情pop 获取设备地址
export function queryDevicePlace (data) {
  return request({
    url: '/place/get',
    method: 'post',
    data
  })
}

// 根据场所编码获取场所详情
export function getPlaceDetail (params) {
  return request({
    url: '/place/getDeviceOnlineByPlaceInfo',
    method: 'get',
    params
  })
}

// 获取大地图场所列表
export function queryAllSitePlace (params) {
  return request({
    url: '/place/getAll',
    method: 'get',
    params
  })
}

// 设备地图 -> 查询所有设备
export function getAllDevice (params) {
  return request({
    url: '/device/getAllDevice',
    method: 'GET',
    params
  })
}

// 设备地图 -> 查询所有设备
export function getAllDeviceByLoction (data) {
  return request({
    url: '/device/getAllDeviceList',
    method: 'post',
    data
  })
}


// 设备列表 筛选查询
export function placeFilterPage (params) {
  return request({
    url: '/place/filterPage',
    method: 'post',
    data: params
  })
}


// 获取场所设备数统计
export function getDeviceAndPlaceStatistics (params) {
  return request({
    url: '/statistics/getDeviceAndPlaceStatistics',
    method: 'get',
    params,
  })
}

// 获取设备在线率统计
export function getDeviceOnlineStatistics (params) {
  return request({
    url: '/statistics/getDeviceOnlineStatistics',
    method: 'get',
    params,
  })
}

// 获取场所在线率统计
export function getPlaceOnlineStatistics (params) {
  return request({
    url: '/statistics/getPlaceOnlineStatistics',
    method: 'get',
    params,
  })
}

// 获取设备类型统计
export function getDeviceTypeStatistics (params) {
  return request({
    url: '/statistics/getDeviceTypeStatistics',
    method: 'get',
    params,
  })
}

// 获取安全厂商统计
export function getFactoryStatistics (params) {
  return request({
    url: '/statistics/getFactoryStatistics',
    method: 'get',
    params,
  })
}

// 获取场所类型统计
export function getPlacleTypeStatistics (params) {
  return request({
    url: '/statistics/getPlacleTypeStatistics',
    method: 'get',
    params,
  })
}
