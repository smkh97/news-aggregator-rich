import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { usePerformance } from '~/composables/usePerformance'
import { createApp, defineComponent } from 'vue'
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

// Mock web-vitals
vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFID: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}))

// Mock performance API
const mockPerformance = {
  memory: {
    usedJSHeapSize: 1000000, // 1MB
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 3000000,
  },
  now: () => 0,
  mark: vi.fn(),
  measure: vi.fn(),
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
})

// Mock setInterval and clearInterval
vi.spyOn(window, 'setInterval')
vi.spyOn(window, 'clearInterval')

describe('usePerformance', () => {
  let performanceMonitor: ReturnType<typeof usePerformance>
  let app: any

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'setInterval')
    vi.spyOn(window, 'clearInterval')
    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 1024 * 1024, // 1MB in bytes
        totalJSHeapSize: 2048 * 1024 * 1024,
        jsHeapSizeLimit: 4096 * 1024 * 1024
      },
      configurable: true
    })
    app = createApp(defineComponent({
      setup() {
        performanceMonitor = usePerformance()
        return {}
      },
      template: ''
    }))
    app.mount(document.createElement('div'))
    // Let the first interval run to update memory usage
    vi.advanceTimersByTime(5000)
  })

  afterEach(() => {
    app.unmount()
    vi.restoreAllMocks()
  })

  it('should initialize with correct memory usage', () => {
    expect(performanceMonitor.memoryUsage.value).toBe(1) // 1MB
  })

  it('should initialize with zero performance metrics', () => {
    expect(performanceMonitor.performanceMetrics.value).toEqual({
      cls: 0,
      fid: 0,
      lcp: 0,
      ttfb: 0,
    })
  })

  it('should handle missing performance.memory', () => {
    // Remove performance.memory
    delete (window.performance as any).memory

    // Create a new instance
    app.unmount()
    const container = document.createElement('div')
    app = createApp(defineComponent({
      template: '<div></div>',
      setup() {
        performanceMonitor = usePerformance()
        return {}
      }
    }))
    app.mount(container)

    expect(performanceMonitor.memoryUsage.value).toBe(0)
  })

  it('should set up and clear intervals on mount/unmount', () => {
    expect(window.setInterval).toHaveBeenCalledTimes(2) // One for memory, one for logging
    
    app.unmount()
    expect(window.clearInterval).toHaveBeenCalledTimes(2)
  })

  it('should set up web vitals monitoring', () => {
    expect(onCLS).toHaveBeenCalled()
    expect(onFID).toHaveBeenCalled()
    expect(onLCP).toHaveBeenCalled()
    expect(onTTFB).toHaveBeenCalled()
  })

  it('should update performance metrics when web vitals are reported', () => {
    // Simulate web vitals reporting
    const mockCLS = { value: 0.1 }
    const mockFID = { value: 100 }
    const mockLCP = { value: 2000 }
    const mockTTFB = { value: 300 }

    // Get the callback functions that were passed to the web vitals functions
    const clsCallback = (onCLS as any).mock.calls[0][0]
    const fidCallback = (onFID as any).mock.calls[0][0]
    const lcpCallback = (onLCP as any).mock.calls[0][0]
    const ttfbCallback = (onTTFB as any).mock.calls[0][0]

    // Call the callbacks with mock values
    clsCallback(mockCLS)
    fidCallback(mockFID)
    lcpCallback(mockLCP)
    ttfbCallback(mockTTFB)

    expect(performanceMonitor.performanceMetrics.value).toEqual({
      cls: 0.1,
      fid: 100,
      lcp: 2000,
      ttfb: 300,
    })
  })
}) 