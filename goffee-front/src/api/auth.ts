import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/* 登录API */
export const loginAPI = (data: LoginData) =>
  request({
    url: '/api/auth/common/login',
    method: 'post',
    params: data
  }) as AxiosPromise<LoginRsult>

/* 注销API */
export const logoutAPI = (id: string) =>
  request({
    url: `/api/auth/common/logout/${id}`,
    method: 'get'
  })
