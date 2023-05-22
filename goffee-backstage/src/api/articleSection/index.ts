import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ArticleSectionQuery, ArticleSectionPageVOB, ArticleSectionForm } from './types';

/* 获取文章版块列表 */
export const queryArticleSectionList = () => request({
  url: '/api/blog/section/list',
  method: 'get',
}) as AxiosPromise<Array<ArticleSectionForm>>

/**
 * 获取文章版块分页列表
 *
 * @param queryParams
 */
export function queryArticleSectionPage(
  queryParams: ArticleSectionQuery
): AxiosPromise<ArticleSectionPageVOB> {
  return request({
    url: '/api/blog/section/page',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取文章版块回显
 * @param id 
 * @returns 
 */
export function getSectionForm(id: number): AxiosPromise<ArticleSectionForm> {
  return request({
    url: '/api/blog/section/get/' + id,
    method: 'get'
  });
}

/**
 * 添加文章版块
 * @param data 
 * @returns 
 */
export function addSection(data: ArticleSectionForm) {
  return request({
    url: '/api/blog/section/save',
    method: 'post',
    data
  })
}

/**
 * 修改文章版块
 * @param id 
 * @param data 
 * @returns 
 */
export function updateSection(data: ArticleSectionForm) {
  return request({
    url: `/api/blog/section/update`,
    method: 'post',
    data
  })
}

/**
 * 删除文章版块（批删，单删）
 * @param ids 
 * @returns 
 */
export function deleteSections(ids: string) {
  return request({
    url: '/api/blog/section/delete',
    method: 'get',
    params: { ids }
  })
}