import { ref } from 'vue'

export const useApiError = () => {
  const error = ref<string | null>(null)
  const isApiKeyError = ref(false)

  const handleError = (e: any) => {
    if (e.response?.status === 401) {
      error.value = 'Invalid API key. Please check your NewsAPI key configuration.'
      isApiKeyError.value = true
    } else if (e.response?.status === 429) {
      error.value = 'You have exceeded your API request limit. Result shown are cached'
      isApiKeyError.value = true
    } else {
      error.value = e.response?.data?.message || 'An error occurred while fetching data.'
      isApiKeyError.value = false
    }
  }

  const clearError = () => {
    error.value = null
    isApiKeyError.value = false
  }

  return {
    error,
    isApiKeyError,
    handleError,
    clearError
  }
} 