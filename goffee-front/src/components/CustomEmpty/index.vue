<template>
  <div>
    <el-empty :image="img" :image-size="350" :description="desc"></el-empty>
  </div>
</template>

<script setup lang="ts">
import img from '@/assets/img/empty.png'

withDefaults(
  defineProps<{
    desc?: string
  }>(),
  {
    desc: '暂无数据'
  }
)
</script>

<style lang="less" scoped></style>
