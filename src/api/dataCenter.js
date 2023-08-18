import request from '@/config/request'

// 车辆数据 表格
export function queryTable_car (params) {
  return request({
    url: '/dc_car/pager',
    method: 'post',
    data: params
  })
}

// 线索查询 查询所有搜索类型
// export function queryTypeList () {
//   return request({
//     url: '/clue/findAllClueType',
//     method: 'get'
//   })
// }
// export function queryTypeList () {
//   return request({
//     url: '/analysis/getAttrTypes',
//     method: 'get',
//     warning: true
//   })
// }
// 查询区域类型
// export function queryAreaTypeList () {
//   return request({
//     url: '/rule/getFenceTypes',
//     method: 'get',
//     warning: true
//   })
// }

/**------------- 网吧数据 ---------------- */

// 网吧-> 分页查询
export function netBarPager (params) {
  return request({
    url: '/dc_netBar/pager',
    method: 'post',
    data: params
  })
}

// 网吧-> 详情/游戏账号列表
export function netBarById (id) {
  return request({
    url: '/dc_netBar/' + id,
    method: 'get'
  })
}

/**------------- 旅业数据 ---------------- */

// 旅业-> 分页查询
export function travelPager (params) {
  return request({
    url: '/dc_travel/pager',
    method: 'post',
    data: params
  })
}

// 网吧-> 详情/游戏账号列表
// export function netBarById(id) {
//   return request({
//     url: '/dc_netBar/' + id,
//     method: 'get',
//   })
// }

/**------------- 优美肇庆数据 ---------------- */

//  优美肇庆-> 分页查询
export function ymzqPager (params) {
  return request({
    url: '/dc_ymzq/pager',
    method: 'post',
    data: params
  })
}

//获取防疫数据
export function antiepidemicData (params) {
  return request({
    url: '/epidemic/pager',
    method: 'get',
    params
  })
}

//获取复工复产数据
export function getResumeWorkData (params) {
  return request({
    url: '/epidemicResumeWork/list',
    method: 'get',
    params,
    warning: true
  })
}


/**------------- 数据中心 py接口 ---------------- */

/**------------- 电子围栏数据 ---------------- */

//  电子围栏-> 分页查询
// export function elePager(params) {
//   return request({
//     url: '/search/files/fence',
//     method: 'get',
//     params,
//     py: true
//   })
// }

// 数据中心 获取电围数据list
export function elePager (params) {
  return request({
    url: '/phone/getProbePhone',
    method: 'get',
    params,
    warning: true
  })
}


// wifi热点 表格 修改热点名称
// export function remarkUpdate (params) {
//   return request({
//     url: '/search/files/wifi/remark',
//     method: 'post',
//     data: params,
//     py: true
//   })
// }

//  wifi热点 表格 修改热点名称，暂时没用了
export function remarkUpdate (params) {
  return request({
    url: '/wifi/addWifiRemark',
    method: 'post',
    data: params,
    warning: true
  })
}

//  wifi热点 表格 获取需要修改时的东西，暂时没用了
export function queryRemark (params) {
  return request({
    url: '/wifi/getWifiRemark',
    method: 'get',
    params,
    warning: true
  })
}

// 审计 表格 - 搜索
// export function queryTable_audi(params) {
//   return request({
//     url: '/search/files/audit',
//     method: 'get',
//     params,
//     py: true
//   })
// }

// 获取审计数据的list ，还在用
export function queryTable_audi (params) {
  return request({
    url: '/netWeb/getNetWeb',
    method: 'get',
    params,
    warning: true
  })
}


// wifi探针 表格 - 搜索
// export function queryTableProbe(params) {
//   return request({
//     url: '/search/files/probe',
//     method: 'get',
//     params,
//     py: true
//   })
// }

//数据中心 获取探针数据的list
export function queryTableProbe (params) {
  return request({
    url: '/mac/getProbeMac',
    method: 'get',
    params,
    warning: true
  })
}


// wifi热点 表格
// export function queryTableWifi (params) {
//   return request({
//     url: '/search/files/wifi',
//     method: 'get',
//     params,
//     py: true
//   })
// }

