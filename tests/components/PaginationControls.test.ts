import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginationControls from '~/components/PaginationControls.vue'

describe('PaginationControls', () => {
  const mountComponent = (props = {}) => {
    return mount(PaginationControls, {
      props: {
        currentPage: 1,
        totalPages: 5,
        loading: false,
        hasMore: true,
        ...props
      },
      global: {
        stubs: {
          Icon: true
        }
      }
    })
  }


  it('emits change event when clicking page numbers', async () => {
    const wrapper = mountComponent()
    const pageButton = wrapper.findAll('button')[1]

    await pageButton.trigger('click')
    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([2])
  })

  it('disables buttons when loading', () => {
    const wrapper = mountComponent({ loading: true })
    const buttons = wrapper.findAll('button')

    buttons.forEach(button => {
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  it('shows correct page numbers based on current page', () => {
    const wrapper = mountComponent({ currentPage: 3 })
    const pageButtons = wrapper.findAll('button').slice(1, -1)

    expect(pageButtons[0].text()).toBe('1')
    expect(pageButtons[1].text()).toBe('2')
    expect(pageButtons[2].text()).toBe('3')
    expect(pageButtons[3].text()).toBe('4')
    expect(pageButtons[4].text()).toBe('5')
  })

 

  it('applies correct styling to current and non-current pages', () => {
    const wrapper = mountComponent({ currentPage: 3 })
    const pageButtons = wrapper.findAll('button').slice(1, -1)

    // Current page (3)
    expect(pageButtons[2].classes()).toContain('bg-primary')
    expect(pageButtons[2].classes()).toContain('text-primary-foreground')

    // Non-current pages
    expect(pageButtons[0].classes()).not.toContain('bg-primary')
    expect(pageButtons[0].classes()).not.toContain('text-primary-foreground')
  })

  it('handles large page numbers correctly', () => {
    const wrapper = mountComponent({ currentPage: 5, totalPages: 10 })
    const pageButtons = wrapper.findAll('button').slice(1, -1)

    // Should show 5 pages around current page
    expect(pageButtons).toHaveLength(5)
    expect(pageButtons[0].text()).toBe('3')
    expect(pageButtons[1].text()).toBe('4')
    expect(pageButtons[2].text()).toBe('5')
    expect(pageButtons[3].text()).toBe('6')
    expect(pageButtons[4].text()).toBe('7')
  })
}) 