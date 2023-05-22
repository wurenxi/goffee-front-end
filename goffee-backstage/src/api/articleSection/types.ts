/**
 * 文章版块查询对象类型
 */
export interface ArticleSectionQuery extends PageQuery {
    keywords?: string;
    status?: number;
}

/* 文章版块分页信息 */
export interface ArticleSectionVOB {
    /**
     * 版块ID
     */
    id?: number;
    /**
     * 版块名
     */
    sectionName?: string;
    /**
     * 状态
     */
    status?: number;
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

export type ArticleSectionPageVOB = PageResult<Array<ArticleSectionVOB>>

/**
 * 文章版块表单对象
 */
export interface ArticleSectionForm {
    /**
     * 版块ID
     */
    id?: number;

    /**
     * 版块名称
     */
    sectionName?: string;
    
    /**
     * 排序
     */
    sort?: number;
    
    /**
     * 标签状态(1-正常；0-停用)
     */
    status?: number;
}
