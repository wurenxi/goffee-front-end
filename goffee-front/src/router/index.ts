import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 路由
import { routes } from './routes'
import { ElMessageBox, ElMessage } from 'element-plus'
// useBlogStore
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 每次切换路由页面滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: 'smooth' }
  }
})

/* 重置路由 */
export function resetRouter(msg?: string) {
  router.replace({ path: '/login' })
  ElMessage({
    message: msg ? msg : '退出登录成功',
    type: 'success'
  })
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const hasToken = useUserStore().token
  if (to.meta.title) {
    document.title = `${to.meta.title} - GoffeeBlog`
  }
  if (hasToken) {
    try {
      await useUserStore().getInfo()
    } catch(error) {
      // 移除 token 并跳转登录页
      await useUserStore().resetLoginInfo()
      next('/login')
    }
    if (to.path === '/login') {
      next({ path: '/home' })
    } else {
      next()
    }
  } else {
    if (to.meta.requireAuth) {
      await ElMessageBox.confirm('该页面需要登录才可访问，请问是否跳转到登录页？', '登录提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          NProgress.start()
          next({ path: '/login', query: { redirect: to.path } })
        })
        .catch(() => {
          NProgress.done()
        })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  /* 文章详情回退到文章列表，不清空查询条件 */
  if (to.name === 'Articles' && from.name === 'ArticleDetail') {
    useBlogStore().getArticles()
    NProgress.done()
    return
  }
  if (to.query.tagId && to.query.tagName && to.name === 'Articles') {
    const { tagId, tagName } = to.query as { tagId: string; tagName: string }
    if (from.name !== 'Articles') {
      useBlogStore().resetArticlePageQueryParam()
      useBlogStore().resetChooseTags()
    }
    useBlogStore().getTagId({ id: Number.parseInt(tagId), tagName })
  } else if (to.query.articleSectionId && to.name === 'Articles') {
    const { articleSectionId } = to.query as { articleSectionId: string }
    if (from.name !== 'Articles') {
      useBlogStore().resetArticlePageQueryParam()
      useBlogStore().resetChooseTags()
    }
    useBlogStore().queryArticlePageParam.articleSectionId = Number.parseInt(articleSectionId)
    useBlogStore().getArticles()
  } else if (to.name === 'Articles') {
    useBlogStore().resetArticlePageQueryParam()
    useBlogStore().resetChooseTags()
  }
  NProgress.done()
})

export default router
