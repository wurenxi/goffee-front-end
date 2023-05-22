<template>
  <div class="banner">
    <el-upload class="upload" :show-file-list="true" :limit="1" accept=".png, .jpg, .jpeg">
    </el-upload>
    <div class="tw-h-full tw-w-full">
      <CustomElImage :img="banner" not-fount-type="3:1" :zip="4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultUserBanner from '@/assets/img/steinsgate/user-default-banner2.jpg'

// ts特有定义默认值 withDefaults
withDefaults(
  defineProps<{
    banner?: string
  }>(),
  {
    banner: () => defaultUserBanner
  }
)
</script>

<style lang="less" scoped>
.banner {
  position: relative;
  width: 100%;
  height: 380px;
  background-color: white;

  .upload {
    position: absolute;
    right: 20px;
    bottom: 30px;
    z-index: 1;
  }
}
</style>
