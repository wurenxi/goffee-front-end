<template>
  <div class="edit">
    <div class="top">
      <div class="title-box">
        <span>标题：</span>
        <input class="title" type="text" v-model="addArticle.title" />
      </div>
      <div class="summary">
        <el-input
          v-model="addArticle.summary"
          placeholder="请输入摘要"
          maxlength="100"
          show-word-limit
          autosize
          type="textarea"
        />
      </div>
      <CustomEditor />
      <div class="buttom">
        <div class="tags">
          <TagChoose
            class="tag"
            :chooseOptions="canChooseTags"
            :choosedTag="tags"
            :canAdd="true"
            @addTag="addTagFn"
          />
          <div class="pannel">
            <p class="label">版块选择</p>
            <el-select v-model="addArticle.articleSectionId" placeholder="选择板块">
              <el-option
                v-for="articleSection in articleSections"
                :key="articleSection.id"
                :label="articleSection.sectionName"
                :value="articleSection.id"
              />
            </el-select>
          </div>
        </div>
        <div class="publish">
          <el-button round type="primary" size="large" @click="submitArticle"> 发表 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomEditor from '@/components/CustomEditor/index.vue'
import TagChoose from '@/components/TagChoose/index.vue'
import { publishArticle } from '@/api/blog'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'
import { useTag } from '@/hooks/useTag'
import { useUserInfoStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/file'
import { removeItem } from '@/utils/storage'
import router from '@/router'

const blogStore = useBlogStore()
const userInfoStore = useUserInfoStore()
const editorStore = useEditorStore()
const { articleSections } = storeToRefs(blogStore)
const { userInfo } = storeToRefs(userInfoStore)
const { content, contentRich, editorName, text, richImg, mdImg } = storeToRefs(editorStore)
const { tags, addTagFn, canChooseTags } = useTag()

/* 发表文章 */
const addArticle = ref<ArticleRequestVO>({
  userId: '',
  title: '',
  summary: '',
  content: {
    html: '',
    text: '',
    richEditor: false,
    markdownEditor: false
  },
  articleTagIds: [],
  articleSectionId: 1,
  imgCollection: []
})
const submitArticle = async () => {
  if (!userInfo.value.userId) {
    ElMessage.error('您当前未登录，请登录后重试')
    return
  } else {
    addArticle.value.userId = userInfo.value.userId
  }
  const { title, summary, articleSectionId } = addArticle.value
  if (!title) {
    ElMessage.error('请输入标题')
    return
  }
  if (!summary) {
    ElMessage.error('请输入摘要')
    return
  }
  if (editorName.value === 'tinymce' ? !contentRich.value : !content.value) {
    ElMessage.error('请输入正文')
    return
  }
  if (!tags.value || tags.value.length === 0) {
    ElMessage.error('至少选择一个标签')
    return
  } else {
    addArticle.value.articleTagIds = tags.value.map((item) => item.id!)
  }
  if (!articleSectionId) {
    ElMessage.error('请选择版块')
  }
  // 添加正文
  if (editorName.value === 'tinymce') {
    addArticle.value.content.html = contentRich.value
    addArticle.value.content.richEditor = true
    addArticle.value.imgCollection = richImg.value
  } else {
    addArticle.value.content.html = content.value
    addArticle.value.content.text = text.value
    addArticle.value.content.markdownEditor = true
    addArticle.value.imgCollection = mdImg.value
  }
  const result = await publishArticle(addArticle.value)
  if (result) {
    removeItem('tmpContent')
    richImg.value = []
    mdImg.value = []
    ElMessage.success('发表成功 2s后跳转文章')
    setTimeout(() => {
      router.push(`/article/${result.data}`)
    }, 2000)
  }
}

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>
<script lang="ts">
export default {
  name: 'EditPage'
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .edit {
    display: flex;
    flex-direction: column;
    .font-normal();
    .top {
      margin: 1rem 0;
      border: 0.2rem solid var(--border-color);
      border-radius: 30px;
      padding: 1rem;
      background-color: var(--common-bg);

      .title-box {
        height: 48px;
        .flex-multi(row, flex-start, center);
        font-size: 2.6rem;
        line-height: 2.6rem;
        width: 100%;
        margin: 1rem 0;
        .title {
          border: none;
          outline: none;
          width: calc(100% - 8rem);
          color: var(--common-font-color);
          background-color: transparent;
          .cursor-text();
        }
      }

      .summary {
        margin: 1rem 0;

        :deep(.el-textarea) {
          .el-textarea__inner {
            min-height: 60px !important;
          }
        }
      }
    }

    .buttom {
      .flex-multi(column, space-between, center);

      .tags {
        margin: 1rem 0;
        width: 100%;
      }

      .pannel {
        display: flex;

        .label {
          width: 100px;
        }
      }

      .tag {
        width: 100%;
      }

      .publish {
        width: 100%;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .edit {
    margin-top: 0;

    .buttom {
      flex-direction: row;
      align-items: flex-end;

      .publish {
        width: unset;
      }

      .tag {
        width: 60%;
      }
    }
  }
}
</style>
