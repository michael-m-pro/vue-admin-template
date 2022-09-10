import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/channelAccount/init',
    method: 'get'
  })
}
export function getChannelAccounts(data) {
  return request({
    url: '/channelAccount/list',
    method: 'get',
    params: data
  })
}

export function addChannelAccount(data) {
  return request({
    url: '/channelAccount/insert',
    method: 'post',
    data
  })
}

export function updateChannelAccount(data) {
  return request({
    url: '/channelAccount/update',
    method: 'post',
    data
  })
}

export function deleteChannelAccount(data) {
  return request({
    url: '/channelAccount/delete',
    method: 'post',
    data
  })
}
