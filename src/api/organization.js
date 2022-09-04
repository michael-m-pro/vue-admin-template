import request from '@/utils/request'

export function getOrganizations(data) {
  return request({
    url: '/organization/list',
    method: 'get',
    params: data
  })
}

export function addOrganization(data) {
  return request({
    url: '/organization/insert',
    method: 'post',
    data
  })
}

export function updateOrganization(data) {
  return request({
    url: '/organization/update',
    method: 'post',
    data
  })
}

export function deleteOrganization(data) {
  return request({
    url: '/organization/delete',
    method: 'post',
    data
  })
}
