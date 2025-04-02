import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { nextTick } from "vue"
import { useInfiniteScroll } from "~/composables/useInfiniteScroll"
import { mockIntersectionObserver } from "../utils/test-utils"
import { createApp, defineComponent } from "vue"

describe("useInfiniteScroll", () => {
  let loadMoreMock: any
  let mockObserver: any
  let observerCallback: IntersectionObserverCallback
  let app: any
  let infiniteScroll: ReturnType<typeof useInfiniteScroll>

  beforeEach(() => {
    loadMoreMock = vi.fn().mockResolvedValue(undefined)
    mockObserver = mockIntersectionObserver()

    // Capture the callback passed to IntersectionObserver
    mockObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    vi.useFakeTimers()

    // Create a Vue app instance to properly handle lifecycle hooks
    app = createApp(defineComponent({
      setup() {
        infiniteScroll = useInfiniteScroll(loadMoreMock)
        return {}
      }
    }))
    app.mount(document.createElement("div"))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    app.unmount()
  })

  it("should initialize with correct default values", () => {
    expect(infiniteScroll.isLoading.value).toBe(false)
    expect(infiniteScroll.error.value).toBeNull()
    expect(infiniteScroll.isInitialLoad.value).toBe(true)
  })

  it("should call loadMore when target is intersecting", async () => {
    // Set a ref value to trigger the watcher
    infiniteScroll.target.value = document.createElement("div")
    await nextTick()

    // Simulate intersection
    observerCallback([{ isIntersecting: true }])
    await nextTick()

    expect(loadMoreMock).toHaveBeenCalledTimes(1)
  })

  it("should not call loadMore when already loading", async () => {
    infiniteScroll.target.value = document.createElement("div")
    await nextTick()

    // Simulate intersection
    observerCallback([{ isIntersecting: true }])
    await nextTick()

    // Try to trigger again before the first call completes
    observerCallback([{ isIntersecting: true }])
    await nextTick()

    expect(loadMoreMock).toHaveBeenCalledTimes(1)
  })

  it("should handle errors in loadMore", async () => {
    const testError = new Error("Test error")
    const errorHandler = vi.fn()
    const failingLoadMore = vi.fn().mockRejectedValue(testError)

    // Create a new app instance with error handler
    app.unmount()
    app = createApp(defineComponent({
      setup() {
        infiniteScroll = useInfiniteScroll(failingLoadMore, { onError: errorHandler })
        return {}
      }
    }))
    app.mount(document.createElement("div"))

    infiniteScroll.target.value = document.createElement("div")
    await nextTick()

    // Simulate intersection
    observerCallback([{ isIntersecting: true }])
    await nextTick()
    await vi.runAllTimersAsync()

    expect(failingLoadMore).toHaveBeenCalledTimes(1)
    expect(infiniteScroll.error.value).toBe(testError)
    expect(errorHandler).toHaveBeenCalledWith(testError)
  })

  it("should load immediately when immediate option is true", async () => {
    // Create a new app instance with immediate option
    app.unmount()
    app = createApp(defineComponent({
      setup() {
        infiniteScroll = useInfiniteScroll(loadMoreMock, { immediate: true })
        return {}
      }
    }))
    app.mount(document.createElement("div"))

    await nextTick()
    await vi.runAllTimersAsync()

    expect(loadMoreMock).toHaveBeenCalledTimes(1)
    expect(infiniteScroll.isInitialLoad.value).toBe(false)
  })

  it("should debounce multiple rapid triggers", async () => {
    infiniteScroll.target.value = document.createElement("div")
    await nextTick()

    // First trigger
    observerCallback([{ isIntersecting: true }])
    await nextTick()
    expect(loadMoreMock).toHaveBeenCalledTimes(1)

    // Wait for less than debounce time
    await vi.advanceTimersByTime(500)
    observerCallback([{ isIntersecting: true }])
    await nextTick()
    expect(loadMoreMock).toHaveBeenCalledTimes(1) // Still 1

    // Wait for debounce time to pass
    await vi.advanceTimersByTime(1000)
    observerCallback([{ isIntersecting: true }])
    await nextTick()
    
    // Now it should be called twice
    expect(loadMoreMock).toHaveBeenCalledTimes(2)
  })
})

