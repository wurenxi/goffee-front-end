import { addArticleTag, getAllArticleTags } from '@/api/blog'
import { ElMessage } from 'element-plus'

export const useTag = () => {
  // 选择tag
  const tags = ref<ArticleTags[]>([])
  const options = ref<ArticleTags[]>([])
  const getTag = async () => {
    const result = await getAllArticleTags()
    if (result) {
      options.value = result.data
    } else {
      console.log('获取标签失败')
    }
  }
  const addTagFn = async (val: string) => {
    // 接口 调用 添加tag
    const result = await addArticleTag({ tagName: val })
    if (result) {
      ElMessage.success('添加标签成功')
      getTag()
    } else {
      ElMessage.error('添加标签失败')
    }
  }
  // 计算属性  移除已选择标签
  const canChooseTags = computed(() => {
    return options.value.filter((item) => {
      let flag = true
      tags.value.forEach((tag) => {
        if (tag.id === item.id) flag = false
      })
      return flag
    })
  })
  onMounted(() => {
    getTag()
  })
  return {
    tags,
    options,
    getTag,
    addTagFn,
    canChooseTags
  }
}
