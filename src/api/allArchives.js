import request from '@/config/request'

// 获取重点人档案、人物档案、自定义档案列表
export function searchPersonFileByPage (params) {
  return request({
    url: '/person/list',
    method: 'post',
    data: params,
    cancelMuchRequest:true
  })
}

// 获取重点人档案、人物档案、自定义档案详情
export function getPersonFileDetail (cerNumber,cerType, personVid) {
  return request({
    url: '/person/detail?cerNumber=' + cerNumber + '&cerType=' + cerType + '&personVid=' + personVid,
    method: 'get'
  })
}

// 获取人物档案-不动产详情
export function getHouseDetail (params) {
  return request({
    url: '/person/assetsHouse/detail',
    method: 'get',
    params
  })
}
// 重点人、社会人、自定义档案详情导出
export function fileDetailExport (cerNumber) {
  return request({
    url: '/person/detail/export?cerNumber=' + cerNumber,
    method: 'get',
    meta:{
      all:true
    }
  })
}

// 重点人员库->查看档案--查询人员详细信息
export function queryPersonInfo (id) {
  return request({
    url: '/person/tracks/info?id=' + id,
    method: 'get',
    meta:{
      all:true
    }
  })
}

export function queryPersonImgLists (id, params) {
  return request({
    url: '/person/characterAtlas/' + id,
    method: 'get',
    params
  })
}


/** -------------------  人脸识别  ------------------- */

/** 人脸识别 搜索 相似度 */
export function frSearch (params) {
  return request({
    url: '/fr/search',
    method: 'post',
    data: params,
  })
}

/** -------------------  自定义疑似人  ------------------- */

// 自定义疑似人员
export function queryCustomPersonList (params) {
  return request({
    url: '/customPerson/queryCustomPersonList',
    method: 'post',
    data: params,
  })
}

// 自定义疑似人员 -> 人物档案中 -> 修改疑似人员 基础信息
export function updateCustomPerson (params) {
  return request({
    url: '/customPerson/customPerson/update',
    method: 'post',
    data: params,
  })
}

// 删除 自定义疑似人员
export function deleteCustomPerson (params) {
  return request({
    url: '/customPerson/delete',
    method: 'post',
    data: params,
  })
}

// /** 新建 自定义疑似人员  老接口*/
// export function customPersonCreate(data) {
//   return request({
//     url: '/customPerson/create',
//     method: 'post',
//     data,
//   })
// }

// 自定义疑似人员 -> 人物档案中 -> 查询全部的民族
// export function getAllEthnicityEnum () {
//   return request({
//     url: '/person/getAllEthnicityEnum',
//     method: 'get',
//   })
// }

/** ---------------  其他证件 -----------------*/
// 自定义疑似人员 -> 人物档案中 -> 查询所有证件
export function getAllCertificate (id) {
  return request({
    url: '/cer/getAllCertificate/' + id,
    method: 'get',
  })
}
// 自定义疑似人员 -> 人物档案中 -> 增 - 所有证件
export function addCertificate (params) {
  return request({
    url: '/cer/insert/certificate',
    method: 'post',
    data: params,
  })
}
// 自定义疑似人员 -> 人物档案中 -> 删 - 所有证件
export function deleteCertificate (id) {
  return request({
    url: '/cer/delete/' + id,
    method: 'post',
  })
}
// 自定义疑似人员 -> 人物档案中 -> 改 - 所有证件
export function updateCertificate (data) {
  return request({
    url: '/cer/update',
    method: 'post',
    data,
  })
}

// 自定义疑似人员 -> 人物档案中 -> 查询所有证件
export function getCertificateType () {
  return request({
    url: '/cer/getAllCertificateType/list',
    method: 'get',
  })
}

/** ---------------  真实身份 -----------------*/


// 自定义疑似人员 -> 人物档案 ->  真实身份 属性-> 增 新
export function addIdentityAttrs (params) {
  return request({
    url: '/neo4j/addPersonNode',
    method: 'post',
    data: params,
  })
}

export function getEchartsType (params) {
  return request({
    url: '/neo4j/findNodeType',
    method: 'get',
    data: params,
  })
}
// 自定义疑似人员 -> 查询各类账号 ->
export function queryPersonInfoType (id, params) {
  return request({
    url: '/neo4j/queryPersonInfoAssociate/' + id,
    method: 'get',
    params,
  })
}
// 自定义疑似人员 上传头像接口
export function uploadFacePic (params) {
  return request({
    url: '/upload/getPhotoUrl',
    method: 'post',
    data: params,
  })
}

