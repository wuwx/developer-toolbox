// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
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
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },

  nitro: {
    preset: 'github_pages'
  }
})