<template>
  <div class="userinfo-easy">
    <div class="avatar">
      <CustomUploadAvatar :avatar="userInfo.avatar" :is-show="false" />
    </div>
    <div class="infobox">
      <div class="nickname">
        {{ userInfo.nickname }} #{{ userInfo.uid }}
        <svg class="male icon" v-if="userInfo.gender === 1">
          <use xlink:href="#icon-nansheng"></use>
        </svg>
        <svg class="female icon" v-else-if="userInfo.gender === 2">
          <use xlink:href="#icon-nvsheng"></use>
        </svg>
        <svg class="unknown icon" v-else>
          <use xlink:href="#icon-xingbie"></use>
        </svg>
      </div>
      <div class="introduction">
        {{ userInfo.introduction ? userInfo.introduction : '介绍一下自己吧 ~' }}
      </div>
      <div class="more-info">
        <div class="date">
          <el-icon><Calendar /></el-icon>
          创建日期: {{ userInfo.gmtCreate ? userInfo.gmtCreate : '创始人' }}
        </div>
        <div class="email">
          <el-icon><Message /></el-icon>
          邮箱: {{ userInfo.email ? userInfo.email : '未设置' }}
        </div>
        <div class="username">
          <el-icon><User /></el-icon>
          用户名: {{ userInfo.username }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, User, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const { userInfo } = storeToRefs(useUserStore())
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .userinfo-easy {
    padding: 1rem;
    .flex-multi(row, stretch, center);
    width: 100%;
    flex-shrink: 0;

    .avatar {
      width: 150px;
      height: 150px;
    }

    .infobox {
      width: 100%;
      text-align: left;
      padding-left: 20px;
      margin-top: 1rem;
      flex: 1;

      .nickname {
        font-size: 25px;
        .text-line-show(1);
        .icon {
          display: inline-block;
          font-size: 1.5rem;
          margin-left: 1rem;
        }
      }

      .introduction {
        margin-top: 1rem;
        font-size: 1rem;
      }

      .more-info {
        margin-top: 1rem;
        font-size: 1rem;
        line-height: 30px;

        .el-icon {
          margin-right: 2px;
        }

        .date,
        .username,
        .email {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .userinfo-easy {
    flex-direction: column;
    width: 26%;

    .avatar {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
