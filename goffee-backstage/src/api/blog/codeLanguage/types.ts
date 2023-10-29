/* 查询条件 */
export interface CodeLanguageQuery extends PageQuery {
    keyword?: string,
}

/* code language vo */
export interface CodeLanguageVO {
    id?: number,
    text: string,
    value: string,
    sort?: number,
    gmtCreate?: Date,
    gmtModified?: Date
}

/* code language page */
export type CodeLanguagePage = PageResult<Array<CodeLanguageVO>>