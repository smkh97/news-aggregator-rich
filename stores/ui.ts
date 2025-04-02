import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    searchQuery: '',
    currentPage: 1,
    hasMore: true
  }),

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    incrementPage() {
      this.currentPage++
    },

    resetPage() {
      this.currentPage = 1
    },

    setHasMore(value: boolean) {
      this.hasMore = value
    }
  }
}) 