import request from '@/config/request'


/** --------------------------大屏数据---------------- */
// 总条数
export function queryTotalRecord () {
  return request({
    url: '/bscreen/total_record',
    method: 'get',
    py: true
  })
}

// 最近一分钟数据总数
export function queryMinuteRecord () {
  return request({
    url: '/bscreen/data_count_last_minute',
    method: 'get',
    py: true
  })
}

// 最近一分钟数据总数
export function queryHourRecord () {
  return request({
    url: '/bscreen/data_count_last_hour',
    method: 'get',
    py: true
  })
}

// 最近一礼拜数据总数
export function queryWeekData () {
  return request({
    url: '/bscreen/data_count_last_week',
    method: 'get',
    py: true
  })
}


// 最近24小时数据总数
export function queryDayData () {
  return request({
    url: '/bscreen/data_count_per_hour',
    method: 'get',
    py: true
  })
}

// 最近一礼拜属性总数
export function queryWeekAttrs () {
  return request({
    url: '/bscreen/attr_count_last_week',
    method: 'get',
    py: true
  })
}

// 最近一天属性总数
export function queryDayAttrs () {
  return request({
    url: '/bscreen/attr_count_per_hour',
    method: 'get',
    py: true
  })
}

// 场所排行榜
export function queryPlaceList () {
  return request({
    url: '/bscreen/top_place_collect_static',
    method: 'get',
    py: true
  })
}


export function queryEquipment () {
  return request({
    url: '/bscreen/area_equipment_static',
    method: 'get',
    py: true
  })
}

// 获取审计吞吐量
export function getAudit () {
  return request({
    url: '/bscreen/handling_capacity/audit',
    method: 'get',
    py: true
  })
}

// 获取人脸吞吐量
export function getFace () {
  return request({
    url: '/bscreen/handling_capacity/face',
    method: 'get',
    py: true
  })
}

// 获取探针吞吐量
export function getProbe () {
  return request({
    url: '/bscreen/handling_capacity/probe',
    method: 'get',
    py: true
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
