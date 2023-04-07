import _request from '@/utils/request'
import request from '@/utils/webapirequest'

/**
 * 設定值歷程列表
 * @param {*} payload
 * @returns
 */
export function getHistoryList(payload) {
  return _request({
    url: `/History/GetHistoryList`,
    method: 'post',
    data: payload
  })
}

export function getList(params) {
  return request({
    url: '/History',
    method: 'get',
    params
  })
}