// 数据中心 获取wifi热点的list
export function queryTableWifi (params) {
  return request({
    url: '/wifi/getProbeWifi',
    method: 'get',
    params,
    warning: true
  })
}

// 视频门禁 - 分页
export function queryVideoControlPager (params) {
  return request({
    url: '/personGate/list',
    method: 'get',
    params: params
  })
}

// 人脸识别
export function queryFaceSnapPager (params) {
  return request({
    url: '/faceSnap/list',
    method: 'get',
    params: params
  })
}

// 获取今日数据总量
/*export function getTodayTotalApi (params) {
  return request({
    url: '/preprocess/stat/todayStat',
    method: 'get',
    params: params
  })
}*/

// 获取当前小时内的数据量
/*export function getCurrentTotalApi (params) {
  return request({
    url: '/preprocess/stat/currentHourStat',
    method: 'get',
    params: params
  })
}*/

// 获取昨日新增数据总量
/*export function getYesterdayTotalApi (params) {
  return request({
    url: '/preprocess/stat/yesterdayStat',
    method: 'get',
    params: params
  })
}*/

// 获取总数据量
/*export function getTotalApi (params) {
  return request({
    url: '/preprocess/stat/historyStat',
    method: 'get',
    params: params
  })
}*/

// 获取数据细分的数据
/*export function getBrokenDataApi (params) {
  return request({
    url: '/preprocess/stat/dataStatRange',
    method: 'post',
    data: params
  })
}*/

// 保存数据细分的数据类型
/*export function getCacheDataType (params) {
  return request({
    url: '/preprocess/stat/cacheRangeCondition',
    method: 'get',
    params: params
  })
}*/

// 获取银行卡数据
export function getBankCardData (params) {
  return request({
    url: '/bankCard/list',
    method: 'get',
    params,
    warning: true
  })
}

// 获取手机卡运营商数据
export function getPhoneOperatorData (params) {
  return request({
    url: '/phoneOperator/list',
    method: 'get',
    params,
    warning: true
  })
}

// 获取核酸记录新增情况的数据
export function getNucleicAddData (params) {
  return request({
    url: '/epidemicPositive/data',
    method: 'get',
    params: params,
    warning: true
  })
}

// 获取核酸记录新增统计的数据
export function getNucleicTotalData (params) {
  return request({
    url: '/epidemicPositive/stat',
    method: 'get',
    params: params,
    warning: true
  })
}

// 获取数据看板列表数据
export function getDataBoardData (url, isWarn, getMethod, params) {
  let paramDatas = {
    url: url,
    method: getMethod,
    warning: isWarn
  }
  if (getMethod === 'get') {
    paramDatas.params = params
  } else if (getMethod === 'post') {
    paramDatas.data = params
  }
  return request(paramDatas)
}

export function getLivePerson (params) {
  return request({
    url: '/externals/population_statistics',
    method: 'get',
    params: params,
    py: true
  })
}

export function getRecordsListApi (params) {
  return request({
    url: '/configurable/srcData/list',
    method: 'post',
    data: params
  })
}

export function getDataBoard (params) {
  return request({
    url: '/preprocess/dataCenter/stat/homeBoard',
    method: 'get',
    params: params
  })
}

export function getRecordTotal (params) {
  return request({
    url: '/preprocess/dataCenter/stat/statTrend',
    method: 'post',
    data: params
  })
}

// 获取数据细分的数据
export function getRecordDetTotal (params) {
  return request({
    url: '/preprocess/dataCenter/stat/statTrend/map',
    method: 'post',
    data: params
  })
}

// 获取数据细分展示数据的类型
export function getRecordDetType (params) {
  return request({
    url: '/preprocess/stat/map/get',
    method: 'get',
    params: params
  })
}

// 存储数据细分展示数据的类型
export function setRecordDetType (params) {
  return request({
    url: '/preprocess/stat/map/cache',
    method: 'post',
    data: params,
    formUpload: true
  })
}
