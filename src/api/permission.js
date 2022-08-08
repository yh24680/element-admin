import request from '@/utils/request'

// 获取所有权限点
export const getPernission = () => {
  return request({
    url: '/sys/permission'
  })
}

// 添加权限点
export const addPermission = data => {
  return request({
    method: 'POST',
    url: '/sys/permission',
    data
  })
}

// 编辑权限点
export const editPermission = data => {
  return request({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
}
