<template>
    <div class="overflow-x-auto pb-2 mb-6">
      <div class="flex space-x-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-100 active:scale-95"
          :class="[
            currentCategory === category.value
              ? 'dark:bg-white dark:text-black bg-black text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          ]"
        >
          <span class="flex items-center">
            <Icon :name="category.icon" class="mr-1.5 w-4 h-4" />
            {{ category.label }}
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useEventBus } from '~/composables/useEventBus'
  import { onMounted, onUnmounted, ref } from 'vue'
  
  const props = defineProps<{
    currentCategory: string
  }>()
  
  const emit = defineEmits<{
    (e: 'select', category: string): void
  }>()
  
  const eventBus = useEventBus()
  const isMounted = ref(false)
  let currentHandler: ((category: string) => void) | null = null
  
  const categories = [
    { label: 'General', value: 'general', icon: 'heroicons:newspaper' },
    { label: 'Business', value: 'business', icon: 'heroicons:briefcase' },
    { label: 'Technology', value: 'technology', icon: 'heroicons:computer-desktop' },
    { label: 'Science', value: 'science', icon: 'heroicons:beaker' },
    { label: 'Health', value: 'health', icon: 'heroicons:heart' },
    { label: 'Sports', value: 'sports', icon: 'heroicons:trophy' },
    { label: 'Entertainment', value: 'entertainment', icon: 'heroicons:film' }
  ]
  
  const selectCategory = (category: string) => {
    emit('select', category)
  }
  
  // Listen for global category selection events
  onMounted(() => {
    isMounted.value = true    
    currentHandler = (category: string) => {
      if (isMounted.value) {
        selectCategory(category)
      }
    }
    
    eventBus.on('select-category', currentHandler)
  })
  
  onUnmounted(() => {
    isMounted.value = false
    if (currentHandler) {
      eventBus.off('select-category', currentHandler)
      currentHandler = null
    }
  })
  </script>
  
  