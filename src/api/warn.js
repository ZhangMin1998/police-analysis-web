// 防控预警
import request from '@/config/request'
// import axios from 'axios'
// ----------------- 重点人预警 api 开始 -----------------
// 根据场所关键字查询列表
// type 为 1 的话是场所
export function findPageBySearchKey (params) {
  return request({
    url: '/place/findPageBySearchKeyAndType',
    method: 'post',
    data: params
  })
}
// ----------------- 重点人预警 api 结束-----------------

// ----------------- 特征预警 api 开始 -----------------

// 特征预警->规则列表 编辑 查询单个特征
export function queryFeatureListItem (id) {
  return request({
    url: '/warn/clue/' + id,
    method: 'get'
  })
}
// 特征预警->规则列表 新建组
export function addGroup (params) {
  return request({
    url: '/warn/clue/group',
    method: 'post',
    data: params
  })
}
// 特征预警 -> 新建特征规则
export function addFeature (params) {
  return request({
    url: '/warn/clue/create',
    method: 'post',
    data: params
  })
}
// 特征预警->新建规则 查询全部组
export function queryAllGroup () {
  return request({
    url: '/warn/clue/group/list',
    method: 'get'
  })
}
// 特征预警 -> 修改特征规则
export function updateFeature (params) {
  return request({
    url: '/warn/clue/update',
    method: 'post',
    data: params
  })
}

// ----------------- 特征预警 api 结束 -----------------

// ----------------- 作息预警 api 结束 -----------------

/**---------   深居简出  ----------- */
// 深居简出规则 -> 分页表格
export function DeepLivePager (params) {
  return request({
    url: '/warn/reclusive/list/page',
    method: 'post',
    data: params
  })
}

// 深居简出规则 -> 新增规则
export function DeepLiveAdd (params) {
  return request({
    url: '/warn/reclusive/insert',
    method: 'post',
    data: params
  })
}

// 深居简出规则 -> 编辑规则
export function DeepLiveEdit (params) {
  return request({
    url: '/warn/reclusive/update',
    method: 'post',
    data: params
  })
}

// 深居简出规则 -> 删除规则
export function DeepLiveDel (id) {
  return request({
    url: '/warn/reclusive/delete/' + id,
    method: 'post'
  })
}

// 深居简出规则 -> 查询规则
export function DeepLiveQuery (id) {
  return request({
    url: '/warn/reclusive/get/' + id,
    method: 'post'
  })
}

/**---------   频繁夜出  ----------- */
// 频繁夜出规则 -> 分页表格
export function ManyNightsPager (params) {
  return request({
    url: '/warn/frequent/list/page',
    method: 'post',
    data: params
  })
}

// 频繁夜出规则 -> 新增规则
export function ManyNightsAdd (params) {
  return request({
    url: '/warn/frequent/insert',
    method: 'post',
    data: params
  })
}

// 频繁夜出规则 -> 编辑规则
export function ManyNightsEdit (params) {
  return request({
    url: '/warn/frequent/update',
    method: 'post',
    data: params
  })
}

// 频繁夜出规则 -> 删除规则
export function ManyNightsDel (id) {
  return request({
    url: '/warn/frequent/delete/' + id,
    method: 'post'
  })
}

// 频繁夜出规则 -> 查询规则
export function ManyNightsQuery (id) {
  return request({
    url: '/warn/frequent/get/' + id,
    method: 'post'
  })
}

/**---------   昼伏夜出  ----------- */
// 昼伏夜出规则 -> 分页表格
export function NightsOutPager (params) {
  return request({
    url: '/warn/vespertineRule/list/page',
    method: 'post',
    data: params
  })
}

// 昼伏夜出规则 -> 新增规则
export function NightsOutAdd (params) {
  return request({
    url: '/warn/vespertineRule/insert',
    method: 'post',
    data: params
  })
}

// 昼伏夜出规则 -> 编辑规则
export function NightsOutEdit (params) {
  return request({
    url: '/warn/vespertineRule/update',
    method: 'post',
    data: params
  })
}

// 昼伏夜出规则 -> 删除规则
export function NightsOutDel (id) {
  return request({
    url: '/warn/vespertineRule/delete/' + id,
    method: 'post'
  })
}

// 昼伏夜出规则 -> 查询规则
export function NightsOutQuery (id) {
  return request({
    url: '/warn/vespertineRule/get/' + id,
    method: 'post'
  })
}

/** 作息预警 历史预警 分页 */
export function AnalysisHistoryPager (params) {
  return request({
    url: '/warn/frequent/warnInfo/page',
    method: 'post',
    data: params
  })
}

// ----------------- 作息预警 api 结束 -----------------

// ----------------- 手机预警 api 开始 -----------------

// 手机预警 -》 规则列表分页
export function mobileListPager (params) {
  return request({
    url: '/warn/phone_rule/pager',
    method: 'post',
    data: params
  })
}

