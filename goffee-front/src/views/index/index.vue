<script lang="ts">
export default { name: 'Index' }
</script>

<script setup lang="ts">
import TagsAll from './components/TagsAll.vue'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import HomeArticleList from './components/HomeArticleList.vue'

const blogStore = useBlogStore()
const { queryArticlePageParam, articlePageInfo } = storeToRefs(blogStore)
onMounted(() => {
  /* 获取文章分页信息 */
  blogStore.resetArticlePageQueryParam()
  // blogStore.resetArticlePageRes()
  queryArticlePageParam.value.pageSize = 8
  blogStore.getArticles()
  if (!useUserStore().token) {
    useUserStore().resetLoginInfo()
  }
})

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>

<template>
  <div class="inner">
    <main class="main">
      <div class="wrap">
        <div class="header">
          <el-divider direction="horizontal" content-position="center"> 最近更新文章 </el-divider>
          <CustomButton
            class="more"
            :x="8"
            :y="3.3"
            :mainTextSize="1.3"
            @click="$router.push('/articles')"
          >
            更多
          </CustomButton>
        </div>
        <HomeArticleList />
      </div>
      <ul class="rightbox" ref="rightUI">
        <li>
          <TagsAll />
        </li>
      </ul>
    </main>
  </div>
</template>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .main {
    width: 100%;
    .flex-multi(column, flex-start, flex-start);

    .wrap {
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 1.25rem;
      animation: slideUpBigIn 0.5s;
      width: 100%;
      background: linear-gradient(to top, var(--grey-0) 0, var(--grey-1) 20%) no-repeat top;
      box-shadow: 0 1.25rem 1rem 0.3125rem var(--body-bg-shadow);

      .header {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .more {
          margin: 0 1rem;
        }
      }
    }
  }

  .rightbox {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 2rem 0 1rem 0;
    li:nth-child(1) {
      margin-top: auto;
    }
  }
}

@media screen and (min-width: 1200px) {
  .main {
    flex-direction: row;
    .wrap {
      width: 80%;
    }
    .rightbox {
      width: 20%;
      margin: 0 1rem;
      li:nth-child(1) {
        margin-top: 3rem;
      }
    }
  }
}

.el-divider {
  border-top: 2px rgb(204, 204, 204) solid;

  :deep(.el-divider__text) {
    background-color: var(--grey-1);
    color: var(--grey-4);
    font-size: 2rem;
  }
}

@keyframes slideUpBigIn {
  from {
    opacity: 0;
    transform: translateY(80px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
