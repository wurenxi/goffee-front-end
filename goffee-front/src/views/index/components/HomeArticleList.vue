<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'
import { Calendar } from '@element-plus/icons-vue'
import { LabmenName, LabmenSpeak } from '@/enum/labmen'
import { useEventListener } from '@vueuse/core'
import DOMPurify from 'dompurify'
import labmen001 from '@/assets/img/steinsgate/labmen001.jpg'
import labmen002 from '@/assets/img/steinsgate/labmen002.jpg'
import labmen003 from '@/assets/img/steinsgate/labmen003.jpg'
import labmen004 from '@/assets/img/steinsgate/labmen004.jpg'
import labmen005 from '@/assets/img/steinsgate/labmen005.jpg'
import labmen006 from '@/assets/img/steinsgate/labmen006.jpg'
import labmen007 from '@/assets/img/steinsgate/labmen007.jpg'
import labmen008 from '@/assets/img/steinsgate/labmen008.jpg'

const banner = ref([
  `url(${labmen001}) center center / cover no-repeat local`,
  `url(${labmen002}) center center / cover no-repeat local`,
  `url(${labmen003}) center center / cover no-repeat local`,
  `url(${labmen004}) center center / cover no-repeat local`,
  `url(${labmen005}) center center / cover no-repeat local`,
  `url(${labmen006}) center center / cover no-repeat local`,
  `url(${labmen007}) center center / cover no-repeat local`,
  `url(${labmen008}) center center / cover no-repeat local`
])

const blogStore = useBlogStore()
const { articlePageInfo } = storeToRefs(blogStore)

onUpdated(() => {
  articleShow()
})

const wrapper = ref<HTMLDivElement>() as Ref<HTMLDivElement>
const articleShow = () => {
  const selectors = Array.from(
    wrapper.value.getElementsByClassName('article-item')
  ) as HTMLElement[]
  useEventListener('scroll', () => {
    // 如果都有了show，就return空
    // 获取页面滚动的距离
    let pos = window.scrollY
    selectors.forEach((i) => {
      // 获取当前卡片的高度
      let top = i.offsetHeight + i.offsetTop
      if (pos >= top - 300) {
        i.classList.add('show')
        i.getElementsByClassName('cover')[0].classList.add('lozaded')
      }
    })
  })
}

/* 替换代码块 */
const replacePreTags = (content: string) => {
  const replacement = '【此处代码区域】'
  return content.replace(/<pre[\s\S]*?>[\s\S]*?<\/pre>/g, replacement)
}
</script>

