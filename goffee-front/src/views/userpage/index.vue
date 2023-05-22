<template>
  <div class="my-info">
    <!-- 封面图 头图 -->
    <BannerItem />
    <!-- 个人信息 -->
    <div class="info-detail">
      <UserInfo />
      <div class="all-info">
        <FormGroup />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerItem from './components/BannerItem.vue'
import UserInfo from './components/UserInfo.vue'
import FormGroup from './components/FormGroup.vue'
import { useChangeHeaderStyle } from '@/hooks/useChangeHeaderStyle'

/* 设置头部的样式 */
useChangeHeaderStyle()
</script>
<script lang="ts">
export default {
  name: 'UserPage'
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .my-info {
    width: 100%;
    .font-normal();
    .border-normal();
    overflow: hidden;
    min-height: 900px;
    background-color: var(--common-bg);
    margin: 1rem 0;
    .info-detail {
      display: flex;
      flex-direction: column;
      .all-info {
        padding: 1rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        color: var(--common-font-color);
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .my-info {
    margin: 1rem 0;
    .info-detail {
      flex-direction: row;
    }
  }
}
</style>
