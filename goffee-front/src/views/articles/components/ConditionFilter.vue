<template>
  <div class="condition-filter">
    <!-- 时间 -->
    <div class="time">
      <div class="label">
        <p>时间</p>
      </div>
      <!-- 时间选择器 -->
      <el-date-picker
        value-format="YYYY-MM-DD"
        v-model="queryArticlePageParam.gmtModified"
        type="date"
        placeholder="选择日期时间"
        @change="
          () => {
            queryArticlePageParam.pageNum = 1
            blogStore.getArticles()
          }
        "
      >
      </el-date-picker>
    </div>
    <!-- 标签 -->
    <div class="orderByTag">
      <div class="left">
        <div class="label">
          <p>标签</p>
        </div>
        <div class="tags" v-loading="tagLoading">
          <div
            class="alltag"
            :class="{ active: currentTagIds.includes(tag.id!) }"
            v-for="tag in tagOptions"
            @click="getTagId(tag)"
            :key="tag.id"
          >
            <span>{{ tag.tagName }}</span>
          </div>
          <div class="change-tag">
            <span>{{ tagPageParams.current }}/{{ Math.ceil(tagTotal / tagPageParams.size) }}</span>
            <CustomButton
              @click="changeTag"
              type="danger"
              :spacing="0.5"
              :mainTextSize="1.2"
              :subTextSize="1"
              :x="9"
              :y="3.3"
            >
              换一换
              <template #endesc> Change Tag </template>
            </CustomButton>
          </div>
        </div>
      </div>
      <transition @before-enter="beforeEnter" @enter="translateXenter">
        <div class="right" v-if="chooseTag.length > 0">
          <div class="label">
            <p>已选</p>
          </div>
          <TagItem
            v-for="tag in chooseTag"
            :key="tag.id"
            :tagId="tag.id!"
            :tagName="tag.tagName"
            :closable="true"
            :isClick="false"
            @closeTag="removeTag(tag)"
          />
          <svg class="icon-reset" width="30" height="30" @click="clearChooseTags">
            <use xlink:href="#icon-reset"></use>
          </svg>
        </div>
      </transition>
    </div>
    <!-- 排序规则 -->
    <div class="order">
      <div class="label">
        <p>排序</p>
      </div>
      <div class="tags">
        <div
          class="alltag"
          :class="{
            active:
              !queryArticlePageParam.orderByGmtCreate && !queryArticlePageParam.orderByGmtModified
          }"
          @click="changeOrderRule('default')"
        >
          默认
        </div>
        <div
          class="alltag"
          :class="{ active: queryArticlePageParam.orderByGmtModified }"
          @click="changeOrderRule('gmtModified')"
        >
          文章修改日期
          <span>{{
            queryArticlePageParam.orderByGmtModified
              ? queryArticlePageParam.orderByGmtModified === 'desc'
                ? '↓'
                : '↑'
              : ''
          }}</span>
        </div>
        <div
          class="alltag"
          :class="{ active: queryArticlePageParam.orderByGmtCreate }"
          @click="changeOrderRule('gmtCreate')"
        >
          文章发表日期
          <span>{{
            queryArticlePageParam.orderByGmtCreate
              ? queryArticlePageParam.orderByGmtCreate === 'desc'
                ? '↓'
                : '↑'
              : ''
          }}</span>
        </div>
      </div>
    </div>
    <!-- 版块 -->
    <div class="order">
      <div class="label">
        <p>版块</p>
      </div>
      <el-select
        class="articleSectionSelect"
        v-model="queryArticlePageParam.articleSectionId"
        placeholder="选择版块"
        clearable
        filterable
        style="width: 230px"
        @change="
          () => {
            queryArticlePageParam.pageNum = 1
            blogStore.getArticles()
          }
        "
      >
        <el-option
          v-for="articleSection in articleSections"
          :key="articleSection.id"
          :label="articleSection.sectionName"
          :value="articleSection.id"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import type { RendererElement } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'
