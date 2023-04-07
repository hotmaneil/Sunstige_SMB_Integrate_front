import request from '@/utils/request'

export function getList(payload) {
  return request({
    url: '/AlarmReport',
    method: 'post',
    data: payload
  })
}

/**
 * 異常紀錄列表
 * @param {*} payload
 * @returns
 */
export function getAbnormal(payload) {
  return request({
    url: '/AbnormalData/Get',
    method: 'post',
    data: payload
  })
}
