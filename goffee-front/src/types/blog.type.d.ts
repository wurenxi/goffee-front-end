declare global {
  interface ArticleSection {
    /* 版块ID */
    id: number
    /* 版块名 */
    sectionName: string
  }

  interface ArticleTags {
    /* 标签ID */
    id?: number
    /* 标签名 */
    tagName: string
  }

  interface ArticleTagPageParam {
    current: number
    size: number
  }

  /* 文章VO */
  interface ArticleRequestVO {
    userId: string
    title: string
    summary: string
    content: {
      html: string
      text: string
      richEditor: boolean
      markdownEditor: boolean
    }
    articleTagIds: Array<number>
    articleSectionId: number
    imgCollection?: Array<string>
  }

  /* 文章标签分页 */
  type ArticleTagPageResult = PageResult<Array<ArticleTags>>

  /* 文章详情 */
  interface ArticleItemInfoVO {
    id: string
    title: string
    summary: string
    content: {
      html: string
      richEditor: boolean
      markdownEditor: boolean
    }
    articleTags: Array<ArticleTags>
    articleSection: ArticleSection
    viewCounts: number
    gmtCreate: Date
    authorVO: UserEasy
  }

  /* 修改文章VO */
  interface UpdateArticleFormVO {
    id: string
    title: string
    summary: string
    content: {
      html: string
      text: string
      markdownEditor: boolean
      richEditor: boolean
    }
    articleTags: Array<ArticleTags>
    articleSectionId: number
    imgCollection: Array<string>
  }

  /* 查询文章分页请求VO */
  interface ArticlePageReqVO {
    keyword?: string
    articleSectionId?: number
    articleTagsId?: Array<number>
    gmtModified?: Date
    orderByGmtModified?: string
    orderByGmtCreate?: string
    pageNum?: number
    pageSize?: number
  }

  /* 文章列表VO */
  interface ArticleListVO {
    articleSection: ArticleSection
    articleTags: Array<ArticleTags>
    authorVO: UserEasy
    gmtModified: Date
    // 文章id
    id: string
    summary: string
    title: string
    viewCounts: number
    content: string
  }

  /* 文章分页响应VO */
  interface ArticlePageResVO {
    current: number
    pages: number
    size: number
    total: number
    list: Array<ArticleListVO>
  }

  /* 高亮的编程语言 */
  interface TinymceCodeLanguage {
    text: string
    value: string
  }

  /* 搜索提示 */
  interface SearchTip {
    title: string
    summary: string
  }

  /* 目录 */
  interface Title {
    id: string
    level: number
    parent?: Title
    children: Array<Title>
    rawName: string
    scrollTop: number
    isVisible: boolean
    name: string
  }
}

export {}
