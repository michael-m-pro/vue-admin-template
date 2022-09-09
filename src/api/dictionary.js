import request from '@/utils/request'

export function getDictionaries(data) {
  return request({
    url: '/dictionary/list',
    method: 'get',
    params: data
  })
}

export function addDictionary(data) {
  return request({
    url: '/dictionary/insert',
    method: 'post',
    data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/dictionary/update',
    method: 'post',
    data
  })
}

export function deleteDictionary(data) {
  return request({
    url: '/dictionary/delete',
    method: 'post',
    data
  })
}
