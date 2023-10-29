import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/* 获取所有文章版块 */
export const getAllArticleSections = () =>
  request({
    url: '/api/blog/section/list',
    method: 'get'
  }) as AxiosPromise<Array<ArticleSection>>

/* 获取所有文章标签 */
export const getAllArticleTags = () =>
  request({
    url: '/api/blog/tag/list',
    method: 'get'
  }) as AxiosPromise<Array<ArticleTags>>

/* 分页获取标签 */
export const getArticleTagPage = (params: ArticleTagPageParam) =>
  request({
    url: '/api/blog/tag/page',
    method: 'get',
    params: { ...params }
  }) as AxiosPromise<ArticleTagPageResult>

/* 添加文章标签 */
export const addArticleTag = (data: ArticleTags) =>
  request({
    url: '/api/tag/save',
    method: 'post',
    data
  })

/* 新增文章 */
export const publishArticle = (data: ArticleRequestVO) =>
  request({
    url: '/api/blog/article/save',
    method: 'post',
    data
  }) as AxiosPromise<string>

/* 获取文章详情 */
export const getArticleItemInfo = (articleId: string) =>
  request({
    url: `/api/blog/article/detailinfo/${articleId}`,
    method: 'get'
  }) as AxiosPromise<ArticleItemInfoVO>

/* 获取文章分页信息 */
export const getArticlePage = (data: ArticlePageReqVO) =>
  request({
    url: '/api/blog/article/page',
    method: 'post',
    data
  }) as AxiosPromise<ArticlePageResVO>

/* 获取用户自己的文章分页信息 */
export const getUserArticlePage = (userId: string, data: ArticlePageReqVO) =>
  request({
    url: `/api/blog/article/page/${userId}`,
    method: 'post',
    data
  }) as AxiosPromise<ArticlePageResVO>

/* 获取某个用户文章数量 */
export const getArticleCount = (userId: string) =>
  request({
    url: '/api/blog/article/count',
    method: 'get',
    params: { userId }
  }) as AxiosPromise<number>

/* 根据文章id删除文章信息（逻辑删除） */
export const deleteArticleLogical = (articleId: string) =>
  request({
    url: `/api/blog/article/logical/delete/${articleId}`,
    method: 'get'
  })

/* 更新文章 */
export const updateArticle = (data: UpdateArticleFormVO) =>
  request({
    url: '/api/blog/article/update',
    method: 'post',
    data
  })

/* 获取tinymce编辑器支持高亮的编程语言 */
export const queryTinymceCodeLanguage = () =>
  request({
    url: '/api/blog/language/list',
    method: 'get'
  }) as AxiosPromise<Array<TinymceCodeLanguage>>

/* 搜索文章提示信息 */
export const queryArticleTips = (keyword: string) =>
  request({
    url: '/api/blog/article/searchtip',
    method: 'get',
    params: { keyword }
  }) as AxiosPromise<Array<SearchTip>>
