<template>
  <div class="tags-all">
    <div class="title">
      <p>所有标签</p>
    </div>
    <el-divider class="tw-my-4"></el-divider>
    <TagItem
      v-for="tag in blogStore.articleTags"
      :key="tag.id"
      :tagId="tag.id!"
      :tagName="tag.tagName"
    />
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
</script>

<style lang="less" scoped>
.tags-all {
  background-color: var(--common-bg);
  padding: 1rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 0.2rem solid var(--border-color);
  box-shadow: 5px 5px 0 var(--box-shadow-color);
  .title {
    display: flex;
    flex-direction: column;
    .font-normal();
    font-size: 2rem;
    p {
      color: var(--common-font-color);
    }
  }
  :deep(.tag) {
    margin-right: 1rem;
  }
}
</style>
