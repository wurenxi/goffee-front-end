<template>
  <div class="tools navChild">
    <ul class="tool-group">
      <li v-if="colorMode == 'light'">
        <svg class="iconfont sun" width="50" height="50" @click="changeTheme('dark')">
          <use xlink:href="#icon-taiyangrichu"></use>
        </svg>
      </li>
      <li v-else>
        <svg class="iconfont moon" width="50" height="50" @click="changeTheme('light')">
          <use xlink:href="#icon-rila"></use>
        </svg>
      </li>
      <li class="user-info" v-if="!userInfo.userId">
        <router-link to="/login"> Login </router-link>
      </li>
      <li class="user-info" v-else>
        <div class="container" @mouseenter="infoShow = true" @mouseleave="infoShow = false">
          <div class="avatar">
            <CustomElImage :img="userInfo.avatar ? userInfo.avatar : avatar" :zip="2" />
          </div>
          <transition name="toptodown" mode="out-in">
            <!-- 显示个人信息 -->
            <div v-show="infoShow" class="info-box">
              <!-- 背景图 -->
              <div class="imgcontainer">
                <CustomElImage :img="banner" :zip="3" />
              </div>
              <div class="loginbox">
                <div class="up">
                  <div class="info">
                    <h2>{{ userInfo.nickname }}</h2>
                    <div>
                      {{ userInfo.introduction ? userInfo.introduction : '介绍一下自己吧' }}
                    </div>
                  </div>
                </div>
                <div class="button">
                  <ul>
                    <li @click="$router.push('/userpage')">
                      <svg class="icon people">
                        <use xlink:href="#icon-people"></use>
                      </svg>
                      <span>个人中心</span>
                    </li>
                    <li @click="$router.push('/creation')">
                      <svg class="icon pen">
                        <use xlink:href="#icon-pen"></use>
                      </svg>
                      <span>我的文章</span>
                    </li>
                    <li @click="logout">
                      <svg class="icon cancel">
                        <use xlink:href="#icon-cross"></use>
                      </svg>
                      <span>退出登录</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/file'
import { useColorMode } from '@vueuse/core'
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'
import topbarBanner from '@/assets/img/steinsgate/topbar-banner.jpg'
import { useUserInfoStore, useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'

const { editorTheme } = storeToRefs(useEditorStore())
const { userInfo } = storeToRefs(useUserInfoStore())
// 默认头像
const avatar = ref<string>(defaultAvatar)
// 默认banner
const banner = ref<string>(topbarBanner)
const infoShow = ref(false)

/* 退出登录 */
const logout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    useUserStore().logout(userInfo.value.userId)
  })
}

const colorMode = useColorMode({
  modes: {
    light: 'light',
    dark: 'dark'
  },
  attribute: 'theme'
})
const changeTheme = (theme: 'light' | 'dark') => {
  colorMode.value = theme
  // 修改md编辑器主题
  if (theme === 'light') {
    editorTheme.value = 'light'
  } else {
    editorTheme.value = 'dark'
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/styles/MyAnimate.less');

@media screen and (min-width: @mobile-device) {
  .tool-group {
    display: flex;
    align-items: center;

    .iconfont:hover {
      transform: scale(0.95);
    }

    .user-info {
      display: none;
    }

    .container {
      &:hover {
        .avatar {
          transform: scale(1.2) translate(-11px, 19px);
        }
      }

      .avatar {
        width: 4.2rem;
        height: 4.2rem;
        border-radius: 50%;
        background-color: var(--common-bg);
        overflow: hidden;
        z-index: 9999;
        transition: all ease 0.4s;
        box-sizing: content-box;
        border: var(--common-bg) 5px solid;
      }

      .info-box {
        position: absolute;
        width: 290px;
        top: 100%;
        right: 30px;
        display: flex;
        z-index: -1;
        background-color: var(--common-bg);
        box-shadow: 3px 5px rgb(0, 0, 0, 0.3);
        border-radius: 40px;
        overflow: hidden;
        background-size: 100% auto;
        border: var(--common-bg) 0.2rem solid;

        .imgcontainer {
          position: absolute;
          width: 100%;
          height: 7rem;
          z-index: -5;
        }

        .loginbox {
          width: 100%;
          .flex-multi(column, flex-start, stretch);
          color: #fff;
          padding: 1rem 2rem;
          font-size: 1rem;

          .up {
            .flex-multi(row, flex-start, flex-start);

            h2 {
              margin: 0.5rem 0;
              font-size: 1.6rem;
            }
          }

          .button {
            display: flex;
            flex-direction: column;
            color: var(--common-font-color);
            width: 100%;
            margin-top: 1rem;
            font-size: 2rem;
            font-weight: 100;

            li {
              font-size: 1.5rem;
              display: flex;
              align-items: center;
              .cursor-pointer();
              margin: 1rem 0px;

              &:first-child {
                margin-top: 10px;
              }

              .icon {
                margin-right: 1rem;
                font-size: 1.5rem;
                text-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.5);
              }

              &:last-child {
                margin-top: 15px;
                border-bottom: none;
                color: red;
                font-weight: 600;
              }

              &:hover {
                text-shadow: 3px 3px 10px rgba(255, 80, 80, 0.3);
              }

              border-bottom: var(--common-font-color) 2px dashed;
            }
          }
        }
      }
    }

    li {
      margin: 1rem;
      &:hover {
        .cursor-pointer();
      }
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .tool-group {
    .user-info {
      display: block;
      a {
        color: var(--common-font-color);
      }
    }
  }
}

.tools {
  color: white;
  display: flex;
  justify-content: flex-end;
}
</style>
