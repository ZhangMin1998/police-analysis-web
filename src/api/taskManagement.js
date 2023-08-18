import request from '@/config/request'

// --------------- 任务管理 -----------------
// 新任务列表
export function queryTasksNew (data) {
  return request({
    url: '/devops/app_center_task_list',
    method: 'post',
    data,
    py: true
  })
}

// 任务列表
export function queryTasks (params) {
  return request({
    url: '/task/list',
    method: 'get',
    params: params,
    py: true
  })
}

// 任务类型列表
export function queryTypes () {
  return request({
    url: '/task/type',
    method: 'get',
    py: true
  })
}

// 添加任务
export function addJob (data) {
  return request({
    url: '/task/submit',
    method: 'post',
    data,
    py: true
  })
}


// 查询结果
export function queryJobRes (params) {
  return request({
    url: '/task/result',
    method: 'get',
    params,
    py: true
  })
}
