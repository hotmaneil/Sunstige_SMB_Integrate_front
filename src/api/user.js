import request from '@/utils/request'

export function login(payload) {
  return request({
    url: '/SystemUser/login',
    method: 'post',
    data: payload
  })
}

export function getInfo() {
  return request({
    url: '/SystemUser/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/SystemUser/logout',
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: '/SystemOptions',
    method: 'get',
    params
  })
}

/**
 * 取得沒有Token(沒有登入)的使用者清單
 * @returns
 */
export function getNoTokenUserList() {
  return request({
    url: '/SystemUser/GetNoTokenUserList',
    method: 'get'
  })
}
