<template>
  <section class="header">
    <div class="back-btn" @click="backFn">Back</div>
    <p class="page-title">
      <slot></slot>
    </p>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    backFn?: (payload: MouseEvent) => void
  }>(),
  {
    backFn: () => {
      window.history.back()
    }
  }
)
</script>

<style lang="less" scoped>
.header {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  .back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--common-bg);
    color: var(--common-font-color);
    padding: 0.5rem 1rem;
    .cursor-pointer();
    .border-normal();
    border-color: #ccccd8;
    &:hover {
      border-color: @themeColor;
    }
  }

  .page-title {
    margin-left: 2rem;
    font-size: 2rem;
    color: #fff;
  }
}
</style>
