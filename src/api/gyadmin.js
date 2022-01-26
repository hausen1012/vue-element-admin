import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/gy/page',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function createGyRecord(data) {
  return request({
    url: '/gy/create',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function batchDeleteGyRecord(data) {
  return request({
    url: '/gy/batchDelete',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function updateGyRecord(data) {
  return request({
    url: '/gy/update',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function deleteGyRecord(data) {
  return request({
    url: '/gy/delete',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function generateData(data) {
  return request({
    url: '/gy/generate',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

export function clearAll(data) {
  return request({
    url: '/gy/clearAll',
    method: 'post',
    data,
    baseURL: 'http://localhost'
  })
}

