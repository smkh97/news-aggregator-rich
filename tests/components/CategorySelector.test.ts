import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CategorySelector from '~/components/CategorySelector.vue'
import { useEventBus } from '~/composables/useEventBus'

vi.mock('~/composables/useEventBus', () => ({
  useEventBus: vi.fn()
}))

describe('CategorySelector', () => {
  const eventBus = {
    on: vi.fn(),
    off: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useEventBus as any).mockReturnValue(eventBus)
  })

  const mountComponent = (props = {}) => {
    return mount(CategorySelector, {
      props: {
        currentCategory: '',
        ...props
      },
      global: {
        stubs: {
          Icon: true
        }
      }
    })
  }

  it('renders all categories with correct labels and icons', () => {
    const wrapper = mountComponent()
    
    const categories = wrapper.findAll('button')
    expect(categories).toHaveLength(7) // general, business, technology, science, health, sports, entertainment
    
    const businessButton = categories[1]
    expect(businessButton.text()).toContain('Business')
  })

  it('emits select event when category is clicked', async () => {
    const wrapper = mountComponent()
    const businessButton = wrapper.findAll('button')[1]
    
    await businessButton.trigger('click')
    
    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['business'])
  })

  it('applies correct styling to selected category', () => {
    const wrapper = mountComponent({ currentCategory: 'technology' })
    const technologyButton = wrapper.findAll('button')[2]
    
    expect(technologyButton.classes()).toContain('bg-black')
    expect(technologyButton.classes()).toContain('text-white')
  })

  it('sets up and cleans up event listener on mount/unmount', () => {
    const wrapper = mountComponent()
    expect(eventBus.on).toHaveBeenCalledWith('select-category', expect.any(Function))

    wrapper.unmount()
    expect(eventBus.off).toHaveBeenCalledWith('select-category', expect.any(Function))
  })

  it('handles event bus category selection', async () => {
    const wrapper = mountComponent()
    const handler = eventBus.on.mock.calls[0][1]

    handler('science')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['science'])
  })
}) 