<template>
  <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer" @click="handleHomeClick">
        <Icon name="lucide:newspaper" class="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <span class="text-lg sm:text-xl font-bold truncate">News Aggregator</span>
      </NuxtLink>

      <div class="flex items-center space-x-2 sm:space-x-6">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer relative"
          :class="{ 'text-foreground': route.path === item.path }"
          @click="handleNavigation(item.path)"
        >
          <Icon :name="item.icon" class="h-4 w-4 sm:h-5 sm:w-5" />
          <span class="hidden sm:inline">{{ item.label }}</span>
          <div
            v-if="route.path === item.path"
            class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          />
        </NuxtLink>
        <ThemeToggle />
      </div>
    </div>
  </nav>
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