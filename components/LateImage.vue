<template>
  <div 
    class="relative overflow-hidden"
    role="img"
    :aria-label="alt"
    :style="{ paddingTop: `${(height/width)*100}%` }"
  >
    <div class="absolute top-0 left-0 w-full h-full">
      <NuxtImg
        :src="src"
        :alt="alt"
        quality="80"
        format="webp"
        fit="cover"
        width="500"
        height="500"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': isBlurred }"
        :loading="critical ? 'eager' : 'lazy'"
        :modifiers="{ quality, fit: 'cover' }"
        :sizes="calculatedSizes"
        densities="x1 x2"
        data-testid="optimized-image"
        preload 
        @load="handleImageLoad"
        />
      
      <!-- Loading State -->
      <div
        v-if="shouldShowLoading"
        class="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
        data-testid="image-loading-state"
        role="status"
        aria-live="polite"
        :aria-label="`Loading ${alt}`"
      />
      
      <!-- Blur Overlay -->
      <div
        v-if="shouldShowBlur"
        class="absolute inset-0 backdrop-blur-sm"
        data-testid="image-blur-overlay"
      />
      
      <!-- Error State -->
      <div
        v-if="hasError"
        class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900"
        role="alert"
        aria-live="assertive"
        data-testid="image-error-state"
      >
        <Icon 
          name="lucide:image-off" 
          class="h-12 w-12 text-gray-400 dark:text-gray-600"
          aria-hidden="true"
        />
        <span class="sr-only">Error loading image: {{ alt }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  quality?: number
  critical?: boolean
}


const props = withDefaults(defineProps<OptimizedImageProps>(), {
  sizes: '',
  quality: 80,
  critical: false
})

const MIN_QUALITY = 40
const MAX_QUALITY = 90
const LOAD_TRANSITION_DELAY_MS = 300
// Define breakpoints matching your design system
const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
})

const calculatedSizes = computed(() => {
  if (props.sizes) return props.sizes
  
  return breakpoints.greaterOrEqual('xxl') ? '1536px' :
         breakpoints.greaterOrEqual('xl') ? '1280px' :
         breakpoints.greaterOrEqual('lg') ? '1024px' :
         breakpoints.greaterOrEqual('md') ? '768px' :
         breakpoints.greaterOrEqual('sm') ? '640px' : '100vw'
})

const isLoaded = ref(false)
const isBlurred = ref(true)
const hasError = ref(false)

const shouldShowLoading = computed(() => !isLoaded.value || isBlurred.value)
const shouldShowBlur = computed(() => isLoaded.value && isBlurred.value)


const validateQuality = (quality: number) => {
  if (quality < MIN_QUALITY || quality > MAX_QUALITY) {
    throw new Error(`Image quality must be between ${MIN_QUALITY}-${MAX_QUALITY}`)
  }
}

const handleImageLoad = () => {
  isLoaded.value = true
  hasError.value = false
  setTimeout(() => (isBlurred.value = false), LOAD_TRANSITION_DELAY_MS)
}

const handleImageError = (error: Event) => {
  hasError.value = true
  isLoaded.value = true
  isBlurred.value = false
  console.error('Image load failed:', error)
}

watch(() => props.quality, validateQuality, { immediate: true })
watch(() => props.src, () => {
  isLoaded.value = false
  isBlurred.value = true
  hasError.value = false
})
</script>