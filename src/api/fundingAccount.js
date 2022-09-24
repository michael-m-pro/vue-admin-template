import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/accountInfo/init',
    method: 'get'
  })
}
export function getAccountInfos(data) {
  return request({
    url: '/accountInfo/list',
    method: 'get',
    params: data
  })
}

export function addAccountInfo(data) {
  return request({
    url: '/accountInfo/insert',
    method: 'post',
    data
  })
}

export function updateAccountInfo(data) {
  return request({
    url: '/accountInfo/update',
    method: 'post',
    data
  })
}

export function deleteAccountInfo(data) {
  return request({
    url: '/accountInfo/delete',
    method: 'post',
    data
  })
}
