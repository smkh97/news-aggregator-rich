import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

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

export const useBookmarks = () => {
  const bookmarks = ref<{ bookmarkedArticles: Article[] }>({ bookmarkedArticles: [] })
  const isLoading = ref(false)

  const loadBookmarks = () => {
    try {
      isLoading.value = true
      const storedBookmarks = localStorage.getItem(STORAGE_KEY)
      if (storedBookmarks) {
        const parsed = JSON.parse(storedBookmarks)
        bookmarks.value = parsed && Array.isArray(parsed.bookmarkedArticles)
          ? parsed
          : { bookmarkedArticles: [] }
      } else {
        bookmarks.value = { bookmarkedArticles: [] }
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      bookmarks.value = { bookmarkedArticles: [] }
    } finally {
      isLoading.value = false
    }
  }

  const saveBookmarks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
    } catch (error) {
      console.error('Error saving bookmarks:', error)
    }
  }

  const addBookmark = (article: Article) => {
    if (!article?.url) return
    
    // Check if article already exists
    const exists = bookmarks.value.bookmarkedArticles.some(
      (bookmark) => bookmark.url === article.url
    )
    
    if (!exists) {
      bookmarks.value.bookmarkedArticles.push(article)
      saveBookmarks()
    }
  }

  const removeBookmark = (url: string) => {
    if (!url) return
    
    bookmarks.value.bookmarkedArticles = bookmarks.value.bookmarkedArticles.filter(
      (bookmark) => bookmark.url !== url
    )
    saveBookmarks()
  }

  const isBookmarked = computed(() => {
    const urlSet = new Set(bookmarks.value.bookmarkedArticles.map(article => article.url))
    return (url: string) => urlSet.has(url)
  })

  const bookmarkedArticles = computed(() => bookmarks.value.bookmarkedArticles)

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue)
        if (parsed && Array.isArray(parsed.bookmarkedArticles)) {
          bookmarks.value = parsed
        }
      } catch (error) {
        console.error('Error handling storage change:', error)
      }
    }
  }

  onMounted(() => {
    loadBookmarks()
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return {
    bookmarks,
    bookmarkedArticles,
    addBookmark,
    removeBookmark,
    isBookmarked,
    loadBookmarks,
    isLoading
  }
}
