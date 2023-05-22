<template>
  <el-tag
    class="tag"
    type="success"
    :closable="closable"
    @close="closeTag"
    @click.stop.prevent="toArticles"
    >{{ tagName }}</el-tag
  >
</template>

<script setup lang="ts">
const router = useRouter()
const emit = defineEmits(['closeTag'])
const props = withDefaults(
  defineProps<{
    tagId: number
    tagName: string
    closable?: boolean
    isClick?: boolean
  }>(),
  {
    closable: () => false,
    isClick: () => true
  }
)

const toArticles = () => {
  if (props.isClick) {
    router.push(`/articles?tagId=${props.tagId}&tagName=${props.tagName}`)
  }
}

const closeTag = () => {
  emit('closeTag', props.tagId)
}
</script>
<script lang="ts">
export default {
  name: 'TagItem'
}
</script>

<style lang="less" scoped>
.tag {
  margin-left: 5px;
  margin-top: 5px;
  .cursor-pointer();
}
</style>
