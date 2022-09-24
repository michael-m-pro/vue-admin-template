import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/payOrder/init',
    method: 'get'
  })
}
export function getPayOrders(data) {
  return request({
    url: '/payOrder/list',
    method: 'get',
    params: data
  })
}

export function addPayOrder(data) {
  return request({
    url: '/payOrder/insert',
    method: 'post',
    data
  })
}

export function updatePayOrder(data) {
  return request({
    url: '/payOrder/update',
    method: 'post',
    data
  })
}

export function deletePayOrder(data) {
  return request({
    url: '/payOrder/delete',
    method: 'post',
    data
  })
}
