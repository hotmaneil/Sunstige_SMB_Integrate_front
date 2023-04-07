import request from '@/utils/smbWebApiRequest'

/**
 * 取得班別列表
 */
export function getList() {
  return request({
    url: '/ClassInfo/GetList',
    method: 'get'
  })
}

/**
 * 更新及新增班別資訊
 */
export function update(payload) {
  return request({
    url: '/ClassInfo/Update',
    method: 'post',
    data: payload
  })
}
