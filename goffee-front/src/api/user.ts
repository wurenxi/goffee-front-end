import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/* 登录成功后获取用户信息（昵称、头像、权限集合和角色集合） */
export const getUserInfo = () =>
  request({
    url: '/api/user/me',
    method: 'get'
  }) as AxiosPromise<UserInfo>

/* 更新用户信息 */
export const updateUserInfo = (data: UserFormInfo) =>
  request({
    url: '/api/user/update',
    method: 'post',
    data
  })

/* 更新用户密码 */
export function updateUserPwd(id: string, data: UpdatePwdForm) {
  return request({
    url: `/api/user/update/${id}/password`,
    method: 'post',
    data
  })
}

/* 更新用户头像 */
export const updateUserAvatar = (data: UserAvatarVO) =>
  request({
    url: '/api/user/easy/update',
    method: 'post',
    data
  })
