// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-icon',
    '@nuxt/image'
  ],
  app: {
    head: {
      title: 'News Aggregator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern news aggregator built with Nuxt 3' }
      ]
    }
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage'
  },
  build: {
    transpile: ['@vueuse/core']
  },
  runtimeConfig: {
    public: {
      newsApiKey: process.env.NUXT_PUBLIC_NEWS_API_KEY
    }
  },  
})