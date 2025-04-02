import { defineStore } from 'pinia'

interface LoadingState {
  isLoading: boolean
  loadingCount: number
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    isLoading: false,
    loadingCount: 0
  }),
  
  actions: {
    startLoading() {
      this.loadingCount++
      this.isLoading = true
    },
    
    stopLoading() {
      this.loadingCount--
      if (this.loadingCount <= 0) {
        this.loadingCount = 0
        this.isLoading = false
      }
    }
  }
}) 