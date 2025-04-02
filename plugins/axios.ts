import axios from 'axios'
import { useLoadingStore } from '~/stores/loading'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const loadingStore = useLoadingStore()

  const axiosInstance = axios.create({
    baseURL: 'https://newsapi.org/v2',
    headers: {
      'X-Api-Key': config.public.newsApiKey
    }
  })

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      loadingStore.startLoading()
      return config
    },
    (error) => {
      loadingStore.stopLoading()
      return Promise.reject(error)
    }
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      loadingStore.stopLoading()
      return response
    },
    (error) => {
      loadingStore.stopLoading()
      if (error.response) {
        // Handle specific error cases
        switch (error.response.status) {
          case 401:
            console.error('API key is invalid or missing')
            break
          case 429:
            console.error('Too many requests')
            break
          default:
            console.error('An error occurred:', error.response.data)
        }
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error setting up request:', error.message)
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: axiosInstance
    }
  }
}) 