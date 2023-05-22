<template>
  <div class="article-container">
    <article class="article" v-if="articleInfo.content.html">
      <div class="article-body">
        <!-- 主体 -->
        <div class="main">
          <ArticleSummary :article="articleInfo" />
          <ArticleBody ref="articleBody" :html="articleInfo.content.html" />
        </div>
        <el-divider />
        <!-- 结束部分，显示查看数 -->
        <BottomItem :article="articleInfo" />
      </div>
    </article>
    <ArticleCatalog v-if="articleInfo.content.html" />
  </div>
</template>

<script setup lang="ts">
import ArticleSummary from './components/ArticleSummary.vue'
import ArticleCatalog from './components/ArticleCatalog.vue'
import ArticleBody from './components/ArticleBody.vue'
import BottomItem from './components/BottomItem.vue'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'
import { getArticleItemInfo } from '@/api/blog'
import { useHead } from '@vueuse/head'

const route = useRoute()
const loading = ref(false)

/* 获取文章详情 */
const articleInfo = ref<ArticleItemInfoVO>({
  id: '',
  title: '',
  summary: '',
  content: {
    html: '',
    richEditor: false,
    markdownEditor: false
  },
  articleTags: [],
  articleSection: {
    id: 0,
    sectionName: ''
  },
  gmtCreate: new Date(),
  authorVO: {
    userId: '',
    uid: '',
    nickname: '',
    avatar: '',
    introduction: ''
  },
  viewCounts: 0
})

const getArticleDetail = async (id: string) => {
  const result = await getArticleItemInfo(id as string)
  if (result) {
    Object.assign(articleInfo.value, result.data)
  }
}

onMounted(() => {
  getArticleDetail(route.params.id as string)
}),
  useHead({
    title: computed(() => {
      return `${articleInfo.value.title ? articleInfo.value.title : '文章详情'} - GoffeeBlog`
    }),
    meta: [
      {
        name: `description`,
        content: computed(() => (articleInfo.value?.summary ? articleInfo.value.summary : '描述'))
      },
      {
        name: `author`,
        content: computed(
          () =>
            `文章作者:${
              articleInfo.value.authorVO.nickname ? articleInfo.value.authorVO.nickname : '作者名字'
            }`
        )
      }
    ]
  })

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>
<script lang="ts">
export default {
  name: 'ArticleDetail'
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .article-container {
    display: flex;
    justify-content: center;
  }

  .article {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--common-bg);
    margin: 1rem 1rem;
    .border-normal();

    .article-body {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 1rem;

      .main {
        color: var(--common-font-color);
      }
    }
  }

  .el-divider {
    margin: 0;
  }
}

@media screen and (min-width: @smallpc-device) {
  .article {
    width: 73%;
    padding: 1rem;
  }
}
</style>
