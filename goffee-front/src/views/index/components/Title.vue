<template>
  <div class="main-title">
    <img class="tw-rounded-full" src="@/assets/tmpImg/coffee-2.png" alt="" />
    <h1>个人博客 Goffee</h1>
    <p class="description">
      该博客为全栈项目，包含技术：Java，SpringBoot，MySQL，Redis，Vue3，TypeScript，ElementPlus等。
      本博客为学习、分享知识所用。
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  .description {
    max-width: 35rem;
    font-size: 1.6rem;
    line-height: 1.3;
    color: #888;
    text-align: center;
  }
}
img {
  width: 300px;
  height: 300px;
}
h1 {
  font-size: 60px;
}
</style>
