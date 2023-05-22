import { setItem } from '@/utils/storage'
import { ElMessage, ElNotification } from 'element-plus'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  /* 编辑器主题色 */
  const editorTheme = ref('light')

  /* 收集图片信息，减少冗余图片的产生 */
  const richImg = ref<Array<string>>([])
  const mdImg = ref<Array<string>>([])

  /* 判断当前是用什么的编辑器，提交时判断提交哪个编辑器的内容 */
  const editorName = ref('tinymce')
  const changeEditor = (editor: string) => {
    editorName.value = editor
  }
  /* 两种编辑器存放内容 */
  // markdown绑定对象(html与text)
  const content = ref<string>('')
  const text = ref<string>('')
  // 富文本编辑器绑定对象
  const contentRich = ref<string>('')
  const saveTemp = ref<number>()
  /* 手动将内容临时保存到localStorage中 */
  const route = useRoute()
  const useSave = () => {
    const save = () => {
      if (content || contentRich) {
        setItem('tmpContent', {
          rich: contentRich.value,
          markdown: text.value,
          richImg: richImg.value,
          mdImg: mdImg.value
        })
      }
      ElNotification({ title: '保存成功', message: '已保存到本地存储', type: 'success' })
    }
    if (route.name === 'UpdateArticle') {
      ElMessage.warning('修改文章是不提供临时保存功能，防止混乱，请及时上传')
      return
    }
    save()
  }

  return {
    content,
    contentRich,
    saveTemp,
    editorName,
    text,
    editorTheme,
    richImg,
    mdImg,
    useSave,
    changeEditor
  }
})
