<script setup lang="ts">
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'
import { getArticleItemInfo, updateArticle } from '@/api/blog'
import { useEditorStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
import { useTag } from '@/hooks/useTag'
import { ElMessageBox, ElMessage } from 'element-plus'

const { tags, addTagFn, canChooseTags } = useTag()
const blogStore = useBlogStore()
const { articleSections } = storeToRefs(blogStore)
const editorStore = useEditorStore()
const { editorName, content, contentRich, text, richImg, mdImg } = storeToRefs(editorStore)

const route = useRoute()
const router = useRouter()

let articleInfo = ref<UpdateArticleFormVO>({
  id: '',
  title: '',
  summary: '',
  content: {
    html: '',
    text: '',
    markdownEditor: false,
    richEditor: false
  },
  articleTags: [],
  articleSectionId: 0,
  imgCollection: []
})

/* 提交修改 */
const submitChange = () => {
  if (articleInfo.value.content.markdownEditor) {
    if (editorName.value !== 'markdown') {
      confirm(articleInfo.value.content.markdownEditor)
    } else {
      submit('markdown')
    }
  } else {
    if (editorName.value !== 'tinymce') {
      confirm(articleInfo.value.content.markdownEditor)
    } else {
      submit('rich')
    }
  }
}
const confirm = (isMarkdown: boolean) => {
  ElMessageBox.confirm(
    `本文使用了${isMarkdown ? 'Markdown' : '富文本'}编辑器进行编写，是否要修改编辑器并提交？`,
    'Warning',
    {
      confirmButtonText: '直接提交',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    submit(isMarkdown ? 'rich' : 'markdown')
  })
}
const submit = (type: 'rich' | 'markdown') => {
  if (type === 'rich') {
    articleInfo.value.content.richEditor = true
    articleInfo.value.content.markdownEditor = false
    articleInfo.value.content.html = contentRich.value
    articleInfo.value.imgCollection = richImg.value
  } else {
    articleInfo.value.content.richEditor = false
    articleInfo.value.content.markdownEditor = true
    articleInfo.value.content.html = content.value
    articleInfo.value.content.text = text.value
    articleInfo.value.imgCollection = mdImg.value
  }
  articleInfo.value.articleTags = tags.value
  ElMessageBox.confirm('是否提交更新文章？', '更新文章', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    const result = await updateArticle(articleInfo.value)
    if (result) {
      ElMessage.success('修改成功，2s后跳转到文章详情页面')
      setTimeout(() => {
        router.push(`/article/${articleInfo.value.id}`)
      }, 2000)
    }
  })
}

onMounted(async () => {
  const result = await getArticleItemInfo(route.params.id as string)
  if (result) {
    // 清空 richImg，mdImg
    richImg.value = []
    mdImg.value = []
    Object.assign(articleInfo.value, result.data)
    articleInfo.value.articleSectionId = result.data.articleSection.id
    if (articleInfo.value.content.richEditor) {
      editorName.value = 'tinymce'
      contentRich.value = articleInfo.value.content.html
      content.value = ''
      text.value = ''
    } else {
      editorName.value = 'markdown'
      content.value = articleInfo.value.content.html
      text.value = articleInfo.value.content.text
      contentRich.value = ''
    }
    tags.value = articleInfo.value.articleTags
  }
})

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>

<template>
  <div>
    <MyPageHeader class="header"> 编辑文章 {{ articleInfo.title }}</MyPageHeader>
    <div class="edit">
      <el-alert
        :title="`本文使用了${
          articleInfo.content.richEditor ? '富文本' : 'Markdown'
        }编辑器进行编写，请注意编辑器的选择`"
        type="warning"
        effect="dark"
      ></el-alert>
      <input class="title" v-model="articleInfo.title" />
      <div class="summary">
        <el-input
          v-model="articleInfo.summary"
          autosize
          show-word-limit
          maxlength="100"
          type="textarea"
          placeholder="请输入摘要 不多于100字"
        />
      </div>
      <!-- 双重切换编辑器 -->
      <CustomEditor :defaultEditor="editorName" />
      <div class="bottom">
        <div class="tag">
          <TagChoose
            :choosedTag="tags"
            :chooseOptions="canChooseTags"
            :canAdd="true"
            @addTag="addTagFn"
          />
          <div class="pannel">
            <p class="label">板块选择</p>
            <el-select v-model="articleInfo.articleSectionId" placeholder="选择板块">
              <el-option
                v-for="item in articleSections"
                :key="item.id"
                :label="item.sectionName"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="publish">
          <el-button type="primary" round size="large" class="submit-btn" @click="submitChange"
          >修改
          </el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .edit {
    display: flex;
    flex-direction: column;
    background-color: var(--common-bg);
    margin: 1rem 0;
    padding: 1rem;
    .border-normal();
    .font-normal();

    .title {
      background-color: rgba(255, 255, 255, 0.014);
      height: 48px;
      border: none;
      outline: none;
      width: 100%;
      font-size: 2.6rem;
      margin: 1rem 0;
    }

    .summary {
      margin: 1rem 0;

      :deep(.el-textarea) {
        .el-textarea__inner {
          min-height: 60px !important;
        }
      }
    }

    .bottom {
      .flex-multi(column, space-between, center);

      .tag {
        width: 100%;
        margin: 1rem 0;
        .flex-multi(column, center, flex-start);
      }

      .pannel {
        width: 100%;
        display: flex;
        align-items: center;

        .label {
          width: 100px;
        }

        .el-select {
          width: 230px;
        }
      }

      .publish {
        width: 100%;
        padding-top: 1rem;

        :deep(.el-button) {
          width: 100%;
        }
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .edit {
    .bottom {
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
