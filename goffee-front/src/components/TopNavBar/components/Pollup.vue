<template>
  <transition name="righttoleft">
    <nav v-show="isShow" class="pollup" ref="pollup">
      <div class="right">
        <!-- 这是上面的个人信息框 -->
        <div class="container">
          <div class="info-box">
            <!-- 信息框 -->
            <div class="loginbox">
              <div class="up">
                <!-- 头像 -->
                <div class="avatar">
                  <CustomElImage
                    :img="userInfo.avatar ? userInfo.avatar : defaultAvatar"
                    :zip="2"
                  />
                </div>
                <!-- 提示信息 以及个人签名 -->
                <div class="info">
                  <h3 v-if="userInfo.nickname">
                    {{ userInfo.nickname }}
                  </h3>
                  <h3 v-else>欢迎</h3>
                  <div v-if="userInfo.introduction">
                    {{ userInfo.introduction }}
                  </div>
                  <div v-else>登录后可以使用更多功能</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 手机弹出导航栏 -->
        <div class="menu-list">
          <router-link @click="closePollup" to="/home">
            <svg width="40" height="40">
              <use xlink:href="#icon-shouye"></use>
            </svg>
            &nbsp;首页
          </router-link>
          <router-link @click="closePollup" to="/articles">
            <svg width="40" height="40">
              <use xlink:href="#icon-wenzhang"></use>
            </svg>
            &nbsp;文章
          </router-link>
          <router-link @click="closePollup" to="/edit">
            <svg width="40" height="40">
              <use xlink:href="#icon-xiezi"></use>
            </svg>
            &nbsp;发表
          </router-link>
        </div>
        <div class="button-login" v-if="userInfo.userId">
          <el-button
            type="primary"
            plain
            @click="
              () => {
                closePollup()
                router.push('/userpage')
              }
            "
            >编辑资料</el-button
          >
          <el-button type="danger" plain @click="logout">退出登录</el-button>
        </div>
        <div class="button-login" v-else>
          <el-button
            type="success"
            plain
            @click="
              () => {
                $router.push('/login')
                closePollup
              }
            "
            >去登录</el-button
          >
        </div>
      </div>
    </nav>
  </transition>
  <transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-show="isShow" id="menu-mask" @click="closePollup"></div>
  </transition>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useUserInfoStore, useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'
import { ElMessageBox } from 'element-plus'

defineProps<{
  isShow: boolean
}>()

const userInfoStore = useUserInfoStore()
const { userInfo } = storeToRefs(userInfoStore)
const emit = defineEmits(['close'])

let pollup = ref<HTMLElement | null>()
const router = useRouter()

const closePollup = () => {
  emit('close')
  const body = document.querySelector('body')
  body!.style.overflow = 'auto'
}

/* 退出登录 */
const logout = () => {
  emit('close')
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    useUserStore().logout(userInfo.value.userId)
  })
}

onMounted(() => {
  if (pollup.value) {
    onClickOutside(pollup, () => emit('close'))
  }
})
</script>

<style lang="less" scoped>
@import url(@/assets/styles/MyAnimate.less);

@media screen and (min-width: @mobile-device) {
  #menu-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    transition: 0.5s all linear;
    z-index: 99;
    opacity: 1;
  }

  // 移动端弹出层样式
  .pollup {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    transition: all 0.3s ease;
    width: 300px;
    height: 100%;
    color: #fff;
    .shadow(2, 10);
    .font-normal();
    background: url('@/assets/img/steinsgate/pollup-bg3.jpg') bottom center / cover no-repeat local;
    opacity: 0.9;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }

    .right {
      justify-content: space-between;
      color: #fff;
      font-size: 2rem;
      align-items: center;
      position: relative;
      height: 100%;

      // 头像以及个人信息
      .container {
        .info-box {
          width: 100%;
          position: relative;
          height: 14rem;
          display: flex;
          align-items: center;
          background-size: 100% auto;
          .font-normal();

          .loginbox {
            width: 100%;
            display: flex;
            color: #fff;
            padding: 1rem 0;
            flex-direction: column;
            justify-content: space-between;

            .up {
              .flexbox(column);
              text-align: center;
              padding: 0 1rem;

              .avatar {
                flex-shrink: 0;
                width: 5.5rem;
                height: 5.5rem;
                opacity: 0.5;
                transition: 0.5s all ease-in-out;

                &:hover {
                  opacity: 1;
                }
              }

              .info {
                color: #fff;

                h3 {
                  font-size: 2rem;
                }

                div {
                  font-size: 1.3rem;
                }
              }

              h2 {
                margin: 1rem 0;
                font-size: 2rem;
              }
            }
          }
        }

        .avatar {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          overflow: hidden;
          background-color: #fff;
          z-index: 2;
          transition: all ease 1s;

          img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .menu-list {
      display: flex;
      height: 150px;
      flex-direction: column;
      margin-top: 30px;
      font-size: 2rem;
      font-weight: 600;
      animation: sidebarItem 0.8s;
      color: rgb(102, 102, 102);

      a {
        padding: 10px;
        .cursor-pointer();
        display: flex;
        align-items: center;
        color: rgb(30, 31, 34);
        opacity: 0.7;
        font-size: 1.8rem;

        &:hover {
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .button-login {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      position: relative;
      top: 20%;

      .el-button {
        margin: 0;
        height: 4rem;
        margin: 2rem 1rem 0;
        transition: 0.2s all ease-in-out;
      }
    }
  }
}

.el-button {
  .cursor-pointer();
}

@media screen and (min-width: @smallpc-device) {
  .pollup {
    display: none;
  }
  #menu-mask {
    opacity: 0;
  }
}

@keyframes sidebarItem {
  0% {
    transform: translateX(-200px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
