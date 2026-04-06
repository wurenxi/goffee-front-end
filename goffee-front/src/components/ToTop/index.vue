<script lang="ts">
export default {
  name: 'ToTop'
}
</script>
<script setup lang="ts">

withDefaults(
  defineProps<{
    right?: string
  }>(),
  {
    right: '60px'
  }
)

const backToTop = ref<HTMLElement>()

window.addEventListener('scroll', () => {
  const scroHei = window.scrollY
  if (scroHei > 500) {
    backToTop.value!.style.top = '0px'
  } else {
    backToTop.value!.style.top = '-999px'
  }
})
const toTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}
</script>

<template>
  <div
    ref="backToTop"
    class="back-to-top cd-top faa-float animated cd-is-visible"
    :style="{ top: '-999px', right: right }"
    @click="toTop"
  ></div>
</template>

<style scoped>
@import url('./style/index.less');
</style>