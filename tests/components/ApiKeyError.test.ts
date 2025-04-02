import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApiKeyError from '~/components/ApiKeyError.vue'

describe('ApiKeyError', () => {
  const mountComponent = (props = {}) => {
    return mount(ApiKeyError, {
      props: {
        error: null,
        isApiKeyError: false,
        ...props
      },
      global: {
        stubs: {
          'Icon': {
            template: '<div :data-icon-name="name"></div>',
            props: ['name']
          }
        }
      }
    })
  }

  it('renders error message when error and isApiKeyError are true', () => {
    const wrapper = mountComponent({
      error: 'Invalid API key',
      isApiKeyError: true
    })
    expect(wrapper.text()).toContain('API Key Error')
    expect(wrapper.text()).toContain('Invalid API key')
    expect(wrapper.find('[data-icon-name="lucide:alert-circle"]').exists()).toBe(true)
  })

  it('does not render when error is null', () => {
    const wrapper = mountComponent({
      error: null,
      isApiKeyError: true
    })
    expect(wrapper.text()).not.toContain('API Key Error')
  })

  it('does not render when isApiKeyError is false', () => {
    const wrapper = mountComponent({
      error: 'Invalid API key',
      isApiKeyError: false
    })
    expect(wrapper.text()).not.toContain('API Key Error')
  })

  it('displays correct environment variable instructions', () => {
    const wrapper = mountComponent({
      error: 'Invalid API key',
      isApiKeyError: true
    })
    expect(wrapper.text()).toContain('NUXT_PUBLIC_NEWS_API_KEY=your_api_key')
  })
}) 