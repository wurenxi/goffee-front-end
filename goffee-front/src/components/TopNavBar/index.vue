<template>
  <div class="container-top full-page" id="page-header" ref="pageHeader">
    <!-- 导航组件 -->
    <nav class="navBar tw-shadow-xl">
      <Logo @openPollup="isShow = true" />
      <DocMenu />
      <Tools />
    </nav>
    <div class="site-info">
      <h1 class="site-title">Goffee</h1>
      <div class="site-subtitle">
        <Typed :options="typedOptions">
          <span class="subtitle typing"></span>
        </Typed>
      </div>
    </div>
    <div class="scroll-down">
      <svg class="scroll-down-effects" width="50" height="50" @click="scrollDown">
        <use xlink:href="#icon-down"></use>
      </svg>
    </div>
    <div id="web_bg" ref="layoutBg"></div>
    <div id="waves">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          ></path>
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0"></use>
          <use xlink:href="#gentle-wave" x="48" y="3"></use>
          <use xlink:href="#gentle-wave" x="48" y="5"></use>
          <use xlink:href="#gentle-wave" x="48" y="7"></use>
        </g>
      </svg>
    </div>
  </div>
  <Pollup :isShow="isShow" @close="closePollup" />
</template>

<script lang="ts">
export default {
  name: 'TopNavBar'
}
</script>
<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { Typed, type TypedOptions } from '@duskmoon/vue3-typed-js'
import bg2 from '@/assets/img/steinsgate/bg-all2.jpg'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const { token } = storeToRefs(useUserStore())

const props = defineProps<{
  // main 类选择器
  mainClass: HTMLDivElement | undefined
}>()

const instance = getCurrentInstance()
const pageHeader = ref<HTMLDivElement>()

/* 侧边栏 */
const isShow = ref(false)
const closePollup = () => {
  isShow.value = false
}

/* 打字机效果 */
const typedOptions: TypedOptions = {
  strings: ['El Psy Kongroo'],
  loop: true,
  typeSpeed: 250,
  backSpeed: 100,
  startDelay: 1000,
  smartBackspace: true
}

/* 箭头 */
const scrollDown = () => {
  scrollToDest(props.mainClass!.offsetTop, 300)
}
const scrollToDest = (pos: number, time: number = 500) => {
  const currentPos = window.scrollY
  if (currentPos > pos) {
    pos -= 70
  }

  let start: number = 0
  pos = +pos
  window.requestAnimationFrame(function step(currentTime: number) {
    start = start == 0 ? currentTime : start
    const progress = currentTime - start
    if (currentPos < pos) {
      window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos)
    } else {
      window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time)
    }

    if (progress < time) {
      window.requestAnimationFrame(step)
    } else {
      window.scrollTo(0, pos)
    }
  })
}

/* 根据不同页面，设置头部的高度 */
let isHome = ref<boolean>(true)
onMounted(() => {
  instance?.proxy?.$Bus.on('on-isHome', (params) => {
    isHome.value = params as boolean
  })
})
watch(isHome, (newVal, oldVal) => {
  if (newVal) {
    pageHeader.value?.classList.replace('not-home-page', 'full-page')
  } else {
    pageHeader.value?.classList.replace('full-page', 'not-home-page')
  }
})

const layoutBg = ref<HTMLDivElement>()
/* 滚轮处理 */
let scrollCollect: () => void
onMounted(() => {
  scrollFn()
  if (token.value) {
    layoutBg.value!.style.background = `url(${bg2}) center center / cover no-repeat local`
  }
})
// 在组件销毁时移除滚动事件监听器
onBeforeUnmount(() => {
  window.removeEventListener<'scroll'>('scroll', scrollCollect)
})
const scrollFn = function () {
  const innerHeight = window.innerHeight + 56

  const scrollDirection = (currentTop: number) => {
    const result = currentTop > initTop
    initTop = currentTop
    return result
  }

  let initTop: number = 0
  const scrollTask = throttle(() => {
    const currentTop = ref(window.scrollY) || ref(document.documentElement.scrollTop)
    const isDown = scrollDirection(currentTop.value)
    if (currentTop.value > 56) {
      if (!isDown) {
        pageHeader.value?.classList.add('nav-visible')
      } else {
        pageHeader.value?.classList.remove('nav-visible')
      }
      pageHeader.value?.classList.add('nav-fixed')
    } else {
      if (currentTop.value === 0) {
        pageHeader.value?.classList.remove('nav-fixed')
      }
    }
  }, 200)

  scrollCollect = scrollTask
  window.addEventListener('scroll', scrollTask)
}
const throttle = function (func?: Function, wait?: any, options?: any) {
  let timeout: number, context: ComponentInternalInstance | null, args: any
  let previous = 0
  if (!options) options = {}

  const later = function () {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = 0
    func?.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function () {
    const now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = instance
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = 0
      }
      previous = now
      func?.apply(context?.proxy, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }

  return throttled
}
</script>

<style lang="less" scoped>
#web_bg {
  position: absolute;
  z-index: -999;
  width: 100%;
  height: 100%;
  background: url('@/assets/img/steinsgate/bg-all.jpg') center center / cover no-repeat local;
  animation: to_show 4s, breathe 15s linear infinite alternate;
}

