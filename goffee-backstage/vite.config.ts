import vue from '@vitejs/plugin-vue';

import { type UserConfig, type ConfigEnv, loadEnv, defineConfig } from 'vite';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import UnoCSS from 'unocss/vite';

import path from 'path';
const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        '@': pathSrc,
        // https://github.com/intlify/vue-i18n-next/issues/789
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行是否自动打开浏览器
      // 反向代理解决跨域
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'https://goffee.cn',
          changeOrigin: true,
          rewrite: path =>
            // localhost:3000/dev-api/users/me → http://vapi.youlai.tech/users/me
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    plugins: [
      vue(),
      UnoCSS({
        /* options */
      }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core'],
        eslintrc: {
          enabled: false, //  Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({})
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
        dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts') // (false) 配置文件生成位置，默认是根目录 /auto-imports.d.ts
      }),

      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'] //@iconify-json/ep 是 Element Plus 的图标库
          }),
          // 自动导入 Element Plus 组件
          ElementPlusResolver()
        ],
        dts: path.resolve(pathSrc, 'types', 'components.d.ts') // (false) 配置文件生成位置，默认是根目录 /components.d.ts
      }),

      Icons({
        // 自动安装图标库
        autoInstall: true
      }),

      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(pathSrc, 'assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'element-plus/es/components/form/style/style',
        'element-plus/es/components/form-item/style/style',
        'element-plus/es/components/button/style/style',
        'element-plus/es/components/input/style/style',
        'element-plus/es/components/input-number/style/style',
        'element-plus/es/components/switch/style/style',
        'element-plus/es/components/upload/style/style',
        'element-plus/es/components/menu/style/style',
        'element-plus/es/components/col/style/style',
        'element-plus/es/components/icon/style/style',
        'element-plus/es/components/row/style/style',
        'element-plus/es/components/tag/style/style',
        'element-plus/es/components/dialog/style/style',
        'element-plus/es/components/loading/style/style',
        'element-plus/es/components/radio/style/style',
        'element-plus/es/components/radio-group/style/style',
        'element-plus/es/components/popover/style/style',
        'element-plus/es/components/scrollbar/style/style',
        'element-plus/es/components/tooltip/style/style',
        'element-plus/es/components/dropdown/style/style',
        'element-plus/es/components/dropdown-menu/style/style',
        'element-plus/es/components/dropdown-item/style/style',
        'element-plus/es/components/sub-menu/style/style',
        'element-plus/es/components/menu-item/style/style',
        'element-plus/es/components/divider/style/style',
        'element-plus/es/components/card/style/style',
        'element-plus/es/components/link/style/style',
        'element-plus/es/components/breadcrumb/style/style',
        'element-plus/es/components/breadcrumb-item/style/style',
        'element-plus/es/components/table/style/style',
        'element-plus/es/components/tree-select/style/style',
        'element-plus/es/components/table-column/style/style',
        'element-plus/es/components/select/style/style',
        'element-plus/es/components/option/style/style',
        'element-plus/es/components/pagination/style/style',
        'element-plus/es/components/tree/style/style',
        'element-plus/es/components/alert/style/style',
        '@vueuse/core',

        'path-to-regexp',
        'echarts',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        'vue-i18n'
      ]
    }
  };
});
