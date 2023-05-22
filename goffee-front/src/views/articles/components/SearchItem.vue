<template>
  <div class="search">
    <el-autocomplete
      v-model="queryArticlePageParam.keyword"
      class="input-search"
      size="large"
      placeholder="搜索"
      clearable
      style="width: 100%; margin-right: 1rem"
      :fetch-suggestions="querySearchAsync"
      @select="handleSelect"
      @keyup.enter.native="blogStore.getArticles"
      :debounce="1000"
      :loading="loading"
      popper-class="searchTips"
    >
      <template #default="{ item }">
        <div class="title" v-html="item.title"></div>
        <span v-if="item.summary" class="summary" v-html="item.summary"></span>
      </template>
    </el-autocomplete>
    <div class="search-btn" @click="blogStore.getArticles"></div>
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'

const blogStore = useBlogStore()
const { queryArticlePageParam, searchTips } = storeToRefs(blogStore)

const loading = ref(false)

const defaultSuggest = () => {
  return [
    { title: 'title/summary/authorNickname' },
    { title: 'author:作者模糊查询' },
    { title: 'title:文章标题模糊查询' },
    { title: 'summary:文章简介模糊查询' },
    { title: '以上带前缀可组合使用，author:xx;summary:xx;...' },
    { title: '带前缀的关键词只能出现一次，禁止author:xx;author:xx' }
  ]
}

/* 自动填充 */
const handleSelect = (item: Record<string, any>) => {
  const keyword = item as SearchTip
  queryArticlePageParam.value.keyword = `title:${keyword.title
    .replace("<span style='color:red;'>", '')
    .replace('</span>', '')}`
}

const flag = ref(false)
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString.trim()) {
    // 当什么都没输入时，不查询
    if (flag.value) {
      queryArticlePageParam.value.pageNum = 1
      blogStore.getArticles()
      flag.value = false
    }
    cb(defaultSuggest())
  } else {
    loading.value = true
    blogStore
      .getArticleSearchTip(queryString)
      .then(() => {
        cb(searchTips.value)
        flag.value = true
      })
      .finally(() => {
        loading.value = false
      })
  }
}
</script>

<style lang="less" scoped>
.search {
  display: flex;
  padding: 1rem;
  align-items: center;
  width: 60%;

  .search-btn {
    width: 68px;
    height: 55px;
    background: url(@/assets/img/search.png) no-repeat;
    background-size: contain;
    transition: all 0.3s ease-in-out;
    .cursor-pointer();

    &:hover {
      background: url(@/assets/img/search-hover.png) no-repeat;
      background-size: contain;
      animation: jello 0.5s both;
    }
  }

  .input-search {
    margin-right: 1rem;
  }
}

@keyframes jello {
  40% {
    transform: skew(15deg, 15deg);
  }

  50% {
    transform: skew(-15deg, -15deg);
  }

  65% {
    transform: skew(5deg, 5deg);
  }

  75% {
    transform: skew(-5deg, -5deg);
  }
}
</style>
