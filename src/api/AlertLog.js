import request from '@/utils/smbWebApiRequest'

/**
 * 取得警示訊息紀錄列表
 * @param {*} payload
 * @returns
 */
export function getAlertlogList(payload) {
  return request({
    url: '/Alertlog/GetAlertlogList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得警示訊息類型列表
 * @returns
 */
export function getAlertTypeList() {
  return request({
    url: '/Alertlog/GetAlertTypeList',
    method: 'get'
  })
}