// 手机预警 -》 新建规则
export function mobileAddRule (params) {
  return request({
    url: '/warn/phone_rule/save',
    method: 'post',
    data: params
  })
}

// 手机预警 -》 编辑规则
export function mobileEditRule (params) {
  return request({
    url: '/warn/phone_rule/update',
    method: 'post',
    data: params
  })
}

// 手机预警 -》 删除规则
export function mobileDelRule (id) {
  return request({
    url: '/warn/phone_rule/delete/' + id,
    method: 'post'
  })
}

// 手机预警 -》 一机多卡、一机多号的排行榜
export function mobileTops (type) {
  return request({
    url: '/warn/phone_rule/rank?type=' + type,
    method: 'get'
  })
}

// 手机预警 -》查询手机预警的分页
export function mobilePager (params) {
  return request({
    url: '/warn/phone_rule/info/pager',
    method: 'post',
    data: params
  })
}

// 手机预警 -》查询手机预警的分页
export function mobileGetTotal () {
  return request({
    url: '/warn/phone_rule/getTotal',
    method: 'post'
  })
}

// ----------------- 手机预警 api 结束 -----------------

// ----------------- 发送手机短信 开始 -----------------

// 发送手机短信 -》 获取短信模板及用户
export function queryClue_phone (type) {
  return request({
    url: '/warn/message?type=' + type,
    method: 'get'
  })
}

// 发送手机短信 -》 设置规则的发送对象
export function addMessageUser (params) {
  return request({
    url: '/warn/message/addMessageUser',
    method: 'post',
    data: params
  })
}

// ----------------- 发送手机短信 结束 -----------------

/**---------   区域预警  ----------- */
/**---------   逗留  ----------- */
// 逗留 -> 分页表格
export function StayPager (params) {
  return request({
    url: '/warn/stayRule/list/page',
    method: 'post',
    data: params
  })
}

// 逗留 -> 新增规则
export function StayAdd (params) {
  return request({
    url: '/warn/stayRule/insert',
    method: 'post',
    data: params
  })
}

// 逗留 -> 编辑规则
export function StayEdit (params) {
  return request({
    url: '/warn/stayRule/update',
    method: 'post',
    data: params
  })
}

// 逗留 -> 删除规则
export function StayDel (id) {
  return request({
    url: '/warn/stayRule/delete/' + id,
    method: 'post'
  })
}

// 逗留 -> 查询规则
export function StayQuery (id) {
  return request({
    url: '/warn/stayRule/get/' + id,
    method: 'post'
  })
}

// 逗留 -> 查询历史
export function queryStayHistory (params) {
  return request({
    url: '/warn/stayRule/warnInfo/page',
    method: 'post',
    data: params
  })
}

// --------------------------  区域预警 -----------------------


// 区域防控 新建区域 区域范围 通过多边形经纬度 获取设备场所
// export function queryAreaDeviceAndPlace (data) {
//   return request({
//     url: '/fence/getFencePlaceAndDeviceInfo',
//     method: 'post',
//     data,
//     warning: true
//   })
// }
// 区域防控 新建区域 区域范围 通过多边形经纬度 获取设备场所 (多个区域)
// export function queryManyAreaDeviceAndPlace (data) {
//   return request({
//     url: '/fence/getPlaceAndDeviceList',
//     method: 'post',
//     data,
//     warning: true
//   })
// }

// 区域防控 首页 获取区域列表
// export function queryAllArea (params) {
//   return request({
//     url: '/rule/getFences',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 区域防控 首页 获取区域列表
export function getWarnLevelNumber () {
  return request({
    url: '/fence/getFenceCountByLevel',
    method: 'get',
    warning: true
  })
}

// 地图预警：获取各防控级别数量
// export function getMapWarnLevelNumber (params) {
//   return request({
//     url: '/message/getCountsByLevel',
//     method: 'get',
//     params,
//     warning: true
//   })
// }


/** --------------- 重点防控 ---------------- */

// 获取 历史重点防控 分页表
// export function queryWarnHistoryPager (params) {
//   return request({
//     url: '/message/getMessageList',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 分页条件查询消息列表（特征预警）
// export function queryWarnFeatureHistoryPager (params) {
//   return request({
//     url: '/message/getMessages',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 获取 规则重点防控 分页表
// export function queryWarnRulePager (params) {
//   return request({
//     url: '/rule/getRuleList',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 重点防控 --   删除 规则
// export function delWarnRuleById (id) {
//   return request({
//     url: '/rule/delete/' + id,
//     method: 'post',
//     warning: true
//   })
// }
// 重点防控 --   数据类型列表
export function configurableSrcDataAll () {
  return request({
    url: '/configurable/srcData/all',
    method: 'get'
  })
}

