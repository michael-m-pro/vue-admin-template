import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/transferOrder/init',
    method: 'get'
  })
}
export function getTransferOrders(data) {
  return request({
    url: '/transferOrder/list',
    method: 'get',
    params: data
  })
}
export function getTransferOrder(data) {
  return request({
    url: '/transferOrder/view',
    method: 'get',
    params: data
  })
}
export function preReview(data) {
  return request({
    url: '/transferOrder/preReview',
    method: 'post',
    data
  })
}
export function review(data) {
  return request({
    url: '/transferOrder/review',
    method: 'post',
    data
  })
}
