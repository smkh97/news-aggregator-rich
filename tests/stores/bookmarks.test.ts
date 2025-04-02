import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useBookmarksStore } from "~/stores/bookmarks"
import { mockLocalStorage } from "../utils/test-utils"

describe("bookmarksStore", () => {
  let store: ReturnType<typeof useBookmarksStore>
  let localStorageMock: any

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
    setActivePinia(createPinia())
    localStorageMock = mockLocalStorage()
    store = useBookmarksStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with empty bookmarks", () => {
    expect(store.bookmarkedArticles).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it("should add a bookmark", () => {
    store.addBookmark(mockArticle)

    expect(store.bookmarkedArticles).toHaveLength(1)
    expect(store.bookmarkedArticles[0]).toEqual(mockArticle)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "news-bookmarks",
      JSON.stringify({ bookmarkedArticles: [mockArticle] }),
    )
  })

  it("should not add duplicate bookmarks", () => {
    store.addBookmark(mockArticle)
    store.addBookmark(mockArticle)

    expect(store.bookmarkedArticles).toHaveLength(1)
  })

  it("should remove a bookmark", () => {
    store.addBookmark(mockArticle)
    expect(store.bookmarkedArticles).toHaveLength(1)

    store.removeBookmark(mockArticle.url)
    expect(store.bookmarkedArticles).toHaveLength(0)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("news-bookmarks", JSON.stringify({ bookmarkedArticles: [] }))
  })

  it("should check if URL is bookmarked", () => {
    store.addBookmark(mockArticle)

    expect(store.isBookmarked(mockArticle.url)).toBe(true)
    expect(store.isBookmarked("https://other-url.com")).toBe(false)
  })

  it("should load bookmarks from localStorage", () => {
    const storedBookmarks = { bookmarkedArticles: [mockArticle] }
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedBookmarks))

    store.loadBookmarks()

    expect(store.bookmarkedArticles).toEqual(storedBookmarks.bookmarkedArticles)
    expect(localStorageMock.getItem).toHaveBeenCalledWith("news-bookmarks")
  })

  it("should handle invalid localStorage data", () => {
    localStorageMock.getItem.mockReturnValueOnce("invalid-json")

    store.loadBookmarks()

    expect(store.bookmarkedArticles).toEqual([])
  })
})

