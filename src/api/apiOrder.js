import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/apiOrder/init',
    method: 'get'
  })
}
export function getApiOrders(data) {
  return request({
    url: '/apiOrder/list',
    method: 'get',
    params: data
  })
}
