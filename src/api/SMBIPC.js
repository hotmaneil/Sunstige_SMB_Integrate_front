import request from '@/utils/request'

/**
 * 取得iPC列表
 * @returns
 */
export function getIPCList(payload) {
  return request({
    url: '/Ipc/GetList',
    method: 'post',
    data: payload
  })
}

/**
 * 更新及新增iPC資料
 * @param {*} payload
 * @returns
 */
export function update(payload) {
  return request({
    url: '/Ipc/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除iPC資料
 */
export function deleteIPC(payload) {
  return request({
    url: '/Ipc/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 同步iPC資料
 * @param {*} payload
 * @returns
 */
export function Sync(payload) {
  return request({
    url: '/Ipc/Sync',
    method: 'post',
    data: payload
  })
}
