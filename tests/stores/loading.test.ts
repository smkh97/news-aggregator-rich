import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useLoadingStore } from "~/stores/loading"

describe("loadingStore", () => {
  let store: ReturnType<typeof useLoadingStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoadingStore()
  })

  it("should initialize with correct default values", () => {
    expect(store.isLoading).toBe(false)
    expect(store.loadingCount).toBe(0)
  })

  it("should start loading", () => {
    store.startLoading()

    expect(store.isLoading).toBe(true)
    expect(store.loadingCount).toBe(1)
  })

  it("should stop loading when count reaches zero", () => {
    store.startLoading()
    store.startLoading()
    expect(store.loadingCount).toBe(2)

    store.stopLoading()
    expect(store.isLoading).toBe(true)
    expect(store.loadingCount).toBe(1)

    store.stopLoading()
    expect(store.isLoading).toBe(false)
    expect(store.loadingCount).toBe(0)
  })

  it("should not allow negative loading count", () => {
    store.stopLoading()
    store.stopLoading()

    expect(store.isLoading).toBe(false)
    expect(store.loadingCount).toBe(0)
  })

  it("should handle multiple concurrent loading states", () => {
    // Simulate multiple API calls starting
    store.startLoading()
    store.startLoading()
    store.startLoading()

    expect(store.isLoading).toBe(true)
    expect(store.loadingCount).toBe(3)

    // Simulate API calls completing
    store.stopLoading()
    expect(store.isLoading).toBe(true)
    expect(store.loadingCount).toBe(2)

    store.stopLoading()
    expect(store.isLoading).toBe(true)
    expect(store.loadingCount).toBe(1)

    store.stopLoading()
    expect(store.isLoading).toBe(false)
    expect(store.loadingCount).toBe(0)
  })
})

