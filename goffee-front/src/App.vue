<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.js'
import { useBlogStore } from '@/stores/blog'
// 自定义鼠标样式
import { useMouseEffect } from '@/hooks/useMouseEffect'

/* useBlogStore */
const blogStore = useBlogStore()
useMouseEffect()

onMounted(() => {
  blogStore.getArticleSectionList()
  blogStore.getArticleTagList()
})
</script>

<style lang="less" scoped></style>
