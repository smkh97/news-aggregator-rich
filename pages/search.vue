<template>
  <div class="container py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Search Articles</h1>
      <p class="text-muted-foreground mt-2">Find articles from around the world.</p>
    </div>

    <ApiKeyError
      :error="newsStore.error"
      :is-api-key-error="newsStore.isApiKeyError"
    />

    <div class="flex flex-col gap-4 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-grow">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles..."
            class="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            @input="handleSearchInput"
          />
          <Icon
            name="lucide:search"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <div class="relative w-full md:w-48">
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <Icon
            name="lucide:chevron-down"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>
    </div>

    <div v-if="newsStore.searchQuery" class="mt-4">
      <p class="text-sm text-muted-foreground">
        Showing results for "{{ newsStore.searchQuery }}"
      </p>
    </div>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in newsStore.articles"
        :key="article.url"
        :article="article"
      />
    </div>

    <div v-if="newsStore.loading || newsStore.isLoadingMore" class="mt-8 flex justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-if="newsStore.error" class="mt-8 text-center text-sm text-destructive">
      {{ newsStore.error }}
    </div>

    <div
      ref="loadMoreTrigger"
      class="mt-8 h-4 w-full"
      v-if="newsStore.hasMore"
    />
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '~/stores/news'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { debounce } from 'lodash-es'

const PAGE_SIZE = 10
const DEBOUNCE_DELAY = 500 // 500ms debounce

const newsStore = useNewsStore()
const searchQuery = ref('')
const sortBy = ref<'relevancy' | 'popularity' | 'publishedAt'>('publishedAt')
const loadMoreTrigger = ref<HTMLElement | null>(null)

const sortOptions = [
  { label: 'Relevancy', value: 'relevancy' as const },
  { label: 'Popularity', value: 'popularity' as const },
  { label: 'Date', value: 'publishedAt' as const }
]

// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (query.trim()) {
    newsStore.resetState()
    newsStore.searchArticles(query, sortBy.value, 1)
  }
}, DEBOUNCE_DELAY)

const handleSearchInput = () => {
  debouncedSearch(searchQuery.value)
}

// Initialize infinite scroll
const { target, isLoading } = useInfiniteScroll(
  async () => {
    if (!newsStore.hasMore || newsStore.isLoadingMore || newsStore.loading) {     
      return
    }
    await newsStore.loadMoreSearchResults(searchQuery.value, sortBy.value)
  },
  {
    rootMargin: '400px',
    threshold: 0.1,
    immediate: false
  }
)

// Watch for load more trigger changes
watch(() => loadMoreTrigger.value, (newValue) => {
  if (newValue) {
    target.value = newValue
  }
})

onMounted(() => {
  if (newsStore.searchQuery) {
    searchQuery.value = newsStore.searchQuery
    sortBy.value = newsStore.sortBy
  }
  
  // Set the target after a short delay to ensure the element is mounted
  setTimeout(() => {
    if (loadMoreTrigger.value) { 
      target.value = loadMoreTrigger.value
    }
  }, 500)
})

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    debouncedSearch(newQuery)
  }
})

// Watch for sort changes
watch(sortBy, (newSort) => {
  if (searchQuery.value.trim()) {
    newsStore.resetState()
    newsStore.searchArticles(searchQuery.value, newSort, 1)
  }
})

onUnmounted(() => {
  newsStore.resetState()
})
</script> 