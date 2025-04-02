<template>
  <div 
    class="relative overflow-hidden"
    role="img"
    :aria-label="alt"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-300"
      :class="{ 'opacity-0': isBlurred }"
      format="webp"
      loading="lazy"
      :modifiers="{ quality }"
      :sizes="sizes"
      data-testid="optimized-image"
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
</template>

<script setup lang="ts">
interface OptimizedImageProps {
  src: string
  alt: string
  sizes?: string
  quality?: number
}

const props = withDefaults(defineProps<OptimizedImageProps>(), {
  sizes: 'sm:640px md:768px lg:1024px xl:1280px 2xl:1536px',
  quality: 80
})

const MIN_QUALITY = 10
const MAX_QUALITY = 100
const LOAD_TRANSITION_DELAY_MS = 300

const isLoaded = ref(false)
const isBlurred = ref(true)
const hasError = ref(false)

const shouldShowLoading = computed(() => !isLoaded.value || isBlurred.value)
const shouldShowBlur = computed(() => isLoaded.value && isBlurred.value)

/**
 * Validates the quality prop value
 * @throws {Error} If quality is outside valid range
 */
const validateQuality = (quality: number) => {
  if (quality < MIN_QUALITY || quality > MAX_QUALITY) {
    throw new Error(
      `Image quality must be between ${MIN_QUALITY} and ${MAX_QUALITY}`
    )
  }
}

/**
 * Handles successful image load
 * @emits load When image finishes loading
 */
const handleImageLoad = () => {
  isLoaded.value = true
  hasError.value = false
  
  setTimeout(() => {
    isBlurred.value = false
  }, LOAD_TRANSITION_DELAY_MS)
}

/**
 * Handles image loading errors
 * @emits error When image loading fails
 */
const handleImageError = (error: Event) => {
  hasError.value = true
  isLoaded.value = true
  isBlurred.value = false
  console.error('Image load failed:', error)
}

// Validate quality prop on initialization and changes
watch(() => props.quality, (newQuality) => {
  validateQuality(newQuality)
}, { immediate: true })

/**
 * Resets component state when source changes
 */
watch(() => props.src, () => {
  isLoaded.value = false
  isBlurred.value = true
  hasError.value = false
})
</script>