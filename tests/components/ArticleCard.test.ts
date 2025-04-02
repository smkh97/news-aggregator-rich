import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ArticleCard from '~/components/ArticleCard.vue'
import { useBookmarksStore } from '~/stores/bookmarks'

const mockArticle = {
  source: {
    id: '1',
    name: 'Test Source'
  },
  title: 'Test Article Title',
  description: 'Test Description',
  url: 'https://test.com/article',
  urlToImage: 'https://test.com/image.jpg',
  publishedAt: '2024-02-20T12:00:00Z',
  content: 'Test Content'
}

describe('ArticleCard', () => {
  let wrapper: ReturnType<typeof mount>
  let bookmarksStore: ReturnType<typeof useBookmarksStore>

  beforeEach(() => {
    wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            bookmarks: {
              bookmarkedArticles: []
            }
          }
        })],
        stubs: {
          'Icon': {
            template: '<div :data-icon-name="name"></div>',
            props: ['name']
          },
          'LazyImage': true
        }
      }
    })
    bookmarksStore = useBookmarksStore()
  })

  it('renders article information correctly', () => {
    expect(wrapper.text()).toContain('Test Source')
    expect(wrapper.text()).toContain('Test Article Title')
    expect(wrapper.text()).toContain('Test Description')
    expect(wrapper.text()).toContain('Feb 20, 2024')
  })

  it('renders LazyImage when urlToImage is provided', () => {
    expect(wrapper.findComponent({ name: 'LateImage' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'LateImage' }).props('src')).toBe(mockArticle.urlToImage)
  })

  it('renders fallback when urlToImage is not provided', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        urlToImage: null
      }
    })
    expect(wrapper.findComponent({ name: 'LazyImage' }).exists()).toBe(false)
    expect(wrapper.find('.bg-muted').exists()).toBe(true)
  })

  it('truncates long title and description', async () => {
    const longTitle = 'a'.repeat(150)
    const longDescription = 'b'.repeat(200)
    await wrapper.setProps({
      article: {
        ...mockArticle,
        title: longTitle,
        description: longDescription
      }
    })
    expect(wrapper.text()).not.toContain(longTitle)
    expect(wrapper.text()).not.toContain(longDescription)
    expect(wrapper.text()).toContain('...')
  })

  it('handles missing description', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        description: null
      }
    })
    expect(wrapper.text()).toContain('No description available')
  })

  it('handles missing source name', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        source: {
          id: '1',
          name: null
        }
      }
    })
    expect(wrapper.text()).toContain('Unknown Source')
  })

  it('handles missing date', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        publishedAt: null
      }
    })
    expect(wrapper.text()).toContain('Unknown Date')
  })

  it('toggles bookmark state correctly', async () => {
    const bookmarkButton = wrapper.find('button')
    
    // Initial state - not bookmarked
    expect(wrapper.find('[data-icon-name="lucide:bookmark"]').exists()).toBe(true)
    
    // Add bookmark
    await bookmarkButton.trigger('click')
    expect(bookmarksStore.addBookmark).toHaveBeenCalledWith(mockArticle)
    
    // Simulate bookmarked state
    bookmarksStore.bookmarkedArticles.push(mockArticle)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-icon-name="lucide:bookmark-check"]').exists()).toBe(true)
    
    // Remove bookmark
    await bookmarkButton.trigger('click')
    expect(bookmarksStore.removeBookmark).toHaveBeenCalledWith(mockArticle.url)
    expect(wrapper.emitted('bookmark-removed')).toBeTruthy()
    expect(wrapper.emitted('bookmark-removed')[0]).toEqual([mockArticle.url])
  })

  it('disables bookmark toggle when url is missing', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        url: null
      }
    })
    const bookmarkButton = wrapper.find('button')
    await bookmarkButton.trigger('click')
    expect(bookmarksStore.addBookmark).not.toHaveBeenCalled()
    expect(bookmarksStore.removeBookmark).not.toHaveBeenCalled()
  })

  it('updates bookmark state when article url changes', async () => {
    const newUrl = 'https://test.com/new-article'
    const newArticle = { ...mockArticle, url: newUrl }
    bookmarksStore.bookmarkedArticles.push(newArticle)
    
    await wrapper.setProps({
      article: newArticle
    })
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-icon-name="lucide:bookmark-check"]').exists()).toBe(true)
  })

  it('disables read more link when url is missing', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        url: null
      }
    })
    const readMoreLink = wrapper.find('a')
    expect(readMoreLink.text()).toContain('No link available')
    expect(readMoreLink.classes()).toContain('pointer-events-none')
  })
}) 