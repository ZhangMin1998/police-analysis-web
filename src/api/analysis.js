// 分析研判
import request from '@/config/request'

// -----------------关系推演（改版） ----------------------
// 获取图谱数据  其它证件 只传一个vid
// export function getDeductionVid (params) {
//   return request({
//     url: '/graph/relation_deduce/person',
//     method: 'post',
//     data: params,
//     py: true
//   })
// }
// 获取图谱数据  人际关系 多层
export function getInterPersonal (params) {
  return request({
    url: '/graph/relation_deduce/interpersonal',
    method: 'post',
    data: params,
    py: true
  })
}
// 获取图谱数据  单个条件
export function getDeductionSingle (params) {
  return request({
    url: '/graph/relation_deduce/single_condition',
    method: 'post',
    data: params,
    py: true
  })
}
// 分析研判关系推演获取数据源的次数
export function relationEdgeRank (params) {
  return request({
    url: '/graph/relation_deduce/edge_rank',
    method: 'post',
    data: params,
    py: true,
    // cancelMuchRequest:true
  })
}

// 获取图谱数据  多个条件
export function getDeductionMulti (params) {
  return request({
    url: '/graph/relation_deduce/multi_condition',
    method: 'post',
    data: params,
    py: true
  })
}
// 获取所有节点对照
export function getNodeType (params) {
  return request({
    url: '/graph/entity/set',
    method: 'get',
    data: params,
    py: true
  })
}
// 获取图谱的实体图标
export function getEntityIcon (params) {
  return request({
    url: '/graph/relation_deduce/entity_icon',
    method: 'get',
    data: params,
    py: true
  })
}
// -----------------时空碰撞 ----------------------
// 新建案件
export function addCase (params) {
  return request({
    url: '/case/insert',
    method: 'put',
    data: params,
    warning: true
  })
}
// 修改案件
export function updateCase (params) {
  return request({
    url: '/case/update',
    method: 'post',
    data: params,
    warning: true
  })
}
// 查询单个案件
export function delCase (id) {
  return request({
    url: '/case/delete/' + id,
    method: 'delete',
    warning: true
  })
}

// 查询单个案件
export function getCase (id) {
  return request({
    url: '/case/get/' + id,
    method: 'get',
    warning: true
  })
}

// 查询所有案件
export function queryCase (personId) {
  return request({
    url: '/case/getAllByPerson?personId=' + personId,
    method: 'get',
    warning: true
  })
}

export function getCollisionAttrTypes (params) {
  return request({
    url: '/configurable/graph_entity_label/manage/getCollisionAttrTypes',
    method: 'get',
    params
  })
}

export function querySpaceCrash (params) {
  return request({
    url: '/analysis/hdfs/collision',
    method: 'get',
    params,
    py: true
  })
}

export function spaceCrashAddTask (params) {
  return request({
    url: '/analysis/hdfs/collision/task',
    method: 'get',
    params,
    py: true
  })
}

export function attrDetail (params) {
  return request({
    url: '/analysis/hdfs/collision/track',
    method: 'get',
    params,
    py: true
  })
}

// -----------------时空轨迹 ----------------------
// 时空轨迹 分析
export function queryTimeTrack (params) {
  return request({
    url: '/analysis/queryTimeTrack',
    method: 'post',
    data: params
  })
}

export function queryPeerTrack (params) {
  return request({
    url: '/devops/follow_analysis',
    method: 'post',
    data: params,
    py: true
  })
}

// -----------------同行分析 ----------------------
// 同行分析 消息面板分析按钮
export function peerAnalysis (params) {
  return request({
    url: '/analysis/peerAnalysis',
    method: 'post',
    data: params
  })
}
// 同行分析 消息面板 关联属性查询按钮
export function peerRelevance (params) {
  return request({
    url: '/analysis/peerRelevance',
    method: 'post',
    data: params
  })
}
// 同行分析 消息面板 分析按钮 安乡版本
export function peerRelevanceAX (params) {
  return request({
    url: '/analysis/peerRelevance/ax',
    method: 'post',
    data: params
  })
}

// 预警  -  作息分析
export function queryWorkAndRest (data) {
  return request({
    url: '/analysis/getTraces',
    method: 'post',
    data,
    warning: true
  })
}

// 预警  -  作息分析
export function queryWorkAndRestStartAndEnd (data) {
  return request({
    url: '/analysis/getStartAndEnd',
    method: 'post',
    data,
    warning: true
  })
}

// 预警  -  作息分析
export function queryWorkAndRestDetail (data) {
  return request({
    url: '/analysis/getByPlaceCode',
    method: 'post',
    data,
    warning: true
  })
}
// 分析研判-作息分析/时空轨迹 人脸图片  分析
export function frSearchAll (data) {
  return request({
    url: '/fr/searchAll',
    method: 'post',
    data
  })
}
// 分析研判关系推演
export function queryNexus (params) {
  return request({
    url: '/neo4j/queryNexus',
    method: 'post',
    data: params,
  })
}
// 关系推演
// export function queryNexus(params) {
//   return request({
//     url: '/suspects/queryNexus',
//     method: 'post',
//     data: params,
//   })
// }
