/* 查询条件 */
export interface ArticleQuery extends PageQuery {
    keyword?: string,
    author?: string,
    articleSectionId?: number,
    articleTagIds?: Array<number>,
    deleted?: number,
}

export interface ArticleVOB {
    id: string,
    title: string,
    username: string,
    nickname: string,
    articleSectionName: string,
    articleTags: Array<string>,
    deleted: number,
    gmtCreate: Date,
    gmtModified: Date,
}

export type ArticlePageVOB = PageResult<Array<ArticleVOB>>