import request from '@/utils/smbWebApiRequest'

/**
 * 取得機台列表
 * @param {*} payload
 * @returns
 */
export function getList(payload) {
  return request({
    url: '/Device/GetList',
    method: 'post',
    data: payload
  })
}

/**
 * 依照設備種類取得機台列表
 * @param {*} payload
 * @returns
 */
export function getDeviceListByCategory(payload) {
  return request({
    url: '/Device/GetDeviceListByCategory',
    method: 'post',
    data: payload
  })
}

/**
 * 更新機台資訊
 * @param {*} params
 * @returns
 */
export function update(payload) {
  return request({
    url: '/Device/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除
 */
export function deleteDevice(payload) {
  return request({
    url: '/Device/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 取得機台DI資訊
 * @param {*} payload
 * @returns
 */
export function getDIByID(payload) {
  return request({
    url: '/Device/GetDIByID',
    method: 'post',
    data: payload
  })
}

/**
 * 更新機台DI資訊
 * @param {*} payload
 * @returns
 */
export function updateDI(payload) {
  return request({
    url: '/Device/UpdateDI',
    method: 'post',
    data: payload
  })
}

/**
 * 取得機台狀態列表
 * @param {*} payload
 * @returns
 */
export function getStatusList(payload) {
  return request({
    url: '/Device/GetStatusList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得指定機台狀態資訊
 * @param {*} payload
 * @returns
 */
export function getStatusByID(payload) {
  return request({
    url: '/Device/GetStatusByID',
    method: 'post',
    data: payload
  })
}

/**
 * 更新/新增設備狀態
 * @param {*} payload
 * @returns
 */
export function updateStatus(payload) {
  return request({
    url: '/Device/UpdateStatus',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除設備狀態
 * @param {*} payload
 * @returns
 */
export function deleteStatus(payload) {
  return request({
    url: '/Device/DeleteStatus',
    method: 'post',
    data: payload
  })
}

/**
 * 取得指定機台狀態條件資訊
 * @param {*} payload
 * @returns
 */
export function getStatusConditionByID(payload) {
  return request({
    url: '/Device/GetStatusConditionByID',
    method: 'post',
    data: payload
  })
}

/**
 * 依照Id取得機台狀態條件
 * @param {*} payload
 * @returns
 */
export function getDeviceStatusConditionById(payload) {
  return request({
    url: '/Device/GetDeviceStatusConditionById',
    method: 'post',
    data: payload
  })
}

/**
 * 更新/新增狀態條件設定
 * @param {*} payload
 * @returns
 */
export function updateStatusCondition(payload) {
  return request({
    url: '/Device/UpdateStatusCondition',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除狀態條件設定
 * @param {*} payload
 * @returns
 */
export function deleteStatusCondition(payload) {
  return request({
    url: '/Device/DeleteStatusCondition',
    method: 'post',
    data: payload
  })
}

/**
 * 取得設備狀態統計數
 * @param {*} payload
 * @returns
 */
export function getDeviceStatusCount() {
  return request({
    url: '/Device/GetDeviceStatusCount',
    method: 'get'
  })
}

/**
 * 列出設備運行現況之資料(圓餅圖列表用)
 * @returns
 */
export function getDeviceForStatusTimeRateList(payload) {
  return request({
    url: '/Device/GetDeviceForStatusTimeRateList',
    method: 'post',
    data: payload
  })
}

/**
 * 列出設備運行現況之資料(橫式長條圖列表用)
 * @param {*} payload
 * @returns
 */
export function getDeviceStatusTimeLengthForBarList(payload) {
  return request({
    url: '/Device/GetDeviceStatusTimeLengthForBarList',
    method: 'post',
    data: payload
  })
}

/**
 * 依照ID取得機台資料
 * @param {*} payload
 * @returns
 */
export function getDeviceByID(payload) {
  return request({
    url: '/Device/GetByID',
    method: 'post',
    data: payload
  })
}
