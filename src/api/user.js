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

export function getRoutes(token) {
  return request({
    url: '/getPermissions',
    method: 'get',
    params: { token }
  })
}
