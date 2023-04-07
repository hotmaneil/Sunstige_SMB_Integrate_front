import request from '@/utils/webapirequest'
import _request from '@/utils/request'

/**
 * 設定值列表
 * @param {*} payload
 * @returns
 */
export function getList(payload) {
  return _request({
    url: `/MoldingBackup/Get`,
    method: 'post',
    data: payload
  })
}

export function updateItem(id, data) {
  return request({
    url: `/MoldingBackup/Put/${id}`,
    method: 'put',
    data
  })
}

export function applyItem(id, data) {
  return request({
    url: `/MoldingBackup/Apply/${id}`,
    method: 'put',
    data
  })
}

export function addItem(data) {
  return request({
    url: `/MoldingBackup/AddItem`,
    method: 'post',
    data
  })
}

export function removeItem(id, data) {
  return request({
    url: `/MoldingBackup/${id}`,
    method: 'delete',
    data
  })
}
