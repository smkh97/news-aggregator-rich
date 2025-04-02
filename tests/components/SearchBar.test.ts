import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '~/components/SearchBar.vue'

describe('SearchBar', () => {
  const mountComponent = (props = {}) => {
    return mount(SearchBar, {
      props,
      global: {
        stubs: {
          'Icon': true
        }
      }
    })
  }

  it('renders with default values', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('select').element.value).toBe('publishedAt')
    expect(wrapper.find('input[type="search"]').element.value).toBe('')
  })

  it('initializes with provided query and sort values', () => {
    const wrapper = mountComponent({
      initialQuery: 'test query',
      initialSortBy: 'relevancy'
    })
    expect(wrapper.find('input[type="search"]').element.value).toBe('test query')
    expect(wrapper.find('select').element.value).toBe('relevancy')
  })

  it('emits search event on form submission', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="search"]')
    const form = wrapper.find('form')

    await input.setValue('test search')
    await form.trigger('submit')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test search', 'publishedAt'])
  })

  it('does not emit search event if input is empty', async () => {
    const wrapper = mountComponent()
    const form = wrapper.find('form')

    await form.trigger('submit')
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('does not emit search event if input contains only whitespace', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="search"]')
    const form = wrapper.find('form')

    await input.setValue('   ')
    await form.trigger('submit')
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('emits search event when sort value changes with non-empty query', async () => {
    const wrapper = mountComponent({
      initialQuery: 'test query'
    })
    const select = wrapper.find('select')

    await select.setValue('relevancy')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test query', 'relevancy'])
  })

  it('does not emit search event when sort value changes with empty query', async () => {
    const wrapper = mountComponent()
    const select = wrapper.find('select')

    await select.setValue('relevancy')
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('trims whitespace from search query', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="search"]')
    const form = wrapper.find('form')

    await input.setValue('  test search  ')
    await form.trigger('submit')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test search', 'publishedAt'])
  })

  it('maintains sort value when submitting new search', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="search"]')
    const select = wrapper.find('select')
    const form = wrapper.find('form')

    await select.setValue('relevancy')
    await input.setValue('test search')
    await form.trigger('submit')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test search', 'relevancy'])
  })

  it('has required search input field', () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="search"]')
    expect(input.attributes('required')).toBeDefined()
  })

  it('has correct sort options', () => {
    const wrapper = mountComponent()
    const options = wrapper.find('select').findAll('option')
    
    expect(options).toHaveLength(3)
    expect(options[0].text()).toBe('Latest')
    expect(options[0].element.value).toBe('publishedAt')
    expect(options[1].text()).toBe('Relevance')
    expect(options[1].element.value).toBe('relevancy')
    expect(options[2].text()).toBe('Popularity')
    expect(options[2].element.value).toBe('popularity')
  })
}) 