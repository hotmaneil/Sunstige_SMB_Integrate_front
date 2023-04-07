import request from '@/utils/webapirequest'
import _request from '@/utils/request'

/**
 * 取得下拉選項列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return _request({
    url: '/SystemOptions/Get',
    method: 'get',
    params
  })
}

export function updateItem(id, data) {
  return request({
    url: `/SystemOptions/Put/${id}`,
    method: 'put',
    data
  })
}

/**
 * 新增或更新下拉選項
 * @param {*} data
 * @returns
 */
export function createOrUpdateItem(data) {
  return request({
    url: `/SystemOptions/Update`,
    method: 'post',
    data
  })
}

export function removeItem(id, data) {
  return request({
    url: `/SystemOptions/${id}`,
    method: 'delete',
    data
  })
}
