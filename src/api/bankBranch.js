import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/bankBranch/init',
    method: 'get'
  })
}
export function getBankBranchs(data) {
  return request({
    url: '/bankBranch/list',
    method: 'get',
    params: data
  })
}

export function addBankBranch(data) {
  return request({
    url: '/bankBranch/insert',
    method: 'post',
    data
  })
}

export function updateBankBranch(data) {
  return request({
    url: '/bankBranch/update',
    method: 'post',
    data
  })
}

export function deleteBankBranch(data) {
  return request({
    url: '/bankBranch/delete',
    method: 'post',
    data
  })
}
