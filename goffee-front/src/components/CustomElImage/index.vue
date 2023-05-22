<template>
  <el-image :src="img + (isOssImage ? quality : '')" fit="cover" :lazy="isLazy">
    <template #placeholder> </template>
    <template #error>
      <div class="gray">
        <img
          v-if="notFoundType !== 'fang'"
          class="tw-w-fill tw-h-fill"
          src="@/assets/img/404/404img.jpg"
        />
      </div>
    </template>
  </el-image>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'

interface CustomElImageProp {
  img?: string // 图片地址
  notFoundType?: string // 找不到图片的比例和大小
  isLazy?: boolean // 是否懒加载
  zip?: number // 压缩级别 默认为0（不压缩）
}
const props = withDefaults(defineProps<CustomElImageProp>(), {
  img: defaultAvatar,
  notFoundType: 'fang',
  isLazy: false,
  zip: 0
})

const notFoundType: string = 'fang'

/* 图片质量 */
const quality = computed(() => {
  let quality: string = ''
  switch (props.zip) {
    case 0:
      break
    case 1:
      quality = '?imageMogr2/thumbnail/100x/quality/30'
      break
    case 2:
      quality = '?imageMogr2/thumbnail/300x/quality/30'
      break
    case 3:
      quality = '?imageMogr2/thumbnail/640x/quality/60'
      break
    case 4:
      quality = '?imageMogr2/thumbnail/1080x/quality/80'
      break
  }
  return quality
})

/* 判断是否是oss图片，如果是才加压缩参数 */
const isOssImage = computed(() => {
  // const Reg = new RegExp(/^http:\/\/localhost:9000\/images+/)
  const Reg = new RegExp(/^https:\/\/oss.goffee.cn\/images+/)
  if (Reg.test(props.img)) {
    return true
  } else {
    return false
  }
})
</script>
<script lang="ts">
export default {
  name: 'CustomElImage'
}
</script>

<style lang="less" scoped>
.gray {
  border-color: white;
  height: 100%;
  width: 100%;
  min-height: inherit;
  .flexbox(column);
}

.el-image {
  width: 100%;
  height: 100%;
  min-height: inherit;

  :deep(.el-image__inner) {
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
}
</style>
