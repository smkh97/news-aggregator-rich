import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import NewsGrid from '~/components/NewsGrid.vue'

const mockArticles = [
  {
    source: { id: '1', name: 'Test Source' },
    title: 'Test Article 1',
    description: 'Test Description 1',
    url: 'https://test.com/article1',
    urlToImage: 'https://test.com/image1.jpg',
    publishedAt: '2024-02-20T12:00:00Z',
    content: 'Test Content 1'
  },
  {
    source: { id: '2', name: 'Test Source 2' },
    title: 'Test Article 2',
    description: 'Test Description 2',
    url: 'https://test.com/article2',
    urlToImage: 'https://test.com/image2.jpg',
    publishedAt: '2024-02-20T13:00:00Z',
    content: 'Test Content 2'
  }
]

vi.mock('~/composables/useInfiniteScroll', () => ({
  useInfiniteScroll: vi.fn(() => ({
    target: ref(null),
    isLoading: ref(false)
  }))
}))

describe('NewsGrid', () => {
  const loadMore = vi.fn()

  const mountComponent = (props = {}) => {
    return mount(NewsGrid, {
      props: {
        articles: [],
        loading: false,
        error: null,
        hasMore: false,
        isApiKeyError: false,
        loadMore,
        ...props
      },
      global: {
        stubs: {
          'ArticleCard': {
            name: 'ArticleCard',
            template: '<div class="article-card" :data-article="JSON.stringify(article)"></div>',
            props: ['article']
          },
          'ArticleSkeleton': true,
          'Icon': true
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeletons when loading and no articles', () => {
    const wrapper = mountComponent({ loading: true, articles: [] })
    expect(wrapper.findAllComponents({ name: 'ArticleSkeleton' })).toHaveLength(6)
  })

  it('renders articles when available', () => {
    const wrapper = mountComponent({ articles: mockArticles })
    const articleCards = wrapper.findAllComponents({ name: 'ArticleCard' })
    expect(articleCards).toHaveLength(2)
    const firstArticle = articleCards[0].attributes('data-article')
    const secondArticle = articleCards[1].attributes('data-article')
    expect(firstArticle).toBeDefined()
    expect(secondArticle).toBeDefined()
    expect(JSON.parse(firstArticle!)).toEqual(mockArticles[0])
    expect(JSON.parse(secondArticle!)).toEqual(mockArticles[1])
  })

  it('renders error state with message', () => {
    const wrapper = mountComponent({ error: 'Failed to load articles' })
    expect(wrapper.text()).toContain('Error Loading Articles')
    expect(wrapper.text()).toContain('Failed to load articles')
  })

  it('renders API key error details when isApiKeyError is true', () => {
    const wrapper = mountComponent({
      error: 'API Key Error',
      isApiKeyError: true
    })
    expect(wrapper.text()).toContain('API Key Issue')
    expect(wrapper.text()).toContain('Your API key is valid and active')
    expect(wrapper.text()).toContain('You haven\'t exceeded your API request limits')
    expect(wrapper.text()).toContain('The API key is correctly set in your environment variables')
  })

  it('renders empty state when no articles and not loading', () => {
    const wrapper = mountComponent({ articles: [], loading: false })
    expect(wrapper.text()).toContain('No Articles Found')
    expect(wrapper.text()).toContain('Try a different search or category')
  })

  it('shows load more trigger when hasMore is true', () => {
    const wrapper = mountComponent({
      articles: mockArticles,
      hasMore: true
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('does not show load more trigger when hasMore is false', () => {
    const wrapper = mountComponent({
      articles: mockArticles,
      hasMore: false
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('does not show load more trigger when loading', () => {
    const wrapper = mountComponent({
      articles: mockArticles,
      hasMore: true,
      loading: true
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('updates infinite scroll target when loadMoreTrigger changes', async () => {
    const wrapper = mountComponent({
      articles: mockArticles,
      hasMore: true
    })
    const loadMoreTrigger = wrapper.find('[role="status"]').element
    expect(loadMoreTrigger).toBeTruthy()
  })

  it('does not render skeletons when loading but has articles', () => {
    const wrapper = mountComponent({
      loading: true,
      articles: mockArticles
    })
    expect(wrapper.findAllComponents({ name: 'ArticleSkeleton' })).toHaveLength(0)
    expect(wrapper.findAllComponents({ name: 'ArticleCard' })).toHaveLength(2)
  })
}) 