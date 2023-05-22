<template>
  <div class="detail">
    <div class="bottom-text">
      <div class="left">
        <p class="red">转载请标明出处，谢谢。</p>
      </div>
    </div>
    <div class="tags">
      <TagItem
        v-for="tag in article.articleTags"
        :key="tag.id"
        :tagId="tag.id!"
        :tagName="tag.tagName"
        :isClick="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  article: ArticleItemInfoVO
}>()
</script>

<style lang="less" scoped>
.detail {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  .bottom-text {
    font-size: 1.5rem;
    color: var(--common-font-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.tags {
  margin: 20px 0;
}
</style>