// 重点防控 --   发送人员列表
export function queryReceiverPersonList () {
  return request({
    url: '/rule/getAuthorityList',
    method: 'get',
    warning: true
  })
}

// 重点防控 --   查询监控人员列表
// let _cancel = ''
// export function queryAllPersonList (params) {
//   // try {
//   //   _cancel()
//   // } catch (err) {
//   //   console.log(err);
//   // }
//   return request({
//     url: '/rule/getPersonList',
//     method: 'get',
//     params,
//     warning: true,
//     cancelMuchRequest: true
//     // cancelToken: new axios.CancelToken(function (cancel) {
//     //   _cancel = cancel
//     // })
//   })
// }

// 重点防控 --   根据人员ids生成列表信息
// export function queryPersonListByPersonIds (data) {
//   return request({
//     url: '/rule/getPersonListByPersonIds',
//     method: 'post',
//     data,
//     warning: true
//   })
// }

// 重点防控 --   根据人员ids生成列表信息
// export function queryFencePlaceAndDevice (data) {
//   return request({
//     url: '/fence/getPlaceAndDeviceInfo',
//     method: 'post',
//     data,
//     warning: true
//   })
// }


// 重点防控 -- 预警历史消息 -- 根据人员ids生成详情分页列表
// export function queryMessageListByPersonId (params) {
//   return request({
//     url: '/message/getMessageListByPersonId',
//     method: 'get',
//     params,
//     warning: true
//   })
// }


// 重点防控 -- 预警规则 新建提交
// export function insertWarnArea (data) {
//   return request({
//     url: '/rule/create',
//     method: 'post',
//     data,
//     warning: true
//   })
// }

// 重点防控 -- 预警规则编辑提交
// export function updateWarnArea (data) {
//   return request({
//     url: '/rule/update',
//     method: 'post',
//     data,
//     warning: true
//   })
// }

// 重点防控 -- 预警规则 -- 根据id查询规则
// export function queryImportantRuleById (id) {
//   return request({
//     url: '/rule/getRuleById/' + id,
//     method: 'get',
//     warning: true
//   })
// }

// 重点防控 -- 首页 -- 查询轨迹
// export function queryImportantTrack (params) {
//   return request({
//     url: '/message/getMessageTracks',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 重点防控 首页 获取区域列表
// export function queryWarnPersonByPosition (params) {
//   return request({
//     url: '/message/getMessageListByPoints',
//     method: 'get',
//     params,
//     warning: true
//   })
// }


// 获取 历史区域预警 打开/关闭24h监控预警
export function radioDisturbing (data) {
  return request({
    url: '/message/updateNoDisturbingStatus',
    method: 'post',
    data,
    warning: true
  })
}

// 新建预警 获取经纬度下的设备
// export function queryBoundaryPlaceAndDevice (data) {
//   return request({
//     url: '/fence/getBoundaryPlaceAndDevice',
//     method: 'post',
//     data,
//     warning: true
//   })
// }


// 边界防控 首页 获取区域列表
// export function queryAllBorderArea (params) {
//   return request({
//     url: '/rule/getBoundary',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 边界防控 首页 获取区域列表
// export function queryWarnRuleById (id) {
//   return request({
//     url: '/rule/getRuleById/' + id,
//     method: 'get',
//     warning: true
//   })
// }


// 边界防控 首页 获取触发预警
// export function queryWarnPersons (params) {
//   return request({
//     url: '/message/getLocations',
//     method: 'get',
//     params,
//     warning: true
//   })
// }
// 人脸防控 -- 首页 -- 查询轨迹
// export function queryFaceTrack (params) {
//   return request({
//     url: '/message/face/getMessageTracks',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

// 人脸防控 -- 首页 -- 点击人脸
// export function queryFaceInfoByPosition (params) {
//   return request({
//     url: '/message/face/getMessageListByPoints',
//     method: 'get',
//     params,
//     warning: true
//   })
// }
// 人脸防控  查询预警历史
// export function queryFaceWarnHistory (params) {
//   return request({
//     url: '/message/face/getMessageList',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

//人脸防控 新建人脸预警规则
// export function addRules (data) {
//   return request({
//     url: '/warning/rule/face/create',
//     method: 'post',
//     data,
//   })
// }

// 获取 历史重点防控 分页表
// export function queryWarnPornographicPager (params) {
//   return request({
//     url: '/pornographic/getPersonList',
//     method: 'get',
//     params,
//     warning: true
//   })
// }

//人脸防控 修改人脸规则
// export function updateWarnFace (data) {
//   return request({
//     url: '/rule/face/update',
//     method: 'post',
//     data,
//     warning: true
//   })
// }

// 重点防控 -- 预警历史消息 -- 根据人员ids生成详情分页列表
// export function queryPornographicListByPersonId (params) {
//   return request({
//     url: '/pornographic/getListByPersonId',
//     method: 'get',
//     params,
//     warning: true
//   })
// }
