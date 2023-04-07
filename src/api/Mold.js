import request from '@/utils/smbWebApiRequest'

/**
 * 依照ID取得模具資料
 * @param {*} payload
 * @returns
 */
export function getCommoldByID(payload) {
  return request({
    url: '/Commold/GetByID',
    method: 'post',
    data: payload
  })
}

/**
 * 取得模具列表
 * @param {*} payload
 * @returns
 */
export function getCommoldList(payload) {
  return request({
    url: '/Commold/GetCommoldList',
    method: 'post',
    data: payload
  })
}

/**
 * 取得模具區塊enum列表
 * @returns
 */
export function getMoldBlockEnumList() {
  return request({
    url: '/Commold/GetMoldBlockEnumList',
    method: 'get'
  })
}

/**
 * 取得模具健康狀態enum列表
 * @returns
 */
export function getMoldStatusEnumList() {
  return request({
    url: '/Commold/GetMoldStatusEnumList',
    method: 'get'
  })
}

/**
 * 更新模具
 * @param {*} payload
 * @returns
 */
export function update(payload) {
  return request({
    url: '/Commold/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 更新模具相關資料(模具維護紀錄及新增模具重置紀錄)
 * @param {*} payload
 * @returns
 */
export function updateMoldRelationData(payload) {
  return request({
    url: '/Commold/UpdateMoldRelationData',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除模具
 */
export function deleteMold(payload) {
  return request({
    url: '/Commold/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除模具圖片
 * @param {*} payload
 * @returns
 */
export function deleteImages(payload) {
  return request({
    url: '/Commold/DeleteImages',
    method: 'post',
    data: payload
  })
}

/**
 * 更新模具區塊
 * @param {*} payload
 * @returns
 */
export function updateMoldBlock(payload) {
  return request({
    url: '/Commold/UpdateMoldBlock',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除模具區塊
 * @param {*} payload
 * @returns
 */
export function deleteMoldBlock(payload) {
  return request({
    url: '/Commold/DeleteMoldBlock',
    method: 'post',
    data: payload
  })
}
