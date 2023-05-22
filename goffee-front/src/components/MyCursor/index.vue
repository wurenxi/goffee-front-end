<template>
  <div id="ani-pointer" ref="aniPointer"></div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const aniPointer = ref<HTMLDivElement>() as Ref<HTMLDivElement>
onMounted(() => {
  const aniTimeline = gsap.timeline({ repeat: -1, yoyo: true })
  aniTimeline.to(aniPointer.value, {
    duration: 1,
    backgroundImage: 'url(/src/assets/cursor-ani/正常选择.ani)'
  })
})
</script>
<script lang="ts">
export default {
  name: 'MyCursor'
}
</script>
