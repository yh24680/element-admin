import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 获取用户信息，
export function getUserInfo () {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
