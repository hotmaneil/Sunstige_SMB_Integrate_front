import request from '@/utils/smbWebApiRequest'

/**
 * 取得模具維護列表
 * @param {*} payload
 * @returns
 */
export function getMoldMaintenanceList(payload) {
  return request({
    url: '/MoldMaintenance/GetMoldMaintenanceList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得模具維護類型enum列表
 * @param {*} payload
 * @returns
 */
export function getMaintenanceTypeEnumList(payload) {
  return request({
    url: '/MoldMaintenance/GetMaintenanceTypeEnumList',
    method: 'post',
    data: payload
  })
}

/**
 * 更新模具維護
 * @param {*} payload
 * @returns
 */
export function updateMoldMaintenance(payload) {
  return request({
    url: '/MoldMaintenance/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 依照模具編號更新模具維護
 * @param {*} payload
 * @returns
 */
export function updateByMoldId(payload) {
  return request({
    url: '/MoldMaintenance/UpdateByMoldId',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除模具維護
 * @param {*} payload
 * @returns
 */
export function deleteMoldMaintenance(payload) {
  return request({
    url: '/MoldMaintenance/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 新增模具重置記錄
 * @param {*} payload
 * @returns
 */
export function moldReset(payload) {
  return request({
    url: '/MoldMaintenance/CreateMoldResetlog',
    method: 'post',
    data: payload
  })
}
