import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MemberForm, UserInfo, MemberPageVO, MemberQuery } from './types';

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/api/member/me',
    method: 'get'
  });
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getMemberPage(
  queryParams: MemberQuery
): AxiosPromise<PageResult<MemberPageVO[]>> {
  return request({
    url: '/api/member/page',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getMemberForm(userId: number): AxiosPromise<MemberForm> {
  return request({
    url: '/api/member/' + userId + '/form',
    method: 'get'
  });
}

/**
 * 添加用户
 *
 * @param data
 */
export function addMember(data: any) {
  return request({
    url: '/api/member',
    method: 'post',
    data: data
  });
}

/**
 * 修改用户
 *
 * @param id
 * @param data
 */
export function updateMember(id: string, data: MemberForm) {
  return request({
    url: '/api/member/' + id,
    method: 'put',
    data: data
  });
}

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateMemberStatus(id: string, status: number) {
  return request({
    url: '/api/member/' + id + '/status',
    method: 'patch',
    params: { status: status }
  });
}

/**
 * 修改用户密码
 *
 * @param id
 * @param password
 */
export function updateMemberPassword(id: string, password: string) {
  return request({
    url: '/api/member/' + id + '/password',
    method: 'get',
    params: { password: password }
  });
}

/**
 * 删除用户
 *
 * @param ids
 */
export function deleteMembers(ids: string) {
  return request({
    url: '/api/member/' + ids,
    method: 'delete'
  });
}
