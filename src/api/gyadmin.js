import request from '@/utils/request'
const qs = require('qs');

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
    method: 'delete',
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

