import request from '@/utils/smbWebApiRequest'

/**
 * 更新設定
 * @param {*} payload
 * @returns
 */
export function updateConfig(payload) {
  return request({
    url: '/Config/BatchUpdate',
    method: 'post',
    data: payload
  })
}

/**
 * 取得設定列表
 * @returns
 */
export function getConfigList() {
  return request({
    url: '/Config/GetList',
    method: 'get'
  })
}
