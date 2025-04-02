import { createPinia, setActivePinia } from "pinia"
import { mount, shallowMount, type VueWrapper } from "@vue/test-utils"
import { vi } from "vitest"
import type { Component } from "vue"

/**
 * Setup Pinia for testing
 * @returns Configured Pinia instance
 */
export function setupPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mock localStorage for testing
 */
export function mockLocalStorage() {
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString()
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      length: Object.keys(store).length,
    }
  })()

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  })

  return localStorageMock
}

/**
 * Mock IntersectionObserver for testing
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  window.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

/**
 * Create a wrapper for testing Vue components
 * @param component Component to mount
 * @param options Mount options
 * @returns Vue test wrapper
 */
export function createWrapper<T extends Component>(component: T, options: any = {}): VueWrapper {
  return mount(component, {
    global: {
      plugins: [setupPinia()],
      stubs: {
        NuxtLink: true,
        "nuxt-icon": true,
        transition: false,
        "client-only": true,
      },
      ...options?.global,
    },
    ...options,
  })
}

/**
 * Create a shallow wrapper for testing Vue components
 * @param component Component to shallow mount
 * @param options Mount options
 * @returns Vue test wrapper
 */
export function createShallowWrapper<T extends Component>(component: T, options: any = {}): VueWrapper {
  return shallowMount(component, {
    global: {
      plugins: [setupPinia()],
      stubs: {
        NuxtLink: true,
        "nuxt-icon": true,
        transition: false,
        "client-only": true,
      },
      ...options?.global,
    },
    ...options,
  })
}

