import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function addGA(data) {
  return request({
    url: '/addGA',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function init(token) {
  return request({
    url: '/user/init',
    method: 'get',
    params: { token }
  })
}

export function getRoutes(token) {
  return request({
    url: '/getPermissions',
    method: 'get',
    params: { token }
  })
}

export function getUsers(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function addUser(data) {
  return request({
    url: '/user/insert',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
// 禁用
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
