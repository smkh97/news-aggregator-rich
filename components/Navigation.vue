<template>
  <!-- Top Navigation -->
  <nav class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
    <div class="container flex h-16 items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer" @click="handleHomeClick">
        <Icon name="lucide:newspaper" class="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 dark:text-white" />
        <span class="text-lg sm:text-xl font-bold truncate text-gray-900 dark:text-white">News Aggregator</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden sm:flex items-center space-x-6">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer relative"
          :class="{ 'text-gray-900 dark:text-white': route.path === item.path }"
          @click="handleNavigation(item.path)"
        >
          <Icon :name="item.icon" class="h-5 w-5" />
          <span class="hidden sm:inline">{{ item.label }}</span>
          <div
            v-if="route.path === item.path"
            class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          />
        </NuxtLink>
        <ThemeToggle />
      </div>

      <!-- Mobile Theme Toggle -->
      <div class="sm:hidden">
        <ThemeToggle />
      </div>
    </div>
  </nav>

  <!-- Mobile Bottom Navigation -->
  <div class="sm:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black pb-safe z-50">
    <div class="container flex justify-around items-center h-16 px-4">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-1 text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative flex-1"
        :class="{ 'text-gray-900 dark:text-white': route.path === item.path }"
        @click="handleNavigation(item.path)"
      >
        <Icon :name="item.icon" class="h-5 w-5" />
        <span>{{ item.label }}</span>
        <div
          v-if="route.path === item.path"
          class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '~/stores/news'
import { useEventBus } from '~/composables/useEventBus'

/**
 * Navigation item interface
 * @interface NavigationItem
 */
interface NavigationItem {
  label: string
  path: string
  icon: string
}

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const eventBus = useEventBus()

/**
 * Navigation menu items configuration
 * @type {NavigationItem[]}
 */
const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: 'lucide:home' },
  { label: 'Search', path: '/search', icon: 'lucide:search' },
  { label: 'Bookmarks', path: '/bookmarks', icon: 'lucide:bookmark' }
]

/**
 * Handles navigation to the home page
 * Sets the default category and fetches top headlines
 */
const handleHomeNavigation = async (): Promise<void> => {
  eventBus.emit('select-category', 'general')
  await router.push('/')
  await newsStore.fetchTopHeadlines('general')
}

/**
 * Handles click on the home link
 * Prevents default behavior and navigates if not already on home page
 * @param {Event} e - The click event
 */
const handleHomeClick = async (e: Event): Promise<void> => {
  if (route.path !== '/') {
    await handleHomeNavigation()
  }
}

/**
 * Handles navigation to a specific route
 * If already on the target route, refreshes the content
 * @param {string} path - The target navigation path
 */
const handleNavigation = async (path: string): Promise<void> => {
  if (route.path === path) {
    if (path === '/') {
      await handleHomeNavigation()
    } else {
      await router.push(path)
    }
  }
}
</script> 