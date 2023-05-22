<template>
  <div class="divider"></div>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default {
  name: 'CustomDivider'
}
</script>

<style lang="less" scoped>
.divider {
  background: url(@/assets/img/divider/tree.png);
  width: 100%;
  height: 20px;
  margin: 3px;
  background-size: contain;
}
</style>
