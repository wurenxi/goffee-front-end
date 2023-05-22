<template>
  <div class="sub-title">
    <div class="content">
      <p>
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
</script>

<style lang="less" scoped>
.sub-title {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1rem 1rem 0 1rem;
  border-radius: 1rem 1rem 0 0;
  font-size: 2rem;
  background-color: var(--sub-title-bg);
  color: var(--sub-title-font-color);
  .content {
    .flex-multi(row, space-between, flex-end);
  }

  &::after {
    content: '';
    display: block;
    width: 100%;
    margin-top: 1rem;
    height: 5px;
    border-radius: 999px;
    background-color: skyblue;
  }
}
</style>
