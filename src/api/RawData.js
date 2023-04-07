import request from '@/utils/webapirequest'

export function getList(params) {
  return request({
    url: '/RawData',
    method: 'get',
    params
  })
}
