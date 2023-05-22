<template>
  <div class="article-item">
    <div class="list-box" v-for="item in userArticlePage.list">
      <ArticleItem :articleItem="item" />
      <div class="button-group">
        <ul class="pannel">
          <li @click="$router.push(`/updatearticle/${item.id}`)">编辑</li>
          <li class="danger" @click="deleteArticle(item.id, item.title)">删除</li>
        </ul>
      </div>
    </div>
    <div class="page" v-show="userArticlePage.pages > 1">
      <el-pagination
        :total="userArticlePage.total"
        v-model:current-page="current"
        :page-size="userArticlePage.size"
        @current-change=""
        :background="true"
        layout="prev, pager, next, ->, jumper, total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user'
import { getUserArticlePage, deleteArticleLogical } from '@/api/blog'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

const userInfoStore = useUserInfoStore()
const { userInfo } = storeToRefs(userInfoStore)

/* 删除文章（逻辑删除） */
const deleteArticle = async (articleId: string, title: string) => {
  ElMessageBox.confirm(`你确定要删除标题为【${title}】的文章吗？删除后可到回收站查看`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消删除',
    type: 'warning'
  }).then(async () => {
    let result = await deleteArticleLogical(articleId)
    if (result) {
      queryUserArticlePage(userInfo.value.userId)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  })
}

const userArticlePage = ref<ArticlePageResVO>({
  current: 1,
  pages: 0,
  size: 10,
  total: 0,
  list: []
})
/* 查询当前用户文章分页信息 */
const current = ref(1)
watch(current, (newVal) => {
  queryUserArticlePage(userInfo.value.userId)
  document.documentElement.scrollTop = 0
})
const queryUserArticlePage = async (userId: string) => {
  const result = await getUserArticlePage(userId, { pageNum: current.value })
  if (result) {
    Object.assign(userArticlePage.value, result.data)
  }
}
onMounted(() => {
  queryUserArticlePage(userInfo.value.userId)
})
</script>

<style lang="less" scoped>
.page {
  .font-normal();
  border: 0.2rem solid @themeColor2;
  border-radius: 1rem;
  font-size: 1.3rem;
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.list-box {
  padding: 5px;

  .button-group {
    .pannel {
      display: flex;
      align-items: center;

      li {
        padding: 0 1rem;
        background-color: var(--common-bg);
        border-radius: 2rem;
        margin: 0 1rem;
        transition: all ease 0.4s;
        .border-normal();
        .flexbox();
        .cursor-pointer();

        &:hover {
          transform: translateY(-3px);
        }
      }

      .danger {
        background-color: rgb(248, 34, 19);
        color: #fff;
      }
    }
  }
}
</style>
