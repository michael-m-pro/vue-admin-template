import request from '@/utils/request'

export function getCountries(data) {
  return request({
    url: '/country/list',
    method: 'get',
    params: data
  })
}

export function addCountry(data) {
  return request({
    url: '/country/insert',
    method: 'post',
    data
  })
}

export function updateCountry(data) {
  return request({
    url: '/country/update',
    method: 'post',
    data
  })
}

export function deleteCountry(data) {
  return request({
    url: '/country/delete',
    method: 'post',
    data
  })
}
