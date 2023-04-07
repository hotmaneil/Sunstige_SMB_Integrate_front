
import request from '@/utils/request'

/**
 * 取得TraceReport相關資訊列表
 * @param {*} payload
 * @returns
 */
export function getList(payload) {
  return request({
    url: '/TraceReport/Get',
    method: 'post',
    data: payload
  })
}

/**
 * 取得TraceReport相關資訊集合
 * @param {*} payload
 * @returns
 */
export function getTraceReportCollection(payload) {
  return request({
    url: '/TraceReport/GetTraceReportCollection',
    method: 'post',
    data: payload
  })
}

/**
 * 相關性
 * @param {*} payload
 * @returns
 */
export function getCorrelationList(payload) {
  return request({
    url: '/TraceReport/Correlation',
    method: 'post',
    data: payload
  })
}

/**
 * 下載csv
 * @param {*} payload
 * @returns
 */
export function getListCsv(payload) {
  return request({
    url: '/TraceReport/GetCsv',
    method: 'post',
    data: payload
  })
}

/**
 * 下載Excel
 * @param {*} payload
 * @returns
 */
export function downloadExcel(payload) {
  return request({
    url: '/TraceReport/DownloadExcel',
    method: 'post',
    responseType: 'blob',
    data: payload
  })
}
