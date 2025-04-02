import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEventBus } from '~/composables/useEventBus'
import { createApp, defineComponent } from 'vue'

describe('useEventBus', () => {
  let eventBus: ReturnType<typeof useEventBus>
  let app: any

  beforeEach(() => {
    app = createApp(defineComponent({
      setup() {
        eventBus = useEventBus()
        return {}
      }
    }))
    app.mount(document.createElement('div'))
  })

  it('should emit and listen to events', () => {
    const mockCallback = vi.fn()
    const testData = { test: 'data' }

    eventBus.on('test-event', mockCallback)
    eventBus.emit('test-event', testData)

    expect(mockCallback).toHaveBeenCalledWith(testData)
  })

  it('should handle multiple listeners for the same event', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const testData = { test: 'data' }

    eventBus.on('test-event', mockCallback1)
    eventBus.on('test-event', mockCallback2)
    eventBus.emit('test-event', testData)

    expect(mockCallback1).toHaveBeenCalledWith(testData)
    expect(mockCallback2).toHaveBeenCalledWith(testData)
  })

  it('should remove event listeners', () => {
    const mockCallback = vi.fn()
    const testData = { test: 'data' }

    eventBus.on('test-event', mockCallback)
    eventBus.off('test-event', mockCallback)
    eventBus.emit('test-event', testData)

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle events with no data', () => {
    const mockCallback = vi.fn()

    eventBus.on('test-event', mockCallback)
    eventBus.emit('test-event')

    expect(mockCallback).toHaveBeenCalledWith(undefined)
  })

  it('should handle multiple events', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const testData1 = { test: 'data1' }
    const testData2 = { test: 'data2' }

    eventBus.on('event1', mockCallback1)
    eventBus.on('event2', mockCallback2)
    eventBus.emit('event1', testData1)
    eventBus.emit('event2', testData2)

    expect(mockCallback1).toHaveBeenCalledWith(testData1)
    expect(mockCallback2).toHaveBeenCalledWith(testData2)
  })
}) 