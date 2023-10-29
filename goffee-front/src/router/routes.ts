import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    alias: ['/home'],
    children: [
      {
        path: '',
        name: 'Index',
        meta: {
          title: '一切都是命运石之门的选择',
          isHome: true,
          keepAlive: false
        },
        component: () => import('@/views/index/index.vue')
      },
      {
        path: 'articles',
        name: 'Articles',
        meta: {
          title: '文章列表',
          isHome: false,
          keepAlive: true
        },
        component: () => import('@/views/articles/index.vue')
      },
      {
        path: 'edit',
        name: 'Edit',
        meta: {
          title: '发表文章',
          isHome: false,
          requireAuth: true,
          keepAlive: false
        },
        component: () => import('@/views/edit/index.vue')
      },
      {
        path: 'userpage',
        name: 'UserPage',
        meta: {
          title: '用户主页',
          isHome: false,
          requireAuth: true,
          keepAlive: true
        },
        component: () => import('@/views/userpage/index.vue')
      },
      {
        path: 'creation',
        name: 'creation',
        meta: {
          title: '创作中心',
          isHome: false,
          requireAuth: true,
          keepAlive: false
        },
        component: () => import('@/views/creation/index.vue')
      },
      {
        path: '/article/:id',
        name: 'ArticleDetail',
        meta: {
          isHome: false,
          keepAlive: false
        },
        component: () => import('@/views/articledetail/index.vue')
      },
      {
        path: '/updatearticle/:id',
        name: 'UpdateArticle',
        meta: {
          title: '修改文章',
          isHome: false,
          requireAuth: true,
          keepAlive: false
        },
        component: () => import('@/views/updatearticle/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  }
]
