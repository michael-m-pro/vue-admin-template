import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/currency/init',
    method: 'get'
  })
}

export function getCurrencies(data) {
  return request({
    url: '/currency/list',
    method: 'get',
    params: data
  })
}

export function addCurrency(data) {
  return request({
    url: '/currency/insert',
    method: 'post',
    data
  })
}

export function updateCurrency(data) {
  return request({
    url: '/currency/update',
    method: 'post',
    data
  })
}

export function deleteCurrency(data) {
  return request({
    url: '/currency/delete',
    method: 'post',
    data
  })
}
