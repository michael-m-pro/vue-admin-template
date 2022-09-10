import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/channelRule/init',
    method: 'get'
  })
}
export function getChannelRules(data) {
  return request({
    url: '/channelRule/list',
    method: 'get',
    params: data
  })
}

export function addChannelRule(data) {
  return request({
    url: '/channelRule/insert',
    method: 'post',
    data
  })
}

export function updateChannelRule(data) {
  return request({
    url: '/channelRule/update',
    method: 'post',
    data
  })
}

export function deleteChannelRule(data) {
  return request({
    url: '/channelRule/delete',
    method: 'post',
    data
  })
}
