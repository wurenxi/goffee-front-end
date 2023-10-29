/**
 * 文章标签查询对象类型
 */
export interface ArticleTagsQuery extends PageQuery {
    keywords?: string;
}

/* 文章标签分页信息 */
export interface ArticleTagVOB {
    /**
     * 标签ID
     */
    id?: number;
    /**
     * 板块名
     */
    tagName?: string;
    /**
     * 排序
     */
    sort?: string;
    /**
     * 创建时间
     */
    gmtCreate?: Date;
    /**
     * 修改时间
     */
    gmtModified?: Date;
}

export type ArticleTagPageVOB = PageResult<Array<ArticleTagVOB>>

/**
 * 文章标签表单对象
 */
export interface ArticleTagForm {
    /**
     * 标签ID
     */
    id?: number;

    /**
     * 标签名称
     */
    tagName?: string;
    
    /**
     * 排序
     */
    sort?: number;
}
