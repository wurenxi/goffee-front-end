import { defineStore } from "pinia";
import type { ArticleTagForm, ArticleTagPageVOB, ArticleTagsQuery } from "@/api/articleTags/types";
import type { ArticleSectionForm, ArticleSectionPageVOB, ArticleSectionQuery } from "@/api/articleSection/types";
import { queryArticleTagPage, queryArticleTagList } from "@/api/articleTags";
import { queryArticleSectionPage, queryArticleSectionList } from "@/api/articleSection";

export const useBlogStore = defineStore('blog', () => {
    // common
    const loading = ref(false)

    /************************** 文章标签 ********************************/
    const articleTagPageInfo = ref<ArticleTagPageVOB>({
        list: [],
        total: 0,
    });
    const articleTagPageQParams = ref<ArticleTagsQuery>({
        pageNum: 1,
        pageSize: 10
    });
    /* 获取文章标签分页 */
    function getArticleTagPage() {
        loading.value = true;
        queryArticleTagPage(articleTagPageQParams.value)
            .then(({ data }) => {
                Object.assign(articleTagPageInfo.value, data)
            })
            .finally(() => {
                loading.value = false;
            });
    }
    /* 获取文章标签列表 */
    const articleTagList = ref<Array<ArticleTagForm>>([])
    const getArticleTagList = async () => {
        const result = await queryArticleTagList()
        if(result) {
            articleTagList.value = result.data
        }
    }
    /* *************************************************************** */

    /************************** 文章版块 ********************************/
    const articleSectionPageInfo = ref<ArticleSectionPageVOB>({
        list: [],
        total: 0,
    });
    const articleSectionQParams = ref<ArticleSectionQuery>({
        pageNum: 1,
        pageSize: 10
    });
    /* 获取文章版块分页 */
    function getArticleSectionPage() {
        loading.value = true;
        queryArticleSectionPage(articleSectionQParams.value)
            .then(({ data }) => {
                Object.assign(articleSectionPageInfo.value, data)
            })
            .finally(() => {
                loading.value = false;
            });
    }
    /* 获取文章版块列表 */
    const articleSectionList = ref<Array<ArticleSectionForm>>([])
    const getArticleSectionList = async () => {
        const result = await queryArticleSectionList()
        if(result) {
            articleSectionList.value = result.data
        }
    }
    /* *************************************************************** */

    return {
        loading,
        articleTagPageInfo,
        articleTagPageQParams,
        articleTagList,
        articleSectionPageInfo,
        articleSectionQParams,
        articleSectionList,
        getArticleTagPage,
        getArticleTagList,
        getArticleSectionPage,
        getArticleSectionList,
    }
})