import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/transferOrder/init',
    method: 'get'
  })
}
export function getApiOrders(data) {
  return request({
    url: '/transferOrder/list',
    method: 'get',
    params: data
  })
}
