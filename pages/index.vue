<template>
  <div class="container py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Top Headlines</h1>
      <p class="text-muted-foreground mt-2">Stay informed with the latest news from around the world.</p>
    </div>

    <ApiKeyError
      :error="newsStore.error"
      :is-api-key-error="newsStore.isApiKeyError"
    />

    <CategorySelector
      :current-category="newsStore.currentCategory"
      @select="selectCategory"
    />

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in newsStore.articles"
        :key="article.url"
        :article="article"
      />
    </div>

    <div v-if="newsStore.loading" class="mt-8 flex justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-if="newsStore.isLoadingMore" class="mt-8 flex justify-center">
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
import { onMounted, onUnmounted, watch } from 'vue'

const newsStore = useNewsStore()
const loadMoreTrigger = ref<HTMLElement | null>(null)

const selectCategory = async (category: string) => {
  if (newsStore.currentCategory === category) return
  
  // Reset state for new category
  newsStore.resetState()
  newsStore.currentCategory = category
  await newsStore.fetchTopHeadlines(category)
}

const { target, isLoading } = useInfiniteScroll(
  () => {
    return newsStore.loadMoreTopHeadlines(newsStore.currentCategory)
  },
  {
    rootMargin: '200px',
    threshold: 0.1,
    immediate: false,
    onError: (error) => {
      console.error('Error loading more articles:', error)
    }
  }
)

// Watch for route changes to ensure proper initialization
watch(() => newsStore.currentCategory, async (newCategory) => {
  if (!newCategory || newCategory === '') {
    await newsStore.initialize()
  }
})

onMounted(() => {
  newsStore.initialize()
  target.value = loadMoreTrigger.value
})

onUnmounted(() => {
  newsStore.resetState()
})
</script> 