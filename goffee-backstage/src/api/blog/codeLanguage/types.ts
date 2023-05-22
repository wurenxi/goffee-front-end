/* 查询条件 */
export interface CodeLanguageQuery extends PageQuery {
    keyword?: string,
    status?: number
}

/* code language vo */
export interface CodeLanguageVO {
    id?: number,
    text: string,
    value: string,
    status?: number,
    sort?: number,
    gmtCreate?: Date,
    gmtModified?: Date
}

/* code language page */
export type CodeLanguagePage = PageResult<Array<CodeLanguageVO>>