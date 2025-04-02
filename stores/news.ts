import { defineStore } from 'pinia'
import axios from 'axios'
import { useApiError } from '~/composables/useApiError'
import { LRUCache } from '~/utils/lruCache'

interface Article {
  source: {
    id: string | null
    name: string
  }
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface CacheItem {
  articles: Article[]
  totalResults: number
}

interface NewsState {
  articles: Article[]
  loading: boolean
  error: string | null
  currentCategory: string
  searchQuery: string
  sortBy: 'relevancy' | 'popularity' | 'publishedAt'
  page: number
  hasMore: boolean
  isApiKeyError: boolean
  totalResults: number
  cache: LRUCache<string, CacheItem>
  categoryPages: Record<string, number>
  isLoadingMore: boolean
  currentPage: number
  isInitialLoad: boolean
  searchCache: Map<string, CacheItem>
}

const PAGE_SIZE = 10
const CACHE_SIZE = 100
const SEARCH_CACHE_SIZE = 50

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    articles: [],
    loading: false,
    error: null,
    currentCategory: 'general',
    searchQuery: '',
    sortBy: 'publishedAt',
    page: 1,
    hasMore: true,
    isApiKeyError: false,
    totalResults: 0,
    cache: new LRUCache<string, CacheItem>(CACHE_SIZE, 60000),
    categoryPages: {},
    isLoadingMore: false,
    currentPage: 1,
    isInitialLoad: true,
    searchCache: new Map<string, CacheItem>()
  }),

  actions: {
    getCacheKey(type: 'top' | 'search', params: any) {
      if (type === 'top') {
        return `top-${params.category}-${params.page}`
      }
      return `search-${params.query}-${params.sortBy}-${params.page}`
    },

    getSearchCacheKey(query: string, sortBy: string, page: number) {
      return `${query}-${sortBy}-${page}`
    },

    async initialize() {
      this.resetState()
      await this.fetchTopHeadlines('general')
    },

    async fetchTopHeadlines(category: string = 'general', isLoadMore: boolean = false) {
      const { handleError, error, isApiKeyError } = useApiError()
      
      // Get the current page for this category
      const currentPage = isLoadMore ? this.currentPage + 1 : 1
      const cacheKey = this.getCacheKey('top', { category, page: currentPage })

      try {
        if (isLoadMore) {
          this.isLoadingMore = true
        } else {
          this.loading = true
        }
        this.error = null
        this.isApiKeyError = false
        this.currentCategory = category

        // Check cache first
        const cachedData = this.cache.get(cacheKey)
        if (cachedData) {
          if (!isLoadMore) {
            this.articles = cachedData.articles
          } else {
            this.articles = [...this.articles, ...cachedData.articles]
          }
          this.totalResults = cachedData.totalResults
          this.hasMore = this.articles.length < cachedData.totalResults
          if (isLoadMore) {
            this.currentPage = currentPage
          }
          return
        }

        const response = await axios.get(`/api/top-headlines`, {
          params: {
            category,
            page: currentPage,
            pageSize: PAGE_SIZE
          }
        })

        const articles = response.data.articles
        const totalResults = response.data.totalResults || 0

        if (!isLoadMore) {
          this.articles = articles
        } else {
          this.articles = [...this.articles, ...articles]
        }

        this.totalResults = totalResults
        this.hasMore = this.articles.length < totalResults

        // Update cache
        this.cache.set(cacheKey, {
          articles,
          totalResults
        })

        // Update the current page
        if (isLoadMore) {
          this.currentPage = currentPage
        }
      } catch (e: any) {
        handleError(e)
        this.error = error.value
        this.isApiKeyError = isApiKeyError.value
      } finally {
        if (isLoadMore) {
          this.isLoadingMore = false
        } else {
          this.loading = false
        }
        this.isInitialLoad = false
      }
    },

    async loadMoreTopHeadlines(category: string) {
      if (!this.hasMore || this.isLoadingMore || this.loading || this.isInitialLoad) {
        console.log('Skipping load more:', { 
          hasMore: this.hasMore, 
          isLoadingMore: this.isLoadingMore, 
          loading: this.loading,
          isInitialLoad: this.isInitialLoad
        })
        return
      }
      console.log('Loading more headlines for category:', category, 'Current page:', this.currentPage)
      await this.fetchTopHeadlines(category, true)
    },

    async searchArticles(query: string, sortBy: 'relevancy' | 'popularity' | 'publishedAt', page: number = 1, isLoadMore: boolean = false) {
      if (!query.trim()) {
        console.log('Empty query, skipping search')
        return
      }

      const cacheKey = this.getSearchCacheKey(query, sortBy, page)
      console.log('Search cache key:', cacheKey)

      const { handleError, error, isApiKeyError } = useApiError()

      try {
        if (!isLoadMore) {
          this.loading = true
        } else {
          this.isLoadingMore = true
        }
        this.error = null
        this.isApiKeyError = false
        this.searchQuery = query
        this.sortBy = sortBy

        // Check search cache first
        const cachedData = this.searchCache.get(cacheKey)
        if (cachedData) {
          console.log('Using cached search results for:', cacheKey)
          if (!isLoadMore) {
            this.articles = cachedData.articles
          } else {
            this.articles = [...this.articles, ...cachedData.articles]
          }
          this.totalResults = cachedData.totalResults
          this.hasMore = this.articles.length < cachedData.totalResults
          this.currentPage = page
          return
        }

        console.log('Fetching fresh search results for:', cacheKey)
        const response = await axios.get(`/api/everything`, {
          params: {
            q: query,
            sortBy,
            page,
            pageSize: PAGE_SIZE
          }
        })

        const articles = response.data.articles
        const totalResults = response.data.totalResults || 0

        if (!isLoadMore) {
          this.articles = articles
        } else {
          this.articles = [...this.articles, ...articles]
        }

        this.totalResults = totalResults
        this.hasMore = this.articles.length < totalResults
        this.currentPage = page

        // Update search cache
        this.searchCache.set(cacheKey, {
          articles,
          totalResults
        })

        // Limit search cache size
        if (this.searchCache.size > SEARCH_CACHE_SIZE) {
          const firstKey = this.searchCache.keys().next().value
          if (firstKey) {
            this.searchCache.delete(firstKey)
          }
        }
      } catch (e: any) {
        handleError(e)
        this.error = error.value
        this.isApiKeyError = isApiKeyError.value
        console.error('Error searching articles:', e)
      } finally {
        if (isLoadMore) {
          this.isLoadingMore = false
        } else {
          this.loading = false
        }
        this.isInitialLoad = false
      }
    },

    async loadMoreSearchResults(query: string, sortBy: 'relevancy' | 'popularity' | 'publishedAt') {
      if (!this.hasMore || this.isLoadingMore || this.loading || this.isInitialLoad) {
        console.log('Skipping load more search:', {
          hasMore: this.hasMore,
          isLoadingMore: this.isLoadingMore,
          loading: this.loading,
          isInitialLoad: this.isInitialLoad
        })
        return
      }
      console.log('Loading more search results for query:', query)
      
      const nextPage = this.currentPage + 1
      await this.searchArticles(query, sortBy, nextPage, true)
    },

    resetState() {
      this.articles = []
      this.loading = false
      this.error = null
      this.isApiKeyError = false
      this.page = 1
      this.hasMore = true
      this.currentCategory = 'general'
      this.searchQuery = ''
      this.sortBy = 'publishedAt'
      this.totalResults = 0
      this.isLoadingMore = false
      this.categoryPages = {}
      this.currentPage = 1
      this.isInitialLoad = true
      this.searchCache.clear()
    }
  }
}) 