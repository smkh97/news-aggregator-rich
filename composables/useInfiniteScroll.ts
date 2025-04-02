import { ref, onMounted, onUnmounted, watch } from 'vue'

interface InfiniteScrollOptions {
  rootMargin?: string
  threshold?: number
  immediate?: boolean
  onError?: (error: Error) => void
}

export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  options: InfiniteScrollOptions = {}
) => {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    immediate = false,
    onError
  } = options

  const target = ref<HTMLElement | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const observer = ref<IntersectionObserver | null>(null)
  const isInitialLoad = ref(true)
  const lastTriggerTime = ref(0)
  const DEBOUNCE_TIME = 1000 // 1 second debounce

  const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    const now = Date.now()
    
    // Debounce to prevent multiple rapid triggers
    if (entry.isIntersecting && !isLoading.value && !error.value && (now - lastTriggerTime.value > DEBOUNCE_TIME)) {
      lastTriggerTime.value = now
      isLoading.value = true
      error.value = null
      try {
        await loadMore()
      } catch (e) {
        error.value = e as Error
        onError?.(e as Error)
      } finally {
        isLoading.value = false
      }
    }
  }

  const setupObserver = () => {
    if (observer.value) {
      observer.value.disconnect()
    }

    observer.value = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold
    })

    if (target.value) {
      observer.value.observe(target.value)
    }
  }

  // Watch for target changes
  watch(() => target.value, (newTarget) => {
    if (newTarget) {
      setupObserver()
    }
  }, { immediate: true })

  const loadInitial = async () => {
    if (immediate && isInitialLoad.value) {
      isInitialLoad.value = false
      isLoading.value = true
      error.value = null
      try {
        await loadMore()
      } catch (e) {
        error.value = e as Error
        onError?.(e as Error)
      } finally {
        isLoading.value = false
      }
    }
  }

  onMounted(async () => {
    setupObserver()
    await loadInitial()
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  return {
    target,
    isLoading,
    error,
    isInitialLoad
  }
} 