/** ---------------  车辆档案 -----------------*/
// 车辆档案 输入车牌号查询
export function getInfoByCarNumber (params) {
  return request({
    url: '/carInfo/getCarInfos',
    method: 'get',
    params,
  })
}
// 车辆档案 查询车辆图集、轨迹是否有数据
export function getCountByCarNumber (params) {
  return request({
    url: '/carInfo/getCountByCarNumber',
    method: 'get',
    params
  })
}
// 车辆档案 根据id查询
export function getInfoById (params) {
  return request({
    url: '/carInfo/getCarInfoById',
    method: 'get',
    params,
  })
}
// 车辆档案 查询车辆进出记录
export function getCarAtlas (params) {
  return request({
    url: '/carInfo/getInfoPageByCarNumber',
    method: 'get',
    params,
  })
}

// 车辆档案 查询车辆信息和停车记录（车辆轨迹左侧栏）
export function getCarTrackInfo (params) {
  return request({
    url: '/carInfo/getInfoByCarNumber',
    method: 'get',
    params,
  })
}

// 车辆档案 查询车辆轨迹信息 （车辆轨迹中间）
export function getPlaceCount (params) {
  return request({
    url: '/carInfo/getPlaceCount',
    method: 'get',
    params,
  })
}
// 车辆档案 某地方的某车辆进出信息 （某地方的车辆进出信息 右侧）
export function getInfoByPlace (params) {
  return request({
    url: '/carInfo/getInfoByPlace',
    method: 'get',
    params,
  })
}

// ---------------------------关系图谱-----------------------
// 查询关系图节点 旧
// export function findRelation(id) {
//   return request({
//     url: `/suspects/relation/${id}`,
//     method: 'get',
//   })
// }

// 查询关系图节点 新
export function findRelation (id) {
  return request({
    url: '/neo4j/relationNode/' + id,
    method: 'get',
  })
}
// 查询关系图节点  tab中的第三个弱关系图谱查询  最新,其他还用上面的findRelation
export function weakRelation (params) {
  return request({
    url: '/neo4j/getOneNodeMap/',
    method: 'get',
    params
  })
}
// 查询重点人、社会人、自定义档案思维导图
export function getMindMap (cerNumber) {
  return request({
    url: '/person/mindMap?cerNumber=' + cerNumber,
    method: 'get',
  })
}

// 自定义疑似人员 -> 人物档案 ->  属性-> 删除 旧
// export function deleteIdentityAttrs(id) {
//   return request({
//     url: '/customPerson/customPerson/attr/delete/' + id,
//     method: 'post',
//   })
// }


// 自定义疑似人员 -> 人物档案 ->  属性-> 删除 新
export function deleteAttrs (data) {
  return request({
    url: '/neo4j/deleteNodeOrship',
    method: 'post',
    data
  })
}

// 新建节点关系
// export function addRelationship(data) {
//   return request({
//     url: '/neo4j/addRelationship',
//     method: 'post',
//     data
//   })
// }

// 自定义疑似人员 -> 人物档案中 -> 修改疑似人员 基础信息
export function updateAttr (params) {
  return request({
    url: '/neo4j/updateNode',
    method: 'post',
    data: params,
  })
}

// 自定义疑似人员 -> 人物档案 ->  真实身份 属性-> 增 新
export function addAttr (params) {
  return request({
    url: '/neo4j/addNode',
    method: 'post',
    data: params,
  })
}

// 删除关系线
export function deleteShip (params) {
  return request({
    url: '/neo4j/deleteShip',
    method: 'post',
    data: params,
  })
}

// 获取节点相关的所有关系列表
export function getNodeAndRelationList (params) {
  return request({
    url: '/neo4j/getNodeAndRelationList',
    method: 'post',
    data: params,
  })
}


// --------------- 新人物档案 ------------------
// 计数搜索
export function getTotalCount (params) {
  return request({
    url: '/configurable/person/data/count',
    method: 'get',
    params
  })
}
// 多身份证计数搜索
export function getOtherTotalCount (data) {
  return request({
    url: '/configurable/person/data/auxiliary/count',
    method: 'post',
    data
  })
}
// 列表搜索
export function dataSearchList (params) {
  return request({
    url: '/configurable/person/data/list',
    method: 'get',
    params
  })
}
// 多身份证列表搜索
export function dataSearchOtherList (data) {
  return request({
    url: '/configurable/person/data/auxiliary/list',
    method: 'post',
    data
  })
}
// 查询人物轨迹
export function getPersonTrack (params) {
  return request({
    url: '/tracks/list',
    method: 'post',
    data: params,
    meta:{
      all:true
    }
  })
}
// 轨迹溯源接口
export function getTrackSource (data) {
  return request({
    url: '/tracks/source',
    method: 'post',
    data
  })
}
// 获取全息档案-人物数据-列表字段是否显示图片
export function getIsShowImg (params) {
  return request({
    url: '/configurable/graph_entity_label/manage/getFileId',
    method: 'get',
    params
  })
}
