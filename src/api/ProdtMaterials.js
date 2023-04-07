import request from '@/utils/smbWebApiRequest'

/**
 * 取得產品物料列表
 * @param {*} payload
 * @returns
 */
export function getProdtMaterialList(payload) {
  return request({
    url: '/ProdtMaterials/GetList',
    method: 'post',
    data: payload
  })
}

/**
 * 更新物料
 * @param {*} payload
 * @returns
 */
export function updateProdtMaterial(payload) {
  return request({
    url: '/ProdtMaterials/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除物料
 * @param {*} payload
 * @returns
 */
export function deleteProdtMaterial(payload) {
  return request({
    url: '/ProdtMaterials/Delete',
    method: 'post',
    data: payload
  })
}

/**
 * 產品種類列表
 * @param {*} payload
 * @returns
 */
export function getProductTypeList() {
  return request({
    url: '/ProdtMaterials/GetProductTypeEnumList',
    method: 'get'
  })
}
