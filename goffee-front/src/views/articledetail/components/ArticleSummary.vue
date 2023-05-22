<template>
  <div class="article-author-info">
    <!-- 文章标题 -->
    <div class="article-title">
      <h2>{{ article.title }}</h2>
      <time
        ><el-icon> <Calendar /> </el-icon>&nbsp;发表于{{ article.gmtCreate }}</time
      >
    </div>
    <!-- 作者 -->
    <div class="author">
      <div class="img">
        <CustomElImage
          :img="article.authorVO.avatar ? article.authorVO.avatar : defaultAvatar"
          :zip="2"
        />
      </div>
      <div class="author-info">
        <p class="author-name">
          {{ article.authorVO.nickname }} <span>#{{ article.authorVO.uid }}</span>
        </p>
        <p class="introduction">{{ article.authorVO.introduction }}</p>
      </div>
    </div>
    <!-- icon group 文章观看次数等信息 -->
    <ul class="icongroup">
      <li>
        <svg class="eye" width="30" height="30">
          <use xlink:href="#icon-yanjing"></use>
        </svg>
        <span>{{ article.viewCounts }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'

const props = defineProps<{
  article: ArticleItemInfoVO
}>()
</script>

<style lang="less" scoped>
.article-author-info {
  .flex-multi(column, flex-start, center);
  .font-normal();
  padding: 1rem;

  .article-title {
    font-size: 2rem;
    margin: 1rem 0;
    text-align: center;

    time {
      font-size: 1.3rem;
      margin: 5px 0;
      display: flex;
      align-items: center;
    }
  }

  .author {
    .flexbox(column);

    .img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--common-bg);
      object-fit: cover;
      border: 5px solid var(--border-color);
      overflow: hidden;
      margin: 5px 0;
    }

    .author-info {
      .flex-multi(column, stretch, center);

      .author-name {
        font-size: 2rem;
        font-weight: 600;

        span {
          font-size: 1.3rem;
          color: skyblue;
        }
      }

      .introduction {
        font-size: 1.3rem;
        color: #a0a0a0;
      }
    }
  }

  .icongroup {
    display: flex;
    margin: 1rem 0;

    li {
      display: flex;
      align-items: center;
    }

    .eye {
      fill: var(--common-font-color);
    }
  }
}
</style>
