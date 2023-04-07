import request from '@/utils/smbWebApiRequest'

/**
 * 取得狀態列表
 */
 export function getList(){
  return request({
    url: '/MainStatus/GetList',
    method: 'get'
  })
}

/**
 * 更新/新增狀態
 * @param {*} payload
 * @returns
 */
export function update(payload){
  return request({
    url: '/MainStatus/Update',
    method: 'post',
    data:payload
  })
}

/**
 * 刪除狀態
 * @param {*} payload
 * @returns
 */
export function deleteStatus(payload){
  return request({
    url: '/MainStatus/Delete',
    method: 'post',
    data:payload
  })
}
