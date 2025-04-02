import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNewsStore } from '~/stores/news'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> & ((url: string) => Promise<AxiosResponse>) }

vi.mocked(axios).get = mockedAxios.get

describe('useNewsStore', () => {
  let store: ReturnType<typeof useNewsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useNewsStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const mockArticles = [
    {
      source: { id: '1', name: 'Test Source' },
      title: 'Test Article',
      description: 'Test Description',
      url: 'https://test.com',
      urlToImage: 'https://test.com/image.jpg',
      publishedAt: '2024-02-20T12:00:00Z',
      content: 'Test Content'
    }
  ]

  const mockResponse = {
    data: {
      articles: mockArticles,
      totalResults: 1,
      status: 'ok'
    }
  }

  it('should initialize with default state', () => {
    expect(store.articles).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.currentCategory).toBe('general')
    expect(store.searchQuery).toBe('')
    expect(store.sortBy).toBe('publishedAt')
    expect(store.page).toBe(1)
    expect(store.hasMore).toBe(true)
    expect(store.isApiKeyError).toBe(false)
    expect(store.totalResults).toBe(0)
    expect(store.isLoadingMore).toBe(false)
    expect(store.currentPage).toBe(1)
    expect(store.isInitialLoad).toBe(true)
  })

  it('should generate correct cache keys', () => {
    expect(store.getCacheKey('top', { category: 'business', page: 1 }))
      .toBe('top-business-1')
    expect(store.getCacheKey('search', { query: 'test', sortBy: 'relevancy', page: 1 }))
      .toBe('search-test-relevancy-1')
  })

  it('should generate correct search cache keys', () => {
    expect(store.getSearchCacheKey('test', 'relevancy', 1))
      .toBe('test-relevancy-1')
  })

  it('should fetch top headlines successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)
    await store.fetchTopHeadlines('business')
    expect(store.articles).toEqual(mockArticles)
    expect(store.totalResults).toBe(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle API errors when fetching top headlines', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'))
    await store.fetchTopHeadlines('business')
    expect(store.error).toBe('An error occurred while fetching data.')
    expect(store.loading).toBe(false)
  })

  it('should handle API key errors', async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 401, data: { message: 'Invalid API key' } } })
    await store.fetchTopHeadlines('business')
    expect(store.isApiKeyError).toBe(true)
    expect(store.error).toBe('Invalid API key. Please check your NewsAPI key configuration.')
  })

  it('should load more top headlines', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)
    await store.fetchTopHeadlines('business', true)
    expect(store.isLoadingMore).toBe(false)
    expect(store.currentPage).toBe(2)
  })

  it('should search articles successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)
    await store.searchArticles('test', 'relevancy')
    expect(store.articles).toEqual(mockArticles)
    expect(store.totalResults).toBe(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should load more search results', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)
    await store.searchArticles('test', 'relevancy', 2)
    expect(store.isLoadingMore).toBe(false)
    expect(store.currentPage).toBe(2)
  })

  it('should handle search errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Search Error'))
    await store.searchArticles('test', 'relevancy')
    expect(store.error).toBe('An error occurred while fetching data.')
    expect(store.loading).toBe(false)
  })

  it('should update sort by', () => {
    store.sortBy = 'popularity'
    expect(store.sortBy).toBe('popularity')
  })

  it('should reset state', () => {
    store.articles = mockArticles
    store.loading = true
    store.error = 'Test Error'
    store.currentPage = 2
    store.isLoadingMore = true
    store.resetState()
    expect(store.articles).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.currentPage).toBe(1)
    expect(store.isLoadingMore).toBe(false)
  })

  it('should handle cache hits', async () => {
    const cacheKey = store.getCacheKey('top', { category: 'business', page: 1 })
    store.cache.set(cacheKey, { articles: mockArticles, totalResults: 1 })
    await store.fetchTopHeadlines('business')
    expect(mockedAxios.get).not.toHaveBeenCalled()
    expect(store.articles).toEqual(mockArticles)
  })

  it('should handle search cache hits', async () => {
    const cacheKey = store.getSearchCacheKey('test', 'relevancy', 1)
    store.searchCache.set(cacheKey, { articles: mockArticles, totalResults: 1 })
    await store.searchArticles('test', 'relevancy')
    expect(mockedAxios.get).not.toHaveBeenCalled()
    expect(store.articles).toEqual(mockArticles)
  })

  it('should handle empty search results', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { articles: [], totalResults: 0, status: 'ok' } })
    await store.searchArticles('nonexistent', 'relevancy')
    expect(store.articles).toEqual([])
    expect(store.totalResults).toBe(0)
    expect(store.hasMore).toBe(false)
  })
}) 