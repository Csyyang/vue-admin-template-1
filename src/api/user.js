import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/vue-admin-template/user/register',
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: '/vue-admin-template/user/modify',
    method: 'post',
    data
  })
}
export function modifyPassword(data) {
  return request({
    url: '/vue-admin-template/user/modifyPassword',
    method: 'post',
    data
  })
}

export function getUserList(params) {
  return request({
    url: '/vue-admin-template/user/getUserList',
    method: 'get',
    params
  })
}

export function deleteAccount(data) {
  return request({
    url: '/vue-admin-template/user/deleteAccount',
    method: 'post',
    data
  })
}

