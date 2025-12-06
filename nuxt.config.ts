// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  
  // 生产环境禁用 devtools，避免第三方资源加载
  devtools: { 
    enabled: process.env.NODE_ENV !== 'production'
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],

  // Nuxt UI 4 的图标配置
  icon: {
    clientBundle: {
      scan: true,
      // 预加载常用图标，减少外部请求
      sizeLimitKb: 512
    }
  },

  // 部署配置
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      // 强制标准模式，解决怪异模式问题
      htmlAttrs: {
        lang: 'zh-CN'
      },
      // 强制添加 DOCTYPE
      title: '开发者工具箱',
      titleTemplate: '%s | 开发者工具箱',
      link: [
        // favicon 配置
        { rel: 'icon', type: 'image/x-icon', href: (process.env.NUXT_APP_BASE_URL || '/') + 'favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: (process.env.NUXT_APP_BASE_URL || '/') + 'favicon.ico' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        // 暂时移除 CSP，先确保功能正常，后续可根据需要重新添加
        // 保留基本安全配置
        // 阻止第三方嵌入
        { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
        // 阻止 MIME 类型嗅探
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        // 阻止引用来源泄露
        { name: 'referrer', content: 'strict-origin-when-cross-origin' }
      ]
    }
  },

  nitro: {
    preset: 'github_pages',
    // 禁用可能引入第三方资源的功能
    experimental: {
      wasm: false
    }
  },

  // 生产环境优化
  build: {
    analyze: false
  },

  // 禁用遥测
  telemetry: {
    enabled: false
  }
})