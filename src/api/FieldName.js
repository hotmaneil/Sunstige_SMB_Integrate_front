import _request from '@/utils/request'
import request from '@/utils/webapirequest'

/**
 * 更新欄位
 * @param {*} payload
 * @returns 會有 There is already an open DataReader associated with this Connection which must be closed first的Bug
 */
export function updateItem(payload) {
  return _request({
    url: `/FieldName/Update`,
    method: 'post',
    data: payload
  })
}

/**
 * 更新多筆欄位
 * @param {*} payload
 * @returns
 */
export function updateItemList(payload) {
  return _request({
    url: `/FieldName/UpdateList`,
    method: 'post',
    data: payload
  })
}

export function getList(params) {
  return request({
    url: `/FieldName`,
    method: 'get',
    params
  })
}

/**
 * 設定顯示圖表
 * @param {*} payload
 * @returns
 */
export function SetShowChart(payload) {
  return _request({
    url: `/FieldName/SetShowChart`,
    method: 'post',
    data: payload
  })
}

/**
 * 追出圖表資料
 * @param {*} payload
 * @returns
 */
export function getTraceList(payload) {
  return _request({
    url: `/FieldName/Trace`,
    method: 'post',
    data: payload
  })
}

/**
 * 新增多筆資料(模具、材料與工單編號)
 * @param {*} payload
 * @returns
 */
export function MultiUpdateFieldNameList(payload) {
  return _request({
    url: `/FieldName/MultiUpdateFieldNameList`,
    method: 'post',
    data: payload
  })
}
