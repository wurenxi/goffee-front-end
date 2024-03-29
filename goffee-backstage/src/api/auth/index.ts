import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, LoginResult } from './types';

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/api/auth/common/login',
    method: 'post',
    params: data
  });
}

/**
 * 注销API
 */
export function logoutApi(id: string) {
  return request({
    url: `/api/auth/common/logout/${id}`,
    method: 'get'
  });
}
