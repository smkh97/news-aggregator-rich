import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from '~/stores/ui'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useUIStore', () => {
  let store: ReturnType<typeof useUIStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useUIStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

   it('should set loading state', () => {
    store.setLoading(true)
    expect(store.isLoading).toBe(true)

    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('should set search query', () => {
    store.setSearchQuery('test query')
    expect(store.searchQuery).toBe('test query')
  })

  it('should increment page', () => {
    expect(store.currentPage).toBe(1)
    store.incrementPage()
    expect(store.currentPage).toBe(2)
  })

  it('should reset page', () => {
    store.currentPage = 5
    store.resetPage()
    expect(store.currentPage).toBe(1)
  })

  it('should set has more', () => {
    store.setHasMore(false)
    expect(store.hasMore).toBe(false)

    store.setHasMore(true)
    expect(store.hasMore).toBe(true)
  })
  
}) 