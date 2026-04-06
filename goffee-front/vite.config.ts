import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { type UserConfig, type ConfigEnv, loadEnv, defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// element-plus 按需引入-自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// prismjs
import { prismjsPlugin } from 'vite-plugin-prismjs'

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
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: true,
        dirs: ['src/components'],
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()]
      }),
      prismjsPlugin({
        languages: 'all',
        plugins: ['show-language', 'line-numbers', 'copy-to-clipboard'], // 显示语言
        theme: 'okaidia', // 主题名称,
        css: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // style
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
          target: 'https://goffee.cn',
          // target: 'http://localhost:15801',
          changeOrigin: true
        }
      }
    },
    optimizeDeps: {
      include: [
        '@element-plus/icons-vue',
        '@tinymce/tinymce-vue',
        '@vue/runtime-core',
        '@vueuse/components',
        '@vueuse/core',
        '@vueuse/head',
        'axios',
        'element-plus',
        'element-plus/es',
        'element-plus/es/components/alert/style/style',
        'element-plus/es/components/autocomplete/style/style',
        'element-plus/es/components/button-group/style/style',
        'element-plus/es/components/button/style/style',
        'element-plus/es/components/card/style/style',
        'element-plus/es/components/carousel-item/style/style',
        'element-plus/es/components/checkbox/style/style',
        'element-plus/es/components/col/style/style',
        'element-plus/es/components/color-picker/style/style',
        'element-plus/es/components/date-picker/style/style',
        'element-plus/es/components/descriptions-item/style/style',
        'element-plus/es/components/descriptions/style/style',
        'element-plus/es/components/dialog/style/style',
        'element-plus/es/components/divider/style/style',
        'element-plus/es/components/dropdown-item/style/style',
        'element-plus/es/components/dropdown-menu/style/style',
        'element-plus/es/components/dropdown/style/style',
        'element-plus/es/components/empty/style/style',
        'element-plus/es/components/form-item/style/style',
        'element-plus/es/components/form/style/style',
        'element-plus/es/components/header/style/style',
        'element-plus/es/components/icon/style/style',
        'element-plus/es/components/image-viewer/style/style',
        'element-plus/es/components/image/style/style',
        'element-plus/es/components/input-number/style/style',
        'element-plus/es/components/input/style/style',
        'element-plus/es/components/loading/style/style',
        'element-plus/es/components/message-box/style/style',
        'element-plus/es/components/message/style/style',
        'element-plus/es/components/option/style/style',
        'element-plus/es/components/page-header/style/style',
        'element-plus/es/components/pagination/style/style',
        'element-plus/es/components/popover/style/style',
        'element-plus/es/components/progress/style/style',
        'element-plus/es/components/radio-group/style/style',
        'element-plus/es/components/radio/style/style',
        'element-plus/es/components/rate/style/style',
        'element-plus/es/components/row/style/style',
        'element-plus/es/components/scrollbar/style/style',
        'element-plus/es/components/select/style/style',
        'element-plus/es/components/skeleton-item/style/style',
        'element-plus/es/components/skeleton/style/style',
        'element-plus/es/components/slider/style/style',
        'element-plus/es/components/switch/style/style',
        'element-plus/es/components/tab-pane/style/style',
        'element-plus/es/components/table-column/style/style',
        'element-plus/es/components/table/style/style',
        'element-plus/es/components/tabs/style/style',
        'element-plus/es/components/tag/style/style',
        'element-plus/es/components/timeline-item/style/style',
        'element-plus/es/components/timeline/style/style',
        'element-plus/es/components/upload/style/style',
        'element-plus/dist/locale/zh-cn.mjs',
        'gsap',
        'gsap/CustomEase',
        'prismjs',
        'lodash',
        'md-editor-v3',
        'nprogress',
        'pinia'
      ]
    }
  }
})
