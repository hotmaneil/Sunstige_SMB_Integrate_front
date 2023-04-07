import request from '@/utils/smbWebApiRequest'

/**
 * 設備總覽
 * @returns
 */
export function equipmentOverView(payload) {
  return request({
    url: '/Statistical/EquipmentOverView',
    method: 'post',
    data: payload
  })
}

/**
 * 稼動狀況與生產狀況之圖表
 * @returns
 */
export function graphInfo(payload) {
  return request({
    url: '/Statistical/GraphInfo',
    method: 'post',
    data: payload
  })
}

/**
 * 設備狀況_P12_其他圖表資訊
 * @param {*} payload
 * @returns
 */
export function equipmentStatus(payload) {
  return request({
    url: '/Statistical/EquipmentStatus',
    method: 'post',
    data: payload
  })
}

/**
 * 機台稼動歷史
 * @param {*} payload
 * @returns
 */
export function equipmentStatusHistory(payload) {
  return request({
    url: '/Statistical/EquipmentStatusHistory',
    method: 'post',
    data: payload
  })
}

/**
 * 機台稼動歷史_P17(狀態統計)
 * @param {*} payload
 * @returns
 */
export function equipmentStatusStatistical(payload) {
  return request({
    url: '/Statistical/EquipmentStatusStatistical',
    method: 'post',
    data: payload
  })
}

/**
 * 機台稼動歷史_P16(累計稼動率)
 * @param {*} payload
 * @returns
 */
export function utilizationHistory(payload) {
  return request({
    url: '/Statistical/UtilizationHistory',
    method: 'post',
    data: payload
  })
}

/**
 * 取得CNC IOT 資料集合
 * @param {*} payload
 * @returns
 */
export function getIOTCNCDataCollection(payload) {
  return request({
    url: '/Statistical/GetIOTCNCDataCollection',
    method: 'post',
    data: payload
  })
}

/**
 * 取得柱狀圖之CNC資料集合
 * @param {*} payload
 * @returns
 */
export function getGroupCNCDataCollection(payload) {
  return request({
    url: '/Statistical/GetGroupCNCDataCollection',
    method: 'post',
    data: payload
  })
}

/**
 * 匯出日稼動率報表Excel
 * @param {*} payload
 * @returns
 */
export function exportDayReportExcel(payload) {
  return request({
    url: '/Statistical/ExportDayReportExcel',
    method: 'post',
    responseType: 'blob',
    data: payload
  })
}

/**
 * 取得柱狀圖之CNC月報表資料集合
 * @param {*} payload
 * @returns
 */
export function getMonthGroupCNCDataCollection(payload) {
  return request({
    url: '/Statistical/GetMonthGroupCNCDataCollection',
    method: 'post',
    data: payload
  })
}

/**
 * 取得閒置時間分析之統計資料
 * @param {*} payload
 * @returns
 */
export function getIdleTimeStatistics(payload) {
  return request({
    url: '/Statistical/GetIdleTimeStatistics',
    method: 'post',
    data: payload
  })
}

/**
 * 取得稼動率趨勢統計列表
 * @param {*} payload
 * @returns
 */
export function getUtilizationStatisticalList(payload) {
  return request({
    url: '/Statistical/UtilizationStatisticalList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得日稼動率比較圖用的統計資料
 * @param {*} payload
 * @returns
 */
export function getDayUtilization(payload) {
  return request({
    url: '/Statistical/GetDayUtilization',
    method: 'post',
    data: payload
  })
}

/**
 * 取得從日稼動率比較圖查詢後取得列表
 * @param {*} payload
 * @returns
 */
export function getDeviceStatusTimeRateList(payload) {
  return request({
    url: '/Statistical/GetDeviceStatusTimeRateList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得月稼動率比較圖用的統計資料
 * @param {*} payload
 * @returns
 */
export function getMonthUtilization(payload) {
  return request({
    url: '/Statistical/GetMonthUtilization',
    method: 'post',
    data: payload
  })
}

/**
 * 從月稼動率比較圖查詢後取得列表
 * @param {*} payload
 * @returns
 */
export function getDeviceStatusTimeRateMonthList(payload) {
  return request({
    url: '/Statistical/GetDeviceStatusTimeRateMonthList',
    method: 'post',
    data: payload
  })
}

/**
 * 狀態累計生產數量列表匯出Excel
 * @param {*} payload
 * @returns
 */
export function exportEquipmentStatusAccumulativeExcel(payload) {
  return request({
    url: '/Statistical/ExportEquipmentStatusAccumulativeExcel',
    method: 'post',
    responseType: 'blob',
    data: payload
  })
}

/**
 * 依照開始結束日期及設備編號取得狀態累計生產數量列表匯出Excel
 * @param {*} payload
 * @returns
 */
export function exportquipmentStatusAccumulativeDateDataExcel(payload) {
  return request({
    url: '/Statistical/ExportquipmentStatusAccumulativeDateDataExcel',
    method: 'post',
    responseType: 'blob',
    data: payload
  })
}

