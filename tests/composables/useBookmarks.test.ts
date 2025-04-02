import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { useBookmarks } from "~/composables/useBookmarks"
import { mockLocalStorage } from "../utils/test-utils"
import { nextTick } from "vue"
import { createApp, defineComponent } from "vue"

describe("useBookmarks", () => {
  let bookmarks: ReturnType<typeof useBookmarks>
  let localStorageMock: any
  let app: any

  const mockArticle = {
    source: { id: "test-source", name: "Test Source" },
    title: "Test Article",
    description: "Test Description",
    url: "https://test.com/article",
    urlToImage: "https://test.com/image.jpg",
    publishedAt: "2023-01-01T00:00:00Z",
    content: "Test content",
  }

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.spyOn(window, "addEventListener")
    vi.spyOn(window, "removeEventListener")
    
    // Create a Vue app instance to properly handle lifecycle hooks
    app = createApp(defineComponent({
      setup() {
        bookmarks = useBookmarks()
        return {}
      }
    }))
    app.mount(document.createElement("div"))
  })

  afterEach(() => {
    vi.clearAllMocks()
    app.unmount()
  })

  it("should initialize with empty bookmarks", () => {
    expect(bookmarks.bookmarks.value.bookmarkedArticles).toEqual([])
  })

  it("should add a bookmark", () => {
    bookmarks.addBookmark(mockArticle)

    expect(bookmarks.bookmarks.value.bookmarkedArticles).toHaveLength(1)
    expect(bookmarks.bookmarks.value.bookmarkedArticles[0]).toEqual(mockArticle)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "news-bookmarks",
      JSON.stringify({ bookmarkedArticles: [mockArticle] }),
    )
  })

  it("should not add duplicate bookmarks", () => {
    bookmarks.addBookmark(mockArticle)
    bookmarks.addBookmark(mockArticle)

    expect(bookmarks.bookmarks.value.bookmarkedArticles).toHaveLength(1)
  })

  it("should remove a bookmark", () => {
    bookmarks.addBookmark(mockArticle)
    expect(bookmarks.bookmarks.value.bookmarkedArticles).toHaveLength(1)

    bookmarks.removeBookmark(mockArticle.url)
    expect(bookmarks.bookmarks.value.bookmarkedArticles).toHaveLength(0)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("news-bookmarks", JSON.stringify({ bookmarkedArticles: [] }))
  })

  it("should check if URL is bookmarked", () => {
    bookmarks.addBookmark(mockArticle)

    expect(bookmarks.isBookmarked.value(mockArticle.url)).toBe(true)
    expect(bookmarks.isBookmarked.value("https://other-url.com")).toBe(false)
  })

  it("should load bookmarks from localStorage", () => {
    const storedBookmarks = { bookmarkedArticles: [mockArticle] }
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedBookmarks))

    bookmarks.loadBookmarks()

    expect(bookmarks.bookmarks.value).toEqual(storedBookmarks)
    expect(localStorageMock.getItem).toHaveBeenCalledWith("news-bookmarks")
  })

  it("should handle invalid localStorage data", () => {
    localStorageMock.getItem.mockReturnValueOnce("invalid-json")

    bookmarks.loadBookmarks()

    expect(bookmarks.bookmarks.value).toEqual({ bookmarkedArticles: [] })
  })

  it("should handle storage events", async () => {
    const newBookmarks = { bookmarkedArticles: [mockArticle] }
    
    // Wait for component to mount
    await nextTick()
    
    const storageEvent = new StorageEvent("storage", {
      key: "news-bookmarks",
      newValue: JSON.stringify(newBookmarks),
    })

    window.dispatchEvent(storageEvent)

    // Verify the event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith("storage", expect.any(Function))
    
    // Wait for the event to be processed
    await nextTick()
    
    // Verify the bookmarks were updated
    expect(bookmarks.bookmarks.value).toEqual(newBookmarks)
  })
})

