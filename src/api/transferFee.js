import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/transferFee/init',
    method: 'get'
  })
}
export function getTransferFees(data) {
  return request({
    url: '/transferFee/list',
    method: 'get',
    params: data
  })
}

export function addTransferFee(data) {
  return request({
    url: '/transferFee/insert',
    method: 'post',
    data
  })
}

export function updateTransferFee(data) {
  return request({
    url: '/transferFee/update',
    method: 'post',
    data
  })
}

export function deleteTransferFee(data) {
  return request({
    url: '/transferFee/delete',
    method: 'post',
    data
  })
}
