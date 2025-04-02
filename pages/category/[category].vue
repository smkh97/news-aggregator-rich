<template>
  <div class="container py-8">
    <h1 class="text-3xl font-bold text-foreground mb-8">
      {{ category.charAt(0).toUpperCase() + category.slice(1) }} News
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard
        v-for="article in newsStore.articles"
        :key="article.url"
        :article="article"
      />
    </div>

    <!-- Loading States -->
    <div v-if="newsStore.loading || newsStore.isLoadingMore" class="mt-8 flex justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-if="newsStore.error" class="mt-8 text-center text-sm text-destructive">
      {{ newsStore.error }}
    </div>

    <!-- Load More Button -->
    <div v-if="newsStore.hasMore && !newsStore.loading && !newsStore.isLoadingMore" class="mt-8 text-center">
      <button
        @click="loadMoreArticles"
        class="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="newsStore.isLoadingMore"
      >
        <span v-if="newsStore.isLoadingMore" class="flex items-center">
          <div class="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          Loading...
        </span>
        <span v-else>Load More Articles</span>
      </button>
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

const PAGE_SIZE = 10
const route = useRoute()
const newsStore = useNewsStore()
const category = route.params.category as string
const loadMoreTrigger = ref<HTMLElement | null>(null)

const loadMoreArticles = async () => {
  if (!newsStore.hasMore || newsStore.isLoadingMore) return
  await newsStore.loadMoreTopHeadlines(category)
}

const { target, isLoading } = useInfiniteScroll(
  async () => { 
    if (!newsStore.hasMore || newsStore.isLoadingMore) { 
      return
    }
    await newsStore.loadMoreTopHeadlines(category)
  },
  {
    rootMargin: '400px',
    threshold: 0.1,
    immediate: false
  }
)

// Watch for category changes
watch(() => route.params.category, async (newCategory) => {
  if (newCategory && newCategory !== category) {
    newsStore.resetState()
    newsStore.currentCategory = newCategory as string
    await newsStore.fetchTopHeadlines(newCategory as string)
    
    // Reset the infinite scroll target after category change
    setTimeout(() => {
      if (loadMoreTrigger.value) {
        target.value = loadMoreTrigger.value
      }
    }, 500)
  }
})

// Watch for load more trigger changes
watch(() => loadMoreTrigger.value, (newValue) => {
  if (newValue && !newsStore.isInitialLoad) {
    target.value = newValue
  }
})

onMounted(() => {
  newsStore.resetState()
  newsStore.currentCategory = category
  newsStore.fetchTopHeadlines(category)
  
  // Set the target after a short delay to ensure the element is mounted
  setTimeout(() => {
    if (loadMoreTrigger.value && !newsStore.isInitialLoad) {
      target.value = loadMoreTrigger.value
    }
  }, 500)
})

onUnmounted(() => {
  newsStore.resetState()
})
</script> 