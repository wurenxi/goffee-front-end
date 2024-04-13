import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { type UserConfig, type ConfigEnv, loadEnv, defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// element-plus 按需引入-自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// prismjs
import prismjs from 'vite-plugin-prismjs'

function resolvePath(path: string) {
  return resolve(__dirname, path)
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        dts: true,
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        dts: true,
        dirs: ['src/components'],
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()]
      }),
      prismjs({
        languages: 'all',
        plugins: ['show-language','line-numbers', 'copy-to-clipboard'], // 显示语言
        theme: 'okaidia', // 主题名称,
        css: true,
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // css
    css: {
      preprocessorOptions: {
        less: {
          charset: false,
          javascriptEnabled: true,
          // 这样就能全局使用 src/assets/styles/mixins.less 定义的 变量
          additionalData: `@import "${resolvePath('src/assets/styles/mixins.less')}";`
        }
      },
      postcss: {
        plugins: [require('autoprefixer'), require('tailwindcss')]
      }
    },
    server: {
      proxy: {
        '/api': {
          // target: 'https://goffee.cn',
          target: 'http://localhost:15801',
          changeOrigin: true,
        }
      }
    },
    optimizeDeps: {
      include: [
        "@element-plus/icons-vue",
        "@tinymce/tinymce-vue",
        "@vue/runtime-core",
        "@vueuse/components",
        "@vueuse/core",
        "@vueuse/head",
        "axios",
        "element-plus",
        "element-plus/es",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/autocomplete/style/css",
        "element-plus/es/components/button-group/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/carousel-item/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/color-picker/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/descriptions-item/style/css",
        "element-plus/es/components/descriptions/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/empty/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/header/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/image-viewer/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/message-box/style/css",
        "element-plus/es/components/message/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/page-header/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/progress/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/skeleton-item/style/css",
        "element-plus/es/components/skeleton/style/css",
        "element-plus/es/components/slider/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/timeline-item/style/css",
        "element-plus/es/components/timeline/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/dist/locale/zh-cn.mjs",
        "gsap",
        "gsap/CustomEase",
        "prismjs",
        "lodash",
        "md-editor-v3",
        "nprogress",
        "pinia",
      ]
    }
  }
})
