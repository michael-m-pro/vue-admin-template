import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/role/fullMenuTree',
    method: 'get'
  })
}

export function getRoles(query) {
  console.log('query', query)
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function getRoutesByRUI(id) {
  return request({
    url: `/role/menuTree?id=${id}`,
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: 'role/update',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/insert',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}
