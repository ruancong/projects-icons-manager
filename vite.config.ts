import path from 'node:path'
import Vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-vue-markdown'


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
        api: 'modern-compiler',
      },
    },
  },

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),

    Markdown({
      // markdown-it options
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      // 将 markdown 转换为 vue 组件
      transforms: {
        before: (code) => {
          return code
        }
      },
      wrapperClasses: 'markdown-body'
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/typed-router.d.ts',
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),

    vueDevTools(),
  ]
 
})
