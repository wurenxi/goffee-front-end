<template>
  <router-link class="article-box" :to="`/article/${articleItem.id}`">
    <article class="content">
      <section class="up">
        <div class="left">
          <div class="title">{{ articleItem.title }}</div>
          <summary class="desc" v-text="articleItem.summary"></summary>
          <div class="text" v-text="articleItem.content.replace(/<[^<>]+>/g, '')"></div>
        </div>
        <time class="right tw-flex-shrink-0">
          <time class="time">{{ articleItem.gmtModified }}</time>
        </time>
      </section>
      <section class="down">
        <div class="leftcontent">
          <div class="tw-flex tw-items-center">
            <div class="tw-w-8 tw-h-8 tw-rounded-full tw-overflow-hidden tw-mr-2">
              <CustomElImage
                :img="articleItem.authorVO.avatar ? articleItem.authorVO.avatar : defaultAvatar"
                :zip="1"
              />
            </div>
            <p class="author">{{ articleItem.authorVO.nickname }}</p>
          </div>
          <div>
            <TagItem
              v-for="tag in articleItem.articleTags"
              :key="tag.id"
              :tagName="tag.tagName"
              :tagId="tag.id!"
            />
          </div>
        </div>
        <div class="icongroup">
          <el-tag
            class="articleSection"
            effect="dark"
            @click.stop.prevent="
              $router.push(`/articles?articleSectionId=${articleItem.articleSection.id}`)
            "
            >{{ articleItem.articleSection.sectionName }}</el-tag
          >
        </div>
      </section>
    </article>
  </router-link>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'

const router = useRouter()

defineProps<{
  articleItem: ArticleListVO
}>()
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .article-box {
    padding: 1rem;
    margin: 30px 0;
    .flex-multi(column, flex-start, center);
    border: 0.28rem var(--border-color) solid;
    border-radius: 1rem;
    transition: transform 0.2s ease;
    .shadow(5px, 0);

    .content {
      .font-normal();
      .flex-self(column, space-between, flex-start);
      width: 100%;

      .up {
        .flex-multi(row, space-between, flex-start);

        .text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 1rem 0;
        }

        .time {
          padding: 1rem;
          justify-content: flex-end;
        }

        .title {
          font-size: 2rem;
          .text-line-show(1);
        }

        .desc {
          margin-top: 0.5rem;
          font-size: 1rem;
          .text-line-show(1);
        }
      }

      .down {
        .flex-multi(column, space-between, stretch);
        margin-top: 1rem;
        width: 100%;

        .leftcontent {
          .flex-multi(row, space-between, center);
          flex-wrap: wrap;

          .author {
            font-size: 1rem;
            margin-right: 3rem;
            flex-shrink: 0;
          }
        }

        .icongroup {
          .flex-multi(row, stretch, center);

          .articleSection {
            background-color: @themeColor2;
            border-color: @themeColor2;
            color: #fff;
          }
        }
      }
    }
  }
}

@media screen and (min-width: @pad-device) {
  .article-box {
    flex-direction: row;
    margin: 1rem 0;

    .content {
      height: 12rem;

      .up {
        height: 50%;
      }

      .down {
        flex-direction: row;
        align-items: flex-end;

        .leftcontent {
          justify-content: flex-start;
          align-items: center;
        }
      }
    }

    &:hover {
      .cursor-pointer();
      transform: translate(0, -10px);
      .shadow(5px, 0px, @themeColor);
    }
  }
}
</style>
