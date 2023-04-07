import request from '@/utils/webapirequest'

export function getList(params) {
  return request({
    url: '/TraceReport',
    method: 'get',
    params
  })
}
