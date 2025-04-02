<template>
  <div class="relative overflow-hidden">
    <img
      v-if="isLoaded && !hasError"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-300"
      :class="{ 'opacity-0': isBlurred }"
      @load="handleLoad"
      @error="handleError"
    />
    <div
      v-if="!isLoaded || isBlurred"
      class="absolute inset-0 bg-muted animate-pulse"
    />
    <div
      v-if="isLoaded && isBlurred"
      class="absolute inset-0 backdrop-blur-sm"
    />
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-muted"
    >
      <Icon name="lucide:image-off" class="h-12 w-12 text-muted-foreground" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

/**
 * Props for the LazyImage component
 * @property {string} src - The source URL of the image
 * @property {string} alt - The alternative text for the image
 */
const props = defineProps<{
  src: string
  alt: string
}>()

/**
 * Tracks whether the image has finished loading
 * @type {Ref<boolean>}
 */
const isLoaded = ref(false)

/**
 * Controls the blur effect state during image loading
 * @type {Ref<boolean>}
 */
const isBlurred = ref(true)

/**
 * Tracks whether the image failed to load
 * @type {Ref<boolean>}
 */
const hasError = ref(false)

/**
 * Handles successful image load
 * Removes blur effect after a short delay for smooth transition
 */
const handleLoad = (): void => {
  isLoaded.value = true
  hasError.value = false
  // Add a small delay before removing the blur effect
  setTimeout(() => {
    isBlurred.value = false
  }, 300)
}

/**
 * Handles image loading errors
 * Sets error state and removes loading states
 */
const handleError = (): void => {
  hasError.value = true
  isLoaded.value = true
  isBlurred.value = false
}

/**
 * Preloads the image and sets up load/error handlers
 * Resets component state before loading
 */
const preloadImage = (): void => {
  if (!props.src) return
  
  isLoaded.value = false
  isBlurred.value = true
  hasError.value = false
  
  const img = new Image()
  img.onload = handleLoad
  img.onerror = handleError
  img.src = props.src
}

// Watch for src changes to reload the image
watch(() => props.src, () => {
  preloadImage()
})

onMounted(() => {
  preloadImage()
})
</script> 