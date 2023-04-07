import request from '@/utils/request'

/**
 * 取得機台位置圖列表
 */
export function getList() {
  return request({
    url: '/EquipmentLayout/GetList',
    method: 'get'
  })
}

/**
 * 取得機台位置圖與運行狀態之列表
 * @returns
 */
export function getActionList() {
  return request({
    url: '/EquipmentLayout/GetActionList',
    method: 'get'
  })
}

/**
 * 更新機台位置圖
 * @param {*} payload
 * @returns
 */
export function update(payload) {
  return request({
    url: '/EquipmentLayout/Update',
    method: 'post',
    data: payload
  })
}