.container-top {
  width: 100%;
  background: transparent;
  text-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.5);
  color: var(--header-text-color);

  .navBar {
    position: absolute;
    top: 0;
    z-index: 90;
    display: flex;
    height: 85px;
    width: 100%;
    font-size: 25px;
    justify-content: space-between;
    /* 元素水平居中 */
    align-items: center;
    box-shadow: none;
    padding: 0 1rem;

    opacity: 1;
    filter: none;
    transition: all 1s ease;
    animation: headerNoOpacity 1s, header-effect 1s;
  }

  .site-info {
    position: absolute;
    top: 43%;
    padding: 0 10px;
    width: 100%;
    animation: header-effect 1s;

    .site-title {
      position: relative;
      font-weight: bold;
      font-size: 3rem !important;
      margin: 0;
      text-align: center;
      line-height: 1.5;
      animation: titleScale 1s;
    }

    .site-subtitle {
      .flex-multi(row, center, center);
      overflow: hidden;
      font-size: 1.72rem;
      text-align: center;
      line-height: 1.5;
      animation: titleScale 1s;

      .subtitle {
        width: 170px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .scroll-down {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;

    .scroll-down-effects {
      .cursor-pointer();
      position: relative;
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-align: center;
      text-rendering: auto;
      line-height: 1.5;
      animation: scroll-down-effect 1.5s infinite;
    }
  }
}

// 响应式
.full-page {
  height: 100vh;
  position: relative;
  overflow: hidden;

  .waves {
    width: 100%;
    height: 15vh;
    margin-bottom: -0.6875rem;
    min-height: 3.125rem;
    max-height: 9.375rem;
    position: absolute;
    bottom: 0;
    opacity: 1;

    .parallax {
      use {
        animation: wave 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;

        &:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
          fill: var(--wave-color-od7);
        }

        &:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
          fill: var(--wave-color-od5);
        }

        &:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
          fill: var(--wave-color-od3);
        }

        &:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
          fill: var(--wave-color-o1);
        }
      }
    }
  }
}

.not-home-page {
  height: 85px;
  background-color: var(--common-bg);
  box-shadow: 0 2px 10px var(--box-shadow-color);
  text-shadow: 0 0 0.0625rem var(--grey-9-a1);
  color: var(--fix-navbar-text-color);

  .waves,
  #web_bg,
  .site-info,
  .scroll-down {
    display: none;
  }

  :deep(.menuList) {
    li {
      a {
        .my-icon {
          fill: var(--fix-navbar-text-color);
          filter: drop-shadow(0 0.2rem 0.3rem var(--grey-9-a1));
        }
      }

      //a::after {
      //  background-color: var(--common-font-color);
      //}
    }
  }
}

.nav-fixed {
  .navBar {
    position: fixed;
    top: -85px;
    z-index: 91;
    box-shadow: 0.1px 0.1px 0.2rem var(--grey-9-a1);
    opacity: 0;
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
    color: var(--fix-navbar-text-color);
    text-shadow: 0 0 0.0625rem var(--grey-9-a1);

    :deep(.menuList) {
      li {
        a::after {
          background-color: var(--common-font-color);
        }

        .my-icon {
          fill: var(--fix-navbar-text-color);
          filter: drop-shadow(0 0.2rem 0.3rem var(--grey-9-a1));
        }
      }
    }
  }
}

.nav-fixed.nav-visible {
  .navBar {
    opacity: 1;
    filter: none;
    transition: all 0.5s;
    transform: translateY(85px);
  }
}

@keyframes header-effect {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(-50%);
  }

  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

@keyframes headerNoOpacity {
  0% {
    transform: translateY(-50px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes titleScale {
  from {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: scale(0.7);
  }

  to {
    opacity: 1;
    filter: none;
    transform: scale(1);
  }
}

@keyframes scroll-down-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }

  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }

  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}

@keyframes wave {
  from {
    transform: translate3d(-90px, 0, 0);
  }

  to {
    transform: translate3d(85px, 0, 0);
  }
}

@keyframes breathe {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

@keyframes to_show {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
  }

  100% {
    opacity: 1;
    filter: none;
  }
}
</style>
