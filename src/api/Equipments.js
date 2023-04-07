import _request from '@/utils/request'
import request from '@/utils/webapirequest'

/**
 * 取得設備列表
 * @returns
 */
export function getEquipmentList() {
  return _request({
    url: '/Equipments/GetList',
    method: 'get'
  })
}

/**
 * 更新設備排序、顯示、種類
 * @param {*} payload
 * @returns
 */
export function updateEquipment(payload) {
  return _request({
    url: `/Equipments/UpdateEquipment`,
    method: 'post',
    data: payload
  })
}

/**
 * 僅有部份欄位的設備資料
 * @param {*} payload
 * @returns
 */
export function only(payload) {
  return _request({
    url: `/Equipments/Only`,
    method: 'post',
    data: payload
  })
}

/**
 * 依照Id取得單一設備資料（取代getList）
 * @param {*} payload
 * @returns
 */
export function getEquipment(payload) {
  return _request({
    url: `/Equipments/GetEquipment`,
    method: 'post',
    data: payload
  })
}

/**
 * 取得設備狀態列表
 * @param {*} payload
 * @returns
 */
export function equipmentStatus(payload) {
  return _request({
    url: `/Equipments/Status`,
    method: 'post',
    data: payload
  })
}

/**
 * 取得錯誤發生歷程列表
 * @param {*} payload
 * @returns
 */
export function alarm(payload) {
  return _request({
    url: `/Equipments/Alarm`,
    method: 'post',
    data: payload
  })
}

export function getList(params) {
  return request({
    url: '/Equipments',
    method: 'get',
    params
  })
}

export function getEquipmentAlarm(params) {
  return request({
    url: `/Equipments/Alarm`,
    method: 'get',
    params
  })
}

// /api/Equipments/Dashboard?IsEnabled=1&IsDisplay=1
export function getListOnlyEquipmentDashboard(params) {
  return request({
    url: '/Equipments/Dashboard',
    method: 'get',
    params
  })
}

export function getListOnlyEquipment(params) {
  return request({
    url: '/Equipments/Only',
    method: 'get',
    params
  })
}

export function updateItem(id, data) {
  return request({
    url: `/Equipments/Put/${id}`,
    method: 'put',
    data
  })
}