<template>
  <div class="article-wrapper" ref="wrapper">
    <div class="item article-item" :key="index" v-for="(article, index) in articlePageInfo.list">
      <div
        class="cover"
        :data-text="LabmenName[index]"
        :style="{
          background: `${banner[index]}`
        }"
      ></div>
      <div class="info">
        <div class="meta" :data-text="LabmenSpeak[index]">
          <div class="item">
            <div class="tw-w-8 tw-h-8 tw-rounded-full tw-overflow-hidden tw-mr-2">
              <CustomElImage
                :img="article.authorVO.avatar ? article.authorVO.avatar : undefined"
                :zip="1"
              />
            </div>
            <div class="author" v-text="article.authorVO.nickname"></div>
          </div>
          <div class="item">
            <el-icon>
              <Calendar />
            </el-icon>
            <span class="date" v-text="article.gmtModified"></span>
          </div>
        </div>
        <router-link :to="`/article/${article.id}`" class="title">{{ article.title }}</router-link>
        <div
          class="text"
          v-text="DOMPurify.sanitize(replacePreTags(article.content), { ALLOWED_TAGS: [] })"
        ></div>
        <div class="meta footer">
          <div class="item">
            <el-tag
              class="articleSection"
              effect="dark"
              @click.stop.prevent="
                $router.push(`/articles?articleSectionId=${article.articleSection.id}`)
              "
              >{{ article.articleSection.sectionName }}</el-tag
            >
          </div>
          <div class="item">
            <TagItem
              v-for="tag in article.articleTags"
              :key="tag.id"
              :tagName="tag.tagName"
              :tagId="tag.id!"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > .item {
    display: flex;
    position: relative;
    width: calc(100% - 1rem);
    min-width: calc(100% - 1rem);
    height: 31rem;
    margin: 1rem;
    border-radius: 1rem;
    box-shadow: 5px 5px 0 var(--box-shadow-color);
    border: 0.28rem var(--text-color) solid;
    transition: all 0.2s ease-in-out 0s;
    color: var(--text-color);
    opacity: 0;
    overflow: hidden;

    &:nth-child(even) {
      flex-direction: row-reverse;

      .cover {
        margin-right: auto;
        margin-left: 1.5rem;
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 8% 100%);
        border-radius: 0 0.625rem 0.625rem 0;

        &::before {
          left: auto;
          right: 0;
        }
      }

      .info {
        padding: 1rem 0 3rem 1.5rem;
        .meta::before {
          padding-left: 1.5rem;
        }
      }
    }

    &:nth-child(4) {
      .cover::before {
        left: auto;
        top: 0;
        right: 0;
        bottom: auto;
      }
    }

    &:hover {
      transform: translateY(-10px);
      box-shadow: 5px 5px 0 @themeColor;
    }

    .cover {
      transform: translateY(0);
      width: 35%;
      margin-right: 1.5rem;
      clip-path: polygon(0 0, 92% 0%, 100% 100%, 0% 100%);
      border-radius: 0.625rem 0 0 0.625rem;
      overflow: hidden;
      display: flex;
      align-items: center;

      &::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 2.5rem;
        color: rgba(0, 0, 0, 0.8);
      }

      &.lozaded {
        animation: blur 0.8s ease-in-out forwards;
      }

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: all 0.2s ease-in-out 0s;
      }
    }

    .info {
      position: relative;
      width: 65%;
      padding: 1rem 1.5rem 3rem 0;
      perspective: 62.5rem;
      display: flex;
      flex-direction: column;

      .meta {
        display: flex;
        justify-content: flex-end;
        margin: 0;
        font-size: 1rem;
        color: var(--grey-5);
        fill: var(--grey-5);

        &::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 18px;
        }

        .item {
          display: flex;
          align-items: center;

          .date {
            margin-left: 0.2rem;
          }

          & + .item {
            margin-left: 0.625rem;
          }
        }
      }

      .title {
        color: #e9546b;
        margin: 0.625rem 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        line-height: 1.5;
        font-size: 2rem;

        &:hover {
          .cursor-pointer();
          color: rgb(56, 161, 219);
        }
      }

      .summary {
        font-size: 1.6rem;
      }

      .text {
        font-size: 1.3rem;
        display: -webkit-box;
        -webkit-line-clamp: 9;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        letter-spacing: 0.5px;
        line-height: 31px;
      }

      .meta.footer {
        position: absolute;
        bottom: 0.5rem;
        justify-content: flex-start;
        align-content: center;

        .item:nth-child(2) {
          .el-tag {
            margin-top: 0;
          }
        }
      }
    }
  }

  & > .item.show {
    animation: slideUpBigIn 0.5s;
    opacity: 1;
  }
}

@media screen and (max-width: @fourk-device) {
}

@media screen and (max-width: @fourk-device) and (min-width: 2000px) {
  .article-wrapper {
    & > .item {
      height: 48rem;

      .info {
        .text {
          -webkit-line-clamp: 17;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .article-item {
    flex-direction: column !important;
    height: 35rem !important;
    //max-height: fit-content;
    width: 100% !important;
    min-width: 100% !important;
    margin: 1rem 0.5rem !important;

    .cover {
      width: 100% !important;
      height: 60% !important;
      margin: 0 !important;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 92%) !important;
      border-radius: 0.625rem 0.625rem 0 0 !important;
      background: url('@/assets/img/steinsgate/cover.jpg') top 32% center / cover no-repeat local !important;

      &::before {
        content: '' !important;
      }
    }

    .info {
      padding: 0 1rem 3rem !important;
      width: 100% !important;
      height: 40% !important;

      .meta {
        justify-content: space-between !important;
        &::before {
          content: '' !important;
        }
      }

      .text {
        -webkit-line-clamp: 2 !important;
      }
    }
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

@keyframes blur {
  from {
    filter: blur(10px);
  }

  to {
    filter: blur(0);
  }
}
</style>
