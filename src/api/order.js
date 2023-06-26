import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/vue-admin-template/order/getList',
    method: 'post',
    data
  })
}

export function addList(data) {
  return request({
    url: '/vue-admin-template/order/addList',
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/vue-admin-template/order/delete',
    method: 'post',
    data
  })
}

export function editList(data) {
  return request({
    url: '/vue-admin-template/order/editList',
    method: 'post',
    data
  })
}

