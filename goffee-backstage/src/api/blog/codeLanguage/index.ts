import { CodeLanguageQuery, CodeLanguagePage, CodeLanguageVO,  } from "./types";
import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

export const queryCodeLanguagePage = (data: CodeLanguageQuery) => request({
    url: '/api/blog/tinymce/codeLanguage/page',
    method: 'post',
    data
}) as AxiosPromise<CodeLanguagePage>

export const queryCodeLanguageForm = (id: number) => request({
    url: `/api/blog/tinymce/codeLanguage/${id}`,
    method: 'get'
}) as AxiosPromise<CodeLanguageVO>

export const updateCodeLanguage = (data: CodeLanguageVO) => request({
    url: '/api/blog/tinymce/codeLanguage/update',
    method: 'post',
    data
})

export const addCodeLanguage = (data: CodeLanguageVO) => request({
    url: '/api/blog/tinymce/codeLanguage/add',
    method: 'post',
    data
})

export const deleteCodeLanguage = (ids: string) => request({
    url: '/api/blog/tinymce/codeLanguage/delete',
    method: 'get',
    params: {ids}
})