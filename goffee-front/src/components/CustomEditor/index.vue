<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useUserStore } from '@/stores/user'
import { useEditorStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { uploadImage } from '@/api/file'
import { ElMessage } from 'element-plus'
import { getItem } from '@/utils/storage'
import { queryTinymceCodeLanguage } from '@/api/blog'

const props = withDefaults(
  defineProps<{
    defaultEditor?: string
  }>(),
  {
    defaultEditor: 'tinymce'
  }
)

const userStore = useUserStore()
const editorStore = useEditorStore()
const { userInfo } = storeToRefs(userStore)
const { content, contentRich, text, editorName, editorTheme, richImg, mdImg } =
  storeToRefs(editorStore)

const changeEditorName = () => {
  editorName.value = editorName.value === 'tinymce' ? 'markdown' : 'tinymce'
}

/* 高亮的编程语言列表 */
const tinymceCodeLanguageList = ref<Array<TinymceCodeLanguage>>([])
const getHighLightLanguage = async () => {
  const result = await queryTinymceCodeLanguage()
  if (result) {
    result.data.forEach((item) => {
      let tinymceCodeLanguag: TinymceCodeLanguage = {
        text: '',
        value: ''
      }
      Object.assign(tinymceCodeLanguag, item)
      tinymceCodeLanguageList.value.push(tinymceCodeLanguag)
    })
  }
}

// tinymce编辑器
const editorInit = {
  language_url: '/tinymce/langs/zh-Hans.js', // pro
  // language_url: '/public/tinymce/langs/zh-Hans.js', // dev
  language: 'zh-Hans',
  skin_url: '/tinymce/skins/ui/tinymce-5-dark',
  content_css: '/tinymce/skins/content/tinymce-5-dark/content.min.css',
  height: 500,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'code',
    'preview',
    'anchor',
    'searchreplace',
    'fullscreen',
    'visualblocks',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
    'codesample',
    'save',
    'importcss',
    'textpattern'
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor blockquote | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | codesample code | help',
  /* 排版 */
  text_patterns: [
    {start: '---', replacement: '<hr/>'},
    {start: '>', format: 'blockquote'},
    {start: '`', end: '`', format: 'code'}
  ],
  codesample_global_prismjs: true,
  codesample_languages: tinymceCodeLanguageList.value,
  images_upload_handler: async (blobInfo: { blob: () => string | Blob }) => {
    const needUploadImage: UploadFileType = {
      file: blobInfo.blob(),
      bucketName: 'images',
      userId: userInfo.value.userId
    }
    let result = await uploadImage(needUploadImage)
    if (result) {
      const { url } = result.data
      ElMessage.success('上传成功')
      // 收集图片信息
      richImg.value.push(url)
      return Promise.resolve(url)
    } else {
      ElMessage.error('上传失败')
      return Promise.reject('上传失败')
    }
  },
  save_onsavecallback: () => {
    editorStore.useSave()
  }
}

/* md编辑器文本转html */
const saveHtml = (val: string) => {
  content.value = val
}
/* markdown图片上传逻辑 */
const onUploadImg = async (files: FileList, callback: (urls: string[]) => void) => {
  const result = await Promise.all(
    Array.from(files).map(async (file) => {
      const needUploadImage: UploadFileType = {
        file,
        bucketName: 'images',
        userId: userInfo.value.userId
      }
      let result = await uploadImage(needUploadImage)
      if (result) {
        const { url } = result.data
        ElMessage.success('上传成功')
        // 收集图片信息
        mdImg.value.push(url)
        return Promise.resolve(url)
      } else {
        ElMessage.error('上传失败')
        return Promise.reject('上传失败')
      }
    })
  )
  callback(result)
}

/* 修改md编辑器主题 */
onMounted(() => {
  editorTheme.value = localStorage.getItem('vueuse-color-scheme') === 'dark' ? 'dark' : 'light'
  getHighLightLanguage()
})

/* 读取临时保存的编辑信息 */
onBeforeMount(() => {
  contentRich.value = ''
  text.value = ''
  const result = getItem('tmpContent')
  if (result) {
    if (result.rich) {
      contentRich.value = result.rich
    }
    if (result.markdown) {
      text.value = result.markdown
    }
    if (result.richImg) {
      richImg.value = result.richImg
    }
    if (result.mdImg) {
      mdImg.value = result.mdImg
    }
  }
})
</script>
<script lang="ts">
export default {
  name: 'CustomEditor'
}
</script>

<template>
  <div class="editor-container">
    <div class="switch-btn">
      <p class="text" @click="changeEditorName">
        切换到{{ editorName === 'tinymce' ? 'markdown' : '富文本' }}编辑器
      </p>
    </div>
    <div v-show="editorName === 'tinymce'" style="height: 500px">
      <Editor
        :init="editorInit"
        v-model="contentRich"
        tinymce-script-src="/tinymce/tinymce.min.js"
      />
    </div>
    <div v-show="editorName !== 'tinymce'" id="markdown">
      <MdEditor
        v-model="text"
        :theme="editorTheme === 'dark' ? 'dark' : 'light'"
        @onUploadImg="onUploadImg"
        @onHtmlChanged="saveHtml"
        preview-theme="github"
        @onSave="editorStore.useSave()"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.editor-container {
  display: flex;
  flex-direction: column;

  .switch-btn {
    display: flex;
    .font-normal();

    .text {
      display: flexbox;
      padding: 10px 15px 5px 15px;
      .cursor-pointer();
      .flexbox();
      background-color: rgb(160, 160, 160);
      border-radius: 20px 20px 0 0;
    }
  }
}
</style>
