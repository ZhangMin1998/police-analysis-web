import request from '@/config/request'

// 查询DB表
export function getInitializeTable () {
  return request({
    url: '/table/getInitializeTable',
    method: 'get',
  })
}
// 初始化DB表
export function insertInitializeTable () {
  return request({
    url: '/table/insertInitializeTable',
    method: 'post'
  })
}
// 创建表
export function initializeTableData () {
  return request({
    url: '/table/initializeTableData',
    method: 'post'
  })
}
// 初始化表数据
// export function insertInitializeTableData(data) {
//   return request({
//     url: '/table/insertInitializeTableData',
//     method: 'post',
//     data
//   })
// }

// 初始化菜单表
export function authMenuSaveAll (data) {
  return request({
    url: '/login/auth/menu/saveAll',
    method: 'post',
    data
  })
}



