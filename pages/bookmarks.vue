<template>
  <div class="container py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Bookmarked Articles</h1>
      <p class="text-muted-foreground mt-2">Your saved articles for later reading.</p>
    </div>

    <div v-if="bookmarksStore.isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-else-if="!bookmarksStore.bookmarkedArticles || bookmarksStore.bookmarkedArticles.length === 0" class="text-center py-12">
      <Icon name="lucide:bookmark" class="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 class="mt-4 text-lg font-semibold">No bookmarked articles</h2>
      <p class="mt-2 text-sm text-muted-foreground">Articles you bookmark will appear here.</p>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in bookmarksStore.bookmarkedArticles"
        :key="article.url"
        :article="article"
        @bookmark-removed="handleBookmarkRemoved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookmarksStore } from '~/stores/bookmarks'
import { onMounted } from 'vue'

const bookmarksStore = useBookmarksStore()

const handleBookmarkRemoved = async (url: string) => {
  if (!url) return
  bookmarksStore.removeBookmark(url)
}

onMounted(() => {
  bookmarksStore.loadBookmarks()
})
</script>
