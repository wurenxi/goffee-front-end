import { createApp } from 'vue'
import { createPinia } from 'pinia'
// pinia持久化
import piniaPluginPersist from 'pinia-plugin-persist'
import APP from './App.vue'
import router from './router'
// tailwind 样式
import '@/assets/styles/tailwind/preflight.css'
import '@/assets/styles/tailwind/index.css'
// element-plus css
import 'element-plus/dist/index.css'
// iconfont
import '@/assets/fonts/iconfont.js'
// mitt
import mitt from 'mitt'
// dark-mode
import '@/assets/styles/theme/theme.less'
// 代码高亮
import 'prismjs'
// animate.css
import 'animate.css'
// useHead
import { createHead } from '@vueuse/head'
// v-lazy
import VueLazyLoad from 'vue-lazyload'

const head = createHead()

const app = createApp(APP)
// 挂载全局API
const Mit = mitt()
app.config.globalProperties.$Bus = Mit

app.use(createPinia().use(piniaPluginPersist))
app.use(router).use(head).use(VueLazyLoad)

app.mount('#app')
