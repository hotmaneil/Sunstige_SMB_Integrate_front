import request from '@/utils/request'

/**
 * 取得機台主軸與進給門檻值 (CNC)列表
 */
export function getList() {
  return request({
    url: '/CNCMainAxisTh/GetList',
    method: 'get'
  })
}

/**
 * 更新機台主軸與進給門檻值 (CNC)
 * @returns
 */
export function update(payload) {
  return request({
    url: '/CNCMainAxisTh/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除機台主軸與進給門檻值 (CNC)
 * @param {*} payload
 * @returns
 */
export function deleteCNCMainAxisTh(payload) {
  return request({
    url: '/CNCMainAxisTh/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 更新閒置代碼(CNC)
 * @param {*} payload
 * @returns
 */
export function UpdateCNCIdleCode(payload) {
  return request({
    url: '/CNCIdleCode/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 取得閒置代碼(CNC)列表
 * @param {*} payload
 * @returns
 */
export function getCNCIdleCodeList() {
  return request({
    url: '/CNCIdleCode/GetList',
    method: 'get'
  })
}

/**
 * 刪除閒置代碼(CNC)
 * @param {*} payload
 * @returns
 */
export function deleteCNCIdleCode(payload) {
  return request({
    url: '/CNCIdleCode/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 取得CNC 目前加工運行參數之加工資訊
 * @param {*} payload
 * @returns
 */
export function getL2CNCLastData(payload) {
  return request({
    url: '/CNCProcessInfo/GetL2CNCLastData',
    method: 'post',
    data: payload
  })
}
