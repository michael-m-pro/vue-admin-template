import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/accountDetail/init',
    method: 'get'
  })
}
export function getAccountDetails(data) {
  return request({
    url: '/accountDetail/list',
    method: 'get',
    params: data
  })
}

export function addAccountDetail(data) {
  return request({
    url: '/accountDetail/insert',
    method: 'post',
    data
  })
}

export function updateAccountDetail(data) {
  return request({
    url: '/accountDetail/update',
    method: 'post',
    data
  })
}

export function deleteAccountDetail(data) {
  return request({
    url: '/accountDetail/delete',
    method: 'post',
    data
  })
}
