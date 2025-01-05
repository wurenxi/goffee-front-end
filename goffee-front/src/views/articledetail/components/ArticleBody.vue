<template>
  <section>
    <div
      ref="markdownBody"
      v-html="html"
      v-highlight
      class="markdown-body"
      id="markdown-body"
      @click="ImagePreview($event)"
    ></div>
    <template v-if="showPreview">
      <ElImageViewer
        v-if="showPreview"
        :infinite="false"
        :url-list="urlList"
        :hide-on-click-modal="true"
        :teleported="false"
        @close="close"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import type { Directive } from 'vue'
import { isMobile } from '@/utils/mobile'
import '@/assets/styles/markdown/markdown.less'
import Prism from 'prismjs'
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'

const blogStore = useBlogStore()
const { container } = storeToRefs(blogStore)

withDefaults(
  defineProps<{
    html?: string
  }>(),
  {
    html: () => ''
  }
)

const markdownBody = ref<HTMLElement>()
onMounted(() => {
  loadContent()
})

/* 加载文件且赋值给被监听属性 */
const loadContent = () => {
  // 图片加载为异步的，需等待所有图片加载完成再做赋值，否则锚点错位
  const images = markdownBody.value!.querySelectorAll('img')
  const totalImages = images.length
  let loadedImages = 0
  if (totalImages === 0) {
    container.value = markdownBody.value as HTMLElement
    return
  }
  images.forEach((image) => {
    image.onload = () => {
      loadedImages++
      if (loadedImages === totalImages) {
        container.value = markdownBody.value as HTMLElement
      }
    }
    if (image.complete) {
      image.onload(new Event('loaded'))
    }
  })
}

/* 高亮 */
const vHighlight: Directive = {
  mounted(el: HTMLElement) {
    const pres = el.querySelectorAll('pre')
    pres.forEach((pre) => {
      pre.classList.add('line-numbers')
    })
    const codes: NodeListOf<HTMLPreElement> = el.querySelectorAll('pre code')
    codes.forEach((code) => {
      Prism.highlightElement(code)
    })
  },
  updated(el: HTMLElement) {
    const pres = el.querySelectorAll('pre')
    pres.forEach((pre) => {
      pre.classList.add('line-numbers')
    })
    const codes: NodeListOf<HTMLPreElement> = el.querySelectorAll('pre code')
    codes.forEach((code) => {
      Prism.highlightElement(code)
    })
  }
}

let urlList = ref<Array<string>>([])
let showPreview = ref(false)
const ImagePreview = (e: any) => {
  if (e.target.nodeName === 'IMG') {
    urlList.value[0] = e.target.currentSrc
    showPreview.value = true
    isMobile()
      ? (document.documentElement.style.overflow = 'hidden')
      : (document.body.style.overflow = 'hidden')
  }
}
const close = () => {
  showPreview.value = false
  isMobile() ? (document.documentElement.style.overflow = '') : (document.body.style.overflow = '')
}
</script>

<style lang="less" scoped>
.markdown-body {
  margin: 1rem 0;
  padding: 1rem;
}

:deep(.toolbar-item) {
  margin-left: 1rem;

  > span {
    cursor: default;
  }

  span:hover {
    color: #fff;
  }
}
</style>
