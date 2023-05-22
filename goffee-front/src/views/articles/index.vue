<template>
  <div class="articles">
    <div class="top">
      <div class="top-bar">
        <div class="title">
          <svg class="icon">
            <use xlink:href="#icon-wenzhangguanli"></use>
          </svg>
          <div class="tw-flex tw-justify-center tw-flex-col tw-font-bold">
            <p>文章列表</p>
            <span>Article list</span>
          </div>
        </div>
        <SearchItem />
      </div>
      <!-- 条件过滤器 -->
      <ConditionFilter />
      <div class="tip">
        <p>共为您查询到{{ articlePageInfo.total }}条数据</p>
        <p v-if="queryArticlePageParam.keyword">关键词：{{ queryArticlePageParam.keyword }}</p>
        <p v-if="queryArticlePageParam.gmtModified">
          时间条件：{{ queryArticlePageParam.gmtModified }}
        </p>
      </div>
      <el-divider style="border: none; border-bottom: 5px dotted"></el-divider>
      <div class="main" v-loading="articlesLoading" v-if="articlePageInfo.list">
        <transition-group name="article">
          <ArticleItem
            :key="item.id"
            :article-item="item"
            v-for="item in articlePageInfo.list"
            class="article-item-sub"
          />
        </transition-group>
        <CustomEmpty v-if="articlePageInfo.list.length == 0"></CustomEmpty>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page" v-show="articlePageInfo.pages > 1">
      <el-pagination
        v-model:current-page="queryArticlePageParam.pageNum"
        :page-size="queryArticlePageParam.pageSize"
        :background="true"
        layout="prev, pager, next, ->, jumper, total"
        :total="articlePageInfo.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchItem from './components/SearchItem.vue'
import ConditionFilter from './components/ConditionFilter.vue'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'

const route = useRoute()
const blogStore = useBlogStore()
const { articlePageInfo, queryArticlePageParam, articlesLoading } = storeToRefs(blogStore)

watch(toRef(queryArticlePageParam.value, 'pageNum'), (oldVal, newVal) => {
  blogStore.getArticles()
})

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>
<script lang="ts">
export default {
  name: 'Aricles'
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .articles {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--common-font-color);

    .top {
      width: 100%;
      padding: 1rem;
      border-radius: 2rem;
      margin-top: 1rem;
      border: 0.2rem solid var(--border-color);
      background-color: var(--common-bg);

      .top-bar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .search {
          width: 100%;
        }
      }

      .title {
        margin: 2rem;
        display: flex;
        flex-shrink: 0;
        align-items: center;

        .icon {
          font-size: 4.5rem;
        }

        p {
          font-size: 2.5rem;
        }

        span {
          font-size: 1.3rem;
          margin-left: 0.4rem;
        }
      }

      .main {
        width: 100%;

        .article-item-sub {
          margin: 2.5rem 0 !important;
        }
      }

      .tip {
        .font-normal();
      }
    }
    .page {
      .font-normal();
      .shadow(4px, 0, @themeColor);
      border: 0.2rem solid @themeColor2;
      border-radius: 1rem;
      font-size: 1.3rem;
      padding: 1rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      background-color: var(--common-bg);
    }
  }
}

@media screen and (min-width: @pad-device) {
  .top-bar {
    flex-direction: row !important;

    .search {
      width: 70%;
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .articles {
    width: 80%;
    margin: 0 auto;

    .top {
      padding: 1rem;
      border-radius: 2rem;
      margin-top: 1rem;

      .top-bar {
        .search {
          width: 35%;
        }
      }

      .tip {
        line-height: 2rem;
        padding: 1rem;
        margin-left: 0.5rem;
      }
    }
  }
}

.article-enter-to,
.article-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.article-leave-active {
  position: absolute;
  transition: all 0.8s ease-in-out;
}

.article-move {
  transition: all 0.8s ease;
}

.article-enter-from,
.article-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.article-item-sub {
  transition: all 0.6s ease;
}
</style>
