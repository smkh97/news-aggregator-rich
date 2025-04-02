import { ref, onMounted, onUnmounted } from 'vue'

export const useMemoryMonitor = () => {
  const memoryUsage = ref<number>(0)
  const isWarning = ref<boolean>(false)
  let intervalId: number | null = null

  const checkMemoryUsage = () => {
    if (performance.memory) {
      const usage = performance.memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
      memoryUsage.value = Math.round(usage * 100) / 100
      isWarning.value = usage > 250 // Warning threshold at 250MB
      
      if (isWarning.value) {
        console.warn(`High memory usage detected: ${memoryUsage.value}MB`)
      }
    }
  }

  onMounted(() => {
    if (performance.memory) {
      checkMemoryUsage() // Check immediately on mount
      intervalId = window.setInterval(checkMemoryUsage, 5000) // Check every 5 seconds
    }
  })

  onUnmounted(() => {
    if (intervalId) {
      window.clearInterval(intervalId)
    }
  })

  return {
    memoryUsage,
    isWarning
  }
} 