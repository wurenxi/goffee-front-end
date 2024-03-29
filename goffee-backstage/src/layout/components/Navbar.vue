<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="flex">
      <hamburger
        :is-active="appStore.sidebar.opened"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb />
    </div>

    <!-- 右侧导航 -->
    <div class="navbar-right">
      <!-- 导航栏设置(窄屏隐藏)-->
      <div v-if="device !== 'mobile'" class="navbar-setting-wrapper">
        <!--全屏 -->
        <screenfull
          class="navbar-setting-item hover:bg-gray-50 dark:hover:bg-[var(--el-fill-color-light)]"
          id="screenfull"
        />
        <!-- 布局大小 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select
            class="navbar-setting-item hover:bg-gray-50 dark:hover:bg-[var(--el-fill-color-light)]"
          />
        </el-tooltip>
        <!--语言选择-->
        <lang-select
          class="navbar-setting-item hover:bg-gray-50 dark:hover:bg-[var(--el-fill-color-light)]"
        />
      </div>

      <!-- 用户头像 -->
      <el-dropdown trigger="click">
        <div class="flex justify-center items-center mx-2">
          <el-avatar :size="40" :src="userStore.avatar + '?imageView2/1/w/80/h/80'" />
          <i-ep-caret-bottom class="w-3 h-3" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout">
              {{ $t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { useUserStore } from '@/store/modules/user';

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();

// 默认头像
let defaultAvatar = ref('https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif')
if(!userStore.avatar) {
  userStore.avatar = defaultAvatar.value
}

const route = useRoute();
const router = useRouter();

const { device } = storeToRefs(appStore); // 设备类型：desktop-宽屏设备 || mobile-窄屏设备

function toggleSideBar() {
  appStore.toggleSidebar(true);
}

// 注销
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login`);
      });
  });
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 1px #0003;

  .navbar-right {
    display: flex;
    .navbar-setting-wrapper {
      display: flex;
      align-items: center;
      .navbar-setting-item {
        height: 50px;
        line-height: 50px;
        padding: 0 8px;
        display: inline-block;
        cursor: pointer;
        color: #5a5e66;
      }
    }
  }
}
</style>
