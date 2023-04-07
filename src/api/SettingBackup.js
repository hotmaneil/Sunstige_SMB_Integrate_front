import request from '@/utils/webapirequest'

export function getList(params) {
  return request({
    url: '/SettingBackup',
    method: 'get',
    params
  })
}

export function addItem(data) {
  return request({
    url: `/SettingBackup`,
    method: 'post',
    data
  })
}

export function removeItem(data) {
  return request({
    url: `/SettingBackup`,
    method: 'delete',
    data
  })
}

