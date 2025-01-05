import { defineStore } from 'pinia'
import {
  getAllArticleSections,
  getAllArticleTags,
  getArticleTagPage,
  getArticlePage,
  queryArticleTips,
  getArticleItemInfo
} from '@/api/blog'
import { strRepeatTimes } from '@/utils/common'
import { ElMessage } from 'element-plus'

export const useBlogStore = defineStore('blog', () => {
  /* 目录 */
  const titles = ref<Array<Title>>([])
  const container = ref<HTMLElement>()
  const currentTitle = ref<Title>({
    id: '',
    level: -1,
    rawName: '',
    children: [],
    scrollTop: -1,
    isVisible: false,
    name: ''
  })
  const progress = ref('')

  /* 搜索提示 */
  const searchTips = ref<Array<SearchTip>>([])
  const getArticleSearchTip = async (keyword: string) => {
    const result = await queryArticleTips(keyword)
    if (result) {
      searchTips.value = result.data
    }
  }

  /* 获取版块列表 */
  const articleSections = ref<ArticleSection[]>([])
  const getArticleSectionList = async () => {
    const result = await getAllArticleSections()
    if (result) {
      result.data.forEach((articleSection) => {
        articleSections.value.push(articleSection)
      })
    }
  }

  /* 获取标签列表 */
  const articleTags = ref<Array<ArticleTags>>([])
  const getArticleTagList = async () => {
    const result = await getAllArticleTags()
    if (result) {
      result.data.forEach((articleTag) => {
        articleTags.value.push(articleTag)
      })
    }
  }

  /* 获取标签分页信息 */
  const tagOptions = ref<Array<ArticleTags>>([])
  const tagTotal = ref<number>(0)
  const tagPageParams: ArticleTagPageParam = reactive({ current: 1, size: 5 })
  const tagLoading = ref(false)
  const getTagOptions = async () => {
    tagLoading.value = true
    const result = await getArticleTagPage(tagPageParams)
    try {
      if (result) {
        const { list, total } = result.data
        tagOptions.value = list
        tagTotal.value = total
      } else {
        console.log('获取分页信息失败')
      }
    } finally {
      tagLoading.value = false
    }
  }

  /* 获取分页标签 下一页 */
  const changeTag = () => {
    if (tagPageParams.current == Math.ceil(tagTotal.value / tagPageParams.size)) {
      tagPageParams.current = 1
    } else {
      tagPageParams.current++
    }
    getTagOptions()
  }

  /* 获取文章分页信息 */
  // 查询条件
  const queryArticlePageParam = ref<ArticlePageReqVO>({})
  const articlePageInfo = ref<ArticlePageResVO>({
    current: 0,
    pages: 0,
    size: 0,
    total: 0,
    list: []
  })
  const articlesLoading = ref<boolean>(false)
  const searchLoading = ref<boolean>(false)
  // 查询文章分页信息
  const getArticles = async () => {
    if (queryArticlePageParam.value.keyword) {
      const { keyword } = queryArticlePageParam.value
      if (
        strRepeatTimes(keyword, 'author:') > 1 ||
        strRepeatTimes(keyword, 'summary:') > 1 ||
        strRepeatTimes(keyword, 'title:') > 1
      ) {
        ElMessage.error('带前缀的关键词一种只能用一次')
        return
      }
    }
    articlesLoading.value = true
    searchLoading.value = true
    try {
      const result = await getArticlePage(queryArticlePageParam.value)
      if (result) {
        Object.assign(articlePageInfo.value!, result.data)
      }
    } finally {
      articlesLoading.value = false
      searchLoading.value = false
    }
  }
  // 重置查询条件
  const resetArticlePageQueryParam = () => {
    queryArticlePageParam.value = {}
  }
  // 重置查询结果
  const resetArticlePageRes = () => {
    articlePageInfo.value = {
      current: 0,
      pages: 0,
      size: 0,
      total: 0,
      list: []
    }
  }

  /* 选择标签 */
  // 已选中标签id列表
  const currentTagIds = ref<Array<number>>([])
  // 已选中标签列表
  const chooseTag = ref<Array<ArticleTags>>([])
  const getTagId = (tag: ArticleTags) => {
    if (!currentTagIds.value.includes(tag.id!)) {
      currentTagIds.value.push(tag.id!)
      chooseTag.value.push(tag)
      queryArticlePageParam.value.articleTagIds = currentTagIds.value
      queryArticlePageParam.value.pageNum = 1
      getArticles()
    }
  }
  const removeTag = (tag: ArticleTags) => {
    if (currentTagIds.value.includes(tag.id!)) {
      currentTagIds.value.splice(currentTagIds.value.indexOf(tag.id!), 1)
      chooseTag.value = chooseTag.value.filter((item) => {
        return item.id !== tag.id
      })
      queryArticlePageParam.value.articleTagIds = currentTagIds.value
      getArticles()
    }
  }

  /* 清空已选标签 */
  const resetChooseTags = () => {
    currentTagIds.value = []
    chooseTag.value = []
    queryArticlePageParam.value.articleTagIds = undefined
    queryArticlePageParam.value.pageNum = 1
  }

  return {
    articleSections,
    articleTags,
    tagOptions,
    tagTotal,
    tagPageParams,
    articlePageInfo,
    queryArticlePageParam,
    articlesLoading,
    searchLoading,
    currentTagIds,
    chooseTag,
    searchTips,
    tagLoading,
    container,
    titles,
    currentTitle,
    progress,
    getArticleSearchTip,
    getArticles,
    changeTag,
    getTagOptions,
    getArticleSectionList,
    getArticleTagList,
    resetArticlePageQueryParam,
    resetArticlePageRes,
    getTagId,
    resetChooseTags,
    removeTag
  }
})
