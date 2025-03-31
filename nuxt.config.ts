// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxtjs/device"],
  css: ["~/assets/css/main.css"],
  ssr: false, // Set to false for client-side only rendering (SPA)
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseHostingUrl: process.env.FIREBASE_HOSTING_URL,
    },
  },
  app: {
    head: {
      title: "Dopamine Todo List",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "A todo list app with drag and drop functionality",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  nitro: {
    preset: "static",
    output: {
      dir: "dist",
    },
  },
});
