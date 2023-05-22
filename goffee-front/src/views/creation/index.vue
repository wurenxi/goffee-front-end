<template>
  <div class="create-center">
    <div class="upinfo">
      <p class="title">创作中心</p>
      <p class="tip">这里记录了所有你的投稿</p>
    </div>
    <div class="content">
      <el-tabs type="card">
        <el-tab-pane label="文章创作">
          <MyArticle />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyArticle from './components/MyArticle.vue'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>
<script lang="ts">
export default {
  name: 'Creation'
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .create-center {
    padding: 1rem;
    background-color: var(--common-bg);
    margin: 1rem 0;
    border-radius: 1rem;
    .border-normal();
    .font-normal();
    display: flex;
    flex-direction: column;
    .upinfo {
      .title {
        font-size: 2rem;
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .create-center {
    margin: 1rem 0;
  }
}
</style>
