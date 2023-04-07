import request from '@/utils/smbWebApiRequest'

/**
 * 取得設備保養計畫列表
 * @returns
 */
export function getEquipmentMaintainPlanList() {
  return request({
    url: '/EquipmentMaintainPlan/GetEquipmentMaintainPlanList',
    method: 'get'
  })
}

/**
 * 還原預設值(將是否完成全部設為未完成)
 * @returns
 */
export function backupSetting() {
  return request({
    url: '/EquipmentMaintainPlan/BackupSetting',
    method: 'get'
  })
}

/**
 * 取得保養週期類型enum列表
 * @returns
 */
export function maintainPeriodTypeEnumList() {
  return request({
    url: '/EquipmentMaintainPlan/GetMaintainPeriodTypeEnumList',
    method: 'get'
  })
}

/**
 * 取得單一設備保養紀錄
 * @param {*} payload
 * @returns
 */
export function getEquipmentmaintainPlan(payload) {
  return request({
    url: '/EquipmentMaintainPlan/GetEquipmentmaintainPlan',
    method: 'post',
    data: payload
  })
}

/**
 * 更新設備保養排程計畫
 * @param {*} payload
 * @returns
 */
export function updateEquipmentMaintainPlan(payload) {
  return request({
    url: '/EquipmentMaintainPlan/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 依照參數新增或更新設備保養排程計畫甚至完成
 * @param {*} payload
 * @returns
 */
export function updateByParam(payload) {
  return request({
    url: '/EquipmentMaintainPlan/UpdateByParam',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除設備保養排程計畫
 * @param {*} payload
 * @returns
 */
export function deleteEquipmentMaintainPlan(payload) {
  return request({
    url: '/EquipmentMaintainPlan/Delete',
    method: 'post',
    data: payload
  })
}

