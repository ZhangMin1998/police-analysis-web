import request from '@/config/request'
import axios from 'axios'
// --------------- 综合查询 -----------------

// 综合查询 - 分页表 - 新建
export function addTask (data) {
  return request({
    url: '/sparkTask/save',
    method: 'post',
    data
  })
}

// 综合查询 -> 下拉/筛选选项
export function getAttrTypeEnum () {
  return request({
    url: '/analysis/getAttrTypeEnum',
    method: 'get',
    warning: true
  })
}

// --------------------------------------超级搜索-----------------------------------------
// 超级搜索 -> 查询列表--模糊查询
// let cancelFullTextSearch = ''
export function fullTextSearch (params) {
  // try {
  //   cancelFullTextSearch()
  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/analysis/fullTextSearch',
    method: 'get',
    params,
    warning: true,
    cancelMuchRequest: true
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   cancelFullTextSearch = cancel
    // })
  })
}

// 超级搜索 -> 查询列表--精准查询
// let cancelAuxiliaryFullTextSearch = ''
export function auxiliaryFullTextSearch (params) {
  // try {
  //   cancelAuxiliaryFullTextSearch()
  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/analysis/auxiliary/fullTextSearch',
    method: 'get',
    params,
    warning: true,
    cancelMuchRequest: true
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   cancelAuxiliaryFullTextSearch = cancel
    // })
  })
}

// 超级搜索 -> 动态分类
// let _cancel = ''
export function getDynamicCataloging (params) {
  // try {
  //   _cancel()
  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/analysis/getDynamicCataloging',
    method: 'get',
    params,
    warning: true,
    cancelMuchRequest: true
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   _cancel = cancel
    // })
  })

}
// 超级搜索 -> 查询之后显示的推荐列表
// let _cancelGetCorrelation = ''
export function getCorrelation (params) {
  // try {
  //   _cancelGetCorrelation()
  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/analysis/getCorrelation',
    method: 'get',
    params,
    warning: true,
    cancelMuchRequest: true
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   _cancelGetCorrelation = cancel
    // })
  })
}

// 超级搜索 -> 筛选的数据类型
export function getDocTypes () {
  return request({
    url: '/analysis/getDocTypes',
    method: 'get',
    warning: true
  })
}
// 超级搜索 -> 人物档案类型的需要根据value和type去查询人物id
export function getPersonByCertificate (params) {
  return request({
    url: '/person/getPersonByCertificate',
    method: 'get',
    params
  })
}

// 超级搜索 -> 人物档案类型的需要根据value和type去查询人物id
export function getPersonInfoByCer (params) {
  return request({
    url: '/person/getPersonInfoByCer',
    method: 'get',
    params
  })
}

// --------------------------------------图片-----------------------------------------
// 图片 -> 上传图片获取url
export function getPhotoUrl (data) {
  return request({
    url: '/upload/getPhotoUrl',
    method: 'post',
    data
  })
}
// 图片 -> 查询详情
export function getImageData (data) {
  return request({
    url: '/fr/search',
    method: 'post',
    data
  })
}
export function getDataTypes () {
  return request({
    url: '/fr/getDataTypes',
    method: 'get'
  })
}


// --------------------------------------荣成数据搜索-----------------------------------------
// 列表搜索
window.cancelDataEvent = []
// let cancelMuchList = ''
export function dataSearchList (params, loadingDom) {
  // try {
  //   if (cancelEvent) {
  //     cancelEvent()
  //   }
  //   if (cancelMuchList) {
  //     cancelMuchList()
  //   }

  // } catch (err) {
  //   console.log(err);
  // }
  return request({
    url: '/configurable/data/search/list',
    method: 'get',
    params,
    ...loadingDom,
    cancelToken: new axios.CancelToken(function (cancel) {
      window.cancelDataEvent.push(cancel)
    })
  })
}
// 计数搜索
window.cancelCount = []
export function dataSearchCount (params) {
  return request({
    url: '/configurable/data/search/count',
    method: 'get',
    params,
    cancelToken: new axios.CancelToken(function (cancel) {
      // console.log(cancel);
      // window.cancelCount = cancel
      window.cancelCount.push(cancel)
    })
  })
}
// 多身份证列表搜索
export function dataSearchAuxiliaryList (data) {
  return request({
    url: '/configurable/data/search/auxiliary/list',
    method: 'post',
    data,
    // cancelToken: new axios.CancelToken(function (cancel) {
    //   cancelMuchList = cancel
    // })
  })
}
// 多身份证计数搜索
export function dataSearchAuxiliaryCount (data) {
  return request({
    url: '/configurable/data/search/auxiliary/count',
    method: 'post',
    data
  })
}
