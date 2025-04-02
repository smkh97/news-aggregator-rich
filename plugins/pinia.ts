import { createPinia } from 'pinia'

export default defineNuxtPlugin(({ $pinia }) => {
  if (!$pinia) {
    const pinia = createPinia()
    return {
      provide: {
        pinia
      }
    }
  }
}) 