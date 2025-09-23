import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/starter-pack/': '/',
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        {
          '@/app/utils/classes': ['getClasses'],
          '@/app/utils': ['getImageUrl']
        },
      ],
      dts: './auto-imports.d.ts',
      vueTemplate: true
    }),
    Components({
      dirs: ['src/**/components'],
      extensions: ['vue'],
      deep: true,
      dts: './components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        IconsResolver({
          // prefix: false,
        }),
        PrimeVueResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      png: {
        quality: 90,
      },
      jpeg: {
        quality: 90,
      },
      jpg: {
        quality: 90,
      },
      webp: {
        lossless: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/app/styles/mixins.scss" as *;`,
      },
    },
  },
})
