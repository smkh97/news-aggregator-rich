import { ref, onMounted, onUnmounted } from 'vue'
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

export const usePerformance = () => {
  const memoryUsage = ref<number>(0)
  const performanceMetrics = ref({
    cls: 0,
    fid: 0,
    lcp: 0,
    ttfb: 0
  })

  const updateMemoryUsage = () => {
    const performanceWithMemory = performance as PerformanceWithMemory
    if (performanceWithMemory.memory) {
      memoryUsage.value = performanceWithMemory.memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
    }
  }

  const logPerformanceMetrics = () => {
    console.log('Performance Metrics:', {
      memoryUsage: `${memoryUsage.value.toFixed(2)}MB`,
      ...performanceMetrics.value
    })
  }

  onMounted(() => {
    // Monitor memory usage
    const memoryInterval = setInterval(updateMemoryUsage, 5000)

    // Monitor Web Vitals
    onCLS((metric) => {
      performanceMetrics.value.cls = metric.value
    })

    onFID((metric) => {
      performanceMetrics.value.fid = metric.value
    })

    onLCP((metric) => {
      performanceMetrics.value.lcp = metric.value
    })

    onTTFB((metric) => {
      performanceMetrics.value.ttfb = metric.value
    })

    // Log metrics every 30 seconds
    const loggingInterval = setInterval(logPerformanceMetrics, 30000)

    onUnmounted(() => {
      clearInterval(memoryInterval)
      clearInterval(loggingInterval)
    })
  })

  return {
    memoryUsage,
    performanceMetrics
  }
} 