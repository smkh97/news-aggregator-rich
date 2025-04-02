<template>
    <div>
      <div v-if="loading && articles.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <ArticleSkeleton v-for="i in 6" :key="i" />
      </div>
      
      <div v-else-if="articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.url" 
          :article="article" 
        />
      </div>
      
      <div v-else-if="error" class="text-center py-8 sm:py-12 px-4">
        <div class="bg-destructive/10 p-4 sm:p-6 rounded-lg max-w-lg mx-auto">
          <Icon name="heroicons:exclamation-circle" class="w-8 h-8 sm:w-12 sm:h-12 text-destructive mx-auto mb-3 sm:mb-4" />
          <h3 class="text-base sm:text-lg font-bold text-destructive mb-2">Error Loading Articles</h3>
          <p class="text-sm sm:text-base text-destructive/90">{{ error }}</p>
          
          <div v-if="isApiKeyError" class="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-500/10 rounded-lg text-left">
            <h4 class="font-bold text-yellow-500 mb-2">API Key Issue</h4>
            <p class="text-xs sm:text-sm text-yellow-500/90 mb-2">
              It looks like there might be an issue with your NewsAPI key. Please check:
            </p>
            <ul class="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-yellow-500/90">
              <li>Your API key is valid and active</li>
              <li>You haven't exceeded your API request limits</li>
              <li>The API key is correctly set in your environment variables</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 sm:py-12 px-4">
        <Icon name="heroicons:newspaper" class="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
        <h3 class="text-lg sm:text-xl font-bold text-muted-foreground">No Articles Found</h3>
        <p class="text-sm sm:text-base text-muted-foreground/80 mt-2">Try a different search or category</p>
      </div>
      
      <!-- Infinite Scroll Loader -->
      <div v-if="hasMore && !loading && articles.length > 0" ref="loadMoreTrigger" class="py-6 sm:py-8 text-center">
        <div class="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-3 sm:border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useInfiniteScroll } from '~/composables/useInfiniteScroll'
  
  /**
   * Interface for article data
   * @interface Article
   */
  interface Article {
    url: string
    title: string
    description: string | null
    content: string | null
    source: {
      id: string | null
      name: string
    }
    publishedAt: string
    urlToImage: string | null
  }
  
  /**
   * Props for the NewsGrid component
   * @property {Article[]} articles - Array of news articles to display
   * @property {boolean} loading - Loading state indicator
   * @property {string | null} error - Error message if any
   * @property {boolean} hasMore - Indicates if more articles can be loaded
   * @property {boolean} isApiKeyError - Indicates if the error is related to API key
   * @property {() => Promise<void>} loadMore - Function to load more articles
   */
  const props = defineProps<{
    articles: Article[]
    loading: boolean
    error: string | null
    hasMore: boolean
    isApiKeyError: boolean
    loadMore: () => Promise<void>
  }>()
  
  /**
   * Reference to the element that triggers loading more articles
   * @type {Ref<HTMLElement | null>}
   */
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  
  /**
   * Infinite scroll composable instance
   * @type {{ target: Ref<HTMLElement | null>, isLoading: Ref<boolean> }}
   */
  const { target, isLoading } = useInfiniteScroll(props.loadMore)
  
  /**
   * Connects the load more trigger element to the infinite scroll functionality
   * Updates the target element when the trigger is mounted
   */
  watch(() => loadMoreTrigger.value, (newValue) => {
    if (newValue) {
      target.value = newValue
    }
  })
  </script>
  
  