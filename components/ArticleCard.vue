<template>
  <div class="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer">
    <div class="relative aspect-video overflow-hidden">

      <NuxtImg
         v-if="article?.urlToImage"
        :src="article.urlToImage"
        :alt="article.title"
        sizes="100vw sm:50vw md:400px"
        densities="x1 x2"
         format="webp"
          quality="80"
          width="500"
          height="500"
          fit="cover"
          preload
        />
       
    
      <div v-else class="flex h-full w-full items-center justify-center bg-muted">
        <Icon name="lucide:image-off" class="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
    <div class="flex flex-1 flex-col p-3 sm:p-4">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs sm:text-sm text-muted-foreground truncate">{{ article?.source?.name || 'Unknown Source' }}</span>
        <span class="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{{ formatDate(article?.publishedAt) }}</span>
      </div>
      <h2 class="mt-2 text-base sm:text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {{ truncateText(article?.title, 100) }}
      </h2>
      <p class="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3">
        {{ article?.description ? truncateText(article.description, 150) : 'No description available' }}
      </p>
      <div class="mt-auto flex items-center justify-between pt-3 sm:pt-4">
        <a
          :href="article?.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-xs sm:text-sm font-medium text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'pointer-events-none cursor-not-allowed': !article?.url }"
          @click.stop
        >
          {{ article?.url ? 'Read More' : 'No link available' }}
          <Icon name="lucide:arrow-right" class="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </a>
        <button
          @click.stop="toggleBookmark"
          class="rounded-full p-1.5 sm:p-2 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground cursor-pointer relative group"
          :class="{ 'text-primary': isArticleBookmarked }"
        >
          <Icon
            :name="isArticleBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'"
            class="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookmarksStore } from '~/stores/bookmarks'
import { ref, onMounted, watch } from 'vue'
import LateImage from './LateImage.vue'

/**
 * Interface representing a news article from the API
 * @interface Article
 */
interface Article {
  source: {
    id: string | null
    name: string
  }
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

/**
 * Props for the ArticleCard component
 * @property {Article} article - The article data to display
 */
const props = defineProps<{
  article: Article
}>()

/**
 * Emits for the ArticleCard component
 * @property {string} bookmark-removed - Emitted when an article is removed from bookmarks
 */
const emit = defineEmits<{
  (e: 'bookmark-removed', url: string): void
}>()

const bookmarksStore = useBookmarksStore()
const isArticleBookmarked = ref(false)

/**
 * Initializes the bookmark state when the component mounts
 */
onMounted(() => {
  if (props.article?.url) {
    isArticleBookmarked.value = bookmarksStore.isBookmarked(props.article.url)
  }
})

/**
 * Watches for changes in the article URL to update bookmark state
 */
watch(() => props.article?.url, (newUrl) => {
  if (newUrl) {
    isArticleBookmarked.value = bookmarksStore.isBookmarked(newUrl)
  }
})

/**
 * Toggles the bookmark state of the article
 * Emits a 'bookmark-removed' event if the article is removed from bookmarks
 */
const toggleBookmark = () => {
  if (!props.article?.url) return
  
  if (isArticleBookmarked.value) {
    bookmarksStore.removeBookmark(props.article.url)
    emit('bookmark-removed', props.article.url)
  } else {
    bookmarksStore.addBookmark(props.article)
  }
  
  isArticleBookmarked.value = !isArticleBookmarked.value
}

/**
 * Handles image loading errors by replacing the failed image with a fallback icon
 * @param {Event} e - The error event from the image
 */
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const fallback = document.createElement('div')
    fallback.className = 'flex h-full w-full items-center justify-center bg-muted'
    fallback.innerHTML = '<i class="lucide-image-off h-12 w-12 text-muted-foreground"></i>'
    parent.appendChild(fallback)
  }
}

/**
 * Formats a date string into a localized date format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Unknown Date'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Truncates text to a specified maximum length
 * @param {string | null | undefined} text - The text to truncate
 * @param {number} maxLength - The maximum length of the text
 * @returns {string} The truncated text with ellipsis if needed
 */
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
</script> 