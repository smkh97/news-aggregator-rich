import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useMemoryMonitor } from '~/composables/useMemoryMonitor'
import { createApp, defineComponent } from 'vue'

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

describe('useMemoryMonitor', () => {
  let memoryMonitor: ReturnType<typeof useMemoryMonitor>
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
        memoryMonitor = useMemoryMonitor()
        return {}
      },
      template: ''
    }))
    app.mount(document.createElement('div'))
  })

  afterEach(() => {
    app.unmount()
    vi.restoreAllMocks()
  })

  it('should initialize with correct memory values', () => {
    expect(memoryMonitor.memoryUsage.value).toBe(1) // 1MB
    expect(memoryMonitor.isWarning.value).toBe(false)
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
        memoryMonitor = useMemoryMonitor()
        return {}
      }
    }))
    app.mount(container)

    expect(memoryMonitor.memoryUsage.value).toBe(0)
    expect(memoryMonitor.isWarning.value).toBe(false)
  })

  it('should set up and clear interval on mount/unmount', () => {
    expect(window.setInterval).toHaveBeenCalledTimes(1)
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 5000)

    app.unmount()
    expect(window.clearInterval).toHaveBeenCalled()
  })
}) 