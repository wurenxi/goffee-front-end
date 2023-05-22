import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/* 登录API */
export const loginAPI = (data: LoginData) =>
  request({
    url: '/api/auth/login',
    method: 'post',
    params: data
  }) as AxiosPromise<LoginRsult>

/* 注销API */
export const logoutAPI = () =>
  request({
    url: '/api/auth/logout',
    method: 'delete'
  })
