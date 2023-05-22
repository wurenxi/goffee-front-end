import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ArticleTagsQuery, ArticleTagPageVOB, ArticleTagForm } from './types'

/* 获取文章列表 */
export const queryArticleTagList = () => request({
  url: '/api/blog/tags/list',
  method: 'get',
}) as AxiosPromise<Array<ArticleTagForm>>

/**
 * 获取文章标签分页列表
 *
 * @param queryParams
 */
export function queryArticleTagPage(
  queryParams: ArticleTagsQuery
): AxiosPromise<ArticleTagPageVOB> {
  return request({
    url: '/api/blog/tags/page',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取文章标签回显
 * @param id 
 * @returns 
 */
export function getArticleTagForm(id: number): AxiosPromise<ArticleTagForm> {
  return request({
    url: '/api/blog/tags/get/' + id,
    method: 'get'
  });
}

/**
 * 添加文章标签
 * @param data 
 * @returns 
 */
export function addArticleTag(data: ArticleTagForm) {
  return request({
    url: '/api/blog/tags/save',
    method: 'post',
    data
  })
}

/**
 * 修改文章标签
 * @param id 
 * @param data 
 * @returns 
 */
export function updateArticleTag(data: ArticleTagForm) {
  return request({
    url: `/api/blog/tags/update`,
    method: 'post',
    data
  })
}

/**
 * 删除文章标签（批删，单删）
 * @param ids 
 * @returns 
 */
export function deleteArticleTags(ids: string) {
  return request({
    url: '/api/blog/tags/delete',
    method: 'get',
    params: {ids}
  })
}