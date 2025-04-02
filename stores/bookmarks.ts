import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

const STORAGE_KEY = 'news-bookmarks'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarkedArticles = ref<Article[]>([])
  const isLoading = ref(false)

  const isBookmarked = computed(() => {
    const urlSet = new Set(bookmarkedArticles.value.map(article => article.url))
    return (url: string) => urlSet.has(url)
  })

  const loadBookmarks = () => {
    try {
      isLoading.value = true
      const storedBookmarks = localStorage.getItem(STORAGE_KEY)
      if (storedBookmarks) {
        const parsed = JSON.parse(storedBookmarks)
        bookmarkedArticles.value = parsed && Array.isArray(parsed.bookmarkedArticles)
          ? parsed.bookmarkedArticles
          : []
      } else {
        bookmarkedArticles.value = []
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      bookmarkedArticles.value = []
    } finally {
      isLoading.value = false
    }
  }

  const saveBookmarks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bookmarkedArticles: bookmarkedArticles.value }))
    } catch (error) {
      console.error('Error saving bookmarks:', error)
    }
  }

  const addBookmark = (article: Article) => {
    if (!article?.url) return
    
    // Check if article already exists
    const exists = bookmarkedArticles.value.some(
      (bookmark) => bookmark.url === article.url
    )
    
    if (!exists) {
      bookmarkedArticles.value.push(article)
      saveBookmarks()
    }
  }

  const removeBookmark = (url: string) => {
    if (!url) return
    
    bookmarkedArticles.value = bookmarkedArticles.value.filter(
      (bookmark) => bookmark.url !== url
    )
    saveBookmarks()
  }

  return {
    bookmarkedArticles,
    isLoading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    loadBookmarks
  }
}) 