import { useAnime } from '@/hooks/useAnime'

const route = useRoute()
/* useBlogStore */
const blogStore = useBlogStore()
// storeToRefs使结构数据具有响应式特点
const {
  articleSections,
  tagOptions,
  tagPageParams,
  tagTotal,
  queryArticlePageParam,
  currentTagIds,
  chooseTag,
  tagLoading
} = storeToRefs(blogStore)
const { getTagOptions, changeTag, removeTag, resetChooseTags, getTagId, getArticles } = blogStore

const allTag = ref<HTMLDivElement>()

/* 清空标签 */
const clearChooseTags = async () => {
  resetChooseTags()
  await getArticles()
}

/* 修改排序规则 */
const changeOrderRule = (rule: string) => {
  if (rule === 'default') {
    queryArticlePageParam.value.orderByGmtCreate = undefined
    queryArticlePageParam.value.orderByGmtModified = undefined
  } else if (rule === 'gmtCreate') {
    queryArticlePageParam.value.orderByGmtModified = undefined
    const { orderByGmtCreate } = queryArticlePageParam.value
    if (orderByGmtCreate == undefined || orderByGmtCreate == 'asc') {
      queryArticlePageParam.value.orderByGmtCreate = 'desc'
    } else {
      queryArticlePageParam.value.orderByGmtCreate = 'asc'
    }
  } else if (rule === 'gmtModified') {
    queryArticlePageParam.value.orderByGmtCreate = undefined
    const { orderByGmtModified } = queryArticlePageParam.value
    if (orderByGmtModified == undefined || orderByGmtModified == 'asc') {
      queryArticlePageParam.value.orderByGmtModified = 'desc'
    } else {
      queryArticlePageParam.value.orderByGmtModified = 'asc'
    }
  }
  queryArticlePageParam.value.pageNum = 1
  blogStore.getArticles()
}

onMounted(() => {
  getTagOptions()
})

const beforeEnter = (el: RendererElement) => {
  gsap.set(el, {
    x: -200
  })
}
const { translateXenter } = useAnime()
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .condition-filter {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    margin: 1rem;

    .time {
      display: flex;
      align-items: center;
      margin-left: 0.8rem;
    }

    .orderByTag {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      margin: 1rem 0 1rem 0.8rem;
      align-items: flex-start;
      justify-content: space-between;

      p {
        flex-shrink: 0;
      }

      .left {
        display: flex;
        align-items: center;
        margin-top: 1rem;
      }

      .right {
        display: flex;
        align-items: center;
        margin-top: 1rem;

        .icon-reset {
          margin-left: 1rem;
          fill: var(--common-font-color);
          .cursor-pointer();

          &:hover {
            animation: resetAnimate 2s linear infinite;
          }
        }
      }

      .change-tag {
        display: flex;
        align-items: center;

        span {
          margin: 0 1rem;
        }
      }
    }

    .order {
      display: flex;
      margin: 0.8rem;
      align-items: center;
    }

    .label {
      .font-normal();
      font-size: 2rem;
      display: flex;
      flex-shrink: 0;
      align-items: flex-end;
      margin-right: 1rem;

      span {
        font-size: 1.5rem;
      }
    }

    .tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .active {
        color: #fff;
        background-color: rgb(250, 14, 73);
        border-image: url('@/assets/img/border/border-line-active.png') 20 24 17 25;
        border-image-outset: 5px;
      }
    }

    .alltag {
      color: black;
      display: flex;
      align-items: center;
      text-align: center;
      height: 1.5rem;
      margin: 1rem;
      .border-tag(5px, 1rem);
      background-color: rgb(255, 255, 255);
      .cursor-pointer();
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .condition-filter {
    .orderByTag {
      display: flex;
      align-items: flex-start;
    }
  }
}

@keyframes resetAnimate {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(365deg);
  }
}
</style>
