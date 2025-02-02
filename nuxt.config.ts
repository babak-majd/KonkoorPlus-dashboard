// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "konkourplus-dashboard",
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  css: [
    "@/assets/Fonts/YekanWebFonts/css/fontiran.css",
    "@/assets/css/main.css",
  ],
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      DEV_ENV: Boolean(process.env.DEV_ENV === "true"),
      APP_LOCALE: process.env.APP_LOCALE,
      APP_FALLBACK_LOCALE: process.env.APP_FALLBACK_LOCALE,
      API_URL: process.env.API_URL,
    },
  },
})
