import request from '@/utils/smbWebApiRequest'

/**
 * 設備總覽欄位管理列表
 */
export function getManageList() {
  return request({
    url: '/EquipmentOverviewField/GetManageList',
    method: 'get',
  })
}

/**
 * 更新總覽欄位設定
 * @param {*} payload
 * @returns
 */
export function update(payload) {
  return request({
    url: '/EquipmentOverviewField/Update',
    method: 'post',
    data: payload,
  })
}
