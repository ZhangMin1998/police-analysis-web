import request from '@/config/request'
// 厂商列表 新
export function searchCompanyList () {
  return request({
    url: '/autotest/checkfolder/getcompanyfolder',
    method: 'get',
    py: true
  })
}
// 搜索数据检测列表  新的
export function checkfileData (params) {
  return request({
    url: '/autotest/checkfile',
    method: 'get',
    py: true,
    params,
  })
}


// ------------------------------ODS校验-------------------------------------------------
// ods校验第一部分表
export function checkodsAll (params) {
  return request({
    url: '/autotest/checkods-all',
    method: 'get',
    py: true,
    params,
  })
}
// ods校验第一部分表
export function checktranceAll (params) {
  return request({
    url: '/autotest/checktrance-all',
    method: 'get',
    py: true,
    params,
  })
}

// 获取列表
export function getodslist () {
  return request({
    url: '/autotest/getodslist',
    method: 'get',
    py: true,

  })
}

// 获取数据效验数据类型
export function getDataCheckType (params) {
  return request({
    url: '/devops/validation/type',
    method: 'get',
    py: true,
    params
  })
}

// 根据数据类型获取该类型的错误信息
export function getTypeErrorData (params) {
  return request({
    url: '/devops/validation/start',
    method: 'get',
    py: true,
    params,
  })
}

export function getJob () {
  return request({
    url: '/immediately_job/get_job',
    method: 'get',
    py: true
  })
}
export function executeJob (params) {
  return request({
    url: '/immediately_job/job_star',
    method: 'get',
    py: true,
    params
  })
}
