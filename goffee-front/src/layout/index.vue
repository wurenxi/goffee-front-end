<template>
  <div class="container">
    <!-- 头部 -->
    <TopNavBar :mainClass="mainClass" />
    <!-- 主体 -->
    <div class="main" ref="mainClass">
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <router-view v-slot="{ Component }">
          <KeepAlive :include="pages">
            <component :is="Component"></component>
          </KeepAlive>
        </router-view>
      </transition>
    </div>
    <FooterItem />
    <div ref="rainBox" id="rainBox"></div>
    <el-backtop :right="20" :bottom="50" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Layout'
}
</script>
<script setup lang="ts">
import { useCacheStore } from '@/stores/cache'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const { token } = storeToRefs(useUserStore())

const mainClass = ref<HTMLDivElement>()
const cachePages = useCacheStore()
const pages = cachePages.cachePages
// 监视页面，并动态设置页面缓存
const route = useRoute()
watch(route, (to) => {
  if (to.meta.KeepAlive) {
    if (to.name) {
      cachePages.setCachePage(to.name.toString())
    }
  }
})

/* 下雨特效 */
const rainBox = ref<HTMLDivElement>()
const doRain = () => {
  let boxHeight = rainBox.value!.clientHeight
  let boxWidth = rainBox.value!.clientWidth
  // 页面大小发生变化时，改变盒子大小
  window.onresize = function () {
    boxHeight = rainBox.value!.clientHeight
    boxWidth = rainBox.value!.clientWidth
  }
  // 每隔一段时间，添加雨滴
  const raining = setInterval(() => {
    const rain = document.createElement('div')
    rain.classList.add('rain')
    rain.style.top = '0'
    // 随机刷新雨点位置
    rain.style.left = Math.random() * boxWidth + 'px'
    // 随机雨点透明度
    rain.style.opacity = Math.random().toString()
    rain.style.position = 'absolute'
    rain.style.width = '2px'
    rain.style.height = '50px'
    rain.style.background = 'linear-gradient(rgba(255, 255, 255, .3), rgba(255, 255, 255, .6))'
    rainBox.value?.appendChild(rain)
    // 每隔一段时间，雨滴下落
    let race = 1
    const timer = setInterval(() => {
      if (parseInt(rain.style.top) > boxHeight) {
        clearInterval(timer)
        rainBox.value?.removeChild(rain)
      }
      race++
      rain.style.top = parseInt(rain.style.top) + race + 'px'
    }, 20)
  }, 50)
}

onMounted(() => {
  if (!token.value) {
    doRain()
  }
})
</script>

<style lang="less" scoped>
#rainBox {
  position: fixed;
  width: 100vw;
  height: 100vh;
  // 不阻挡其他元素事件触发
  pointer-events: none;
  z-index: 9999;
  pointer-events: none;
}

.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  transition: 0.5s ease all;

  .main {
    margin: 0 auto;
    width: 80%;
    min-height: 712px;
  }
}

@media screen and (min-width: @mobile-device) {
  .container {
    .main {
      width: 100%;
    }
  }
}

@media screen and (min-width: @normal-device) {
  .container {
    .main {
      width: 80%;
    }
  }
}
</style>
