import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/channelField/init',
    method: 'get'
  })
}
export function getChannelFields(data) {
  return request({
    url: '/channelField/list',
    method: 'get',
    params: data
  })
}

export function addChannelField(data) {
  return request({
    url: '/channelField/insert',
    method: 'post',
    data
  })
}

export function updateChannelField(data) {
  return request({
    url: '/channelField/update',
    method: 'post',
    data
  })
}

export function deleteChannelField(data) {
  return request({
    url: '/channelField/delete',
    method: 'post',
    data
  })
}
