import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/channelFee/init',
    method: 'get'
  })
}
export function getChannelFees(data) {
  return request({
    url: '/channelFee/list',
    method: 'get',
    params: data
  })
}

export function addChannelFee(data) {
  return request({
    url: '/channelFee/insert',
    method: 'post',
    data
  })
}

export function updateChannelFee(data) {
  return request({
    url: '/channelFee/update',
    method: 'post',
    data
  })
}

export function deleteChannelFee(data) {
  return request({
    url: '/channelFee/delete',
    method: 'post',
    data
  })
}
