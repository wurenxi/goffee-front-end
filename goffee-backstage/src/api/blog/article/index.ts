import { ArticlePageVOB, ArticleQuery } from "./types";
import request from '@/utils/request'
import { AxiosPromise } from "axios";

export const queryArticlePage = (data: ArticleQuery) => request({
    url: '/api/backstage/blog/article/page',
    method: 'post',
    data
}) as AxiosPromise<ArticlePageVOB>

export const deleteArticle = (ids: string) => request({
    url: '/api/backstage/blog/article/physically/delete',
    method: 'get',
    params: { ids }
})