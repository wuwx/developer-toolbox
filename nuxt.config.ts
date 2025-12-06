// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],

  // Nuxt UI 4 的图标配置
  icon: {
    clientBundle: {
      scan: true
    }
  },

  // 部署配置
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      // 解决怪异模式问题
      htmlAttrs: {
        lang: 'zh-CN'
      },
      link: [
        // favicon 配置 - 使用相对路径适配 GitHub Pages
        { rel: 'icon', type: 'image/x-icon', href: (process.env.NUXT_APP_BASE_URL || '/') + 'favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: (process.env.NUXT_APP_BASE_URL || '/') + 'favicon.ico' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // 基本的安全配置，允许必要的资源
        { name: 'referrer', content: 'no-referrer-when-downgrade' }
      ]
    }
  },

  nitro: {
    preset: 'github_pages'
  }
})