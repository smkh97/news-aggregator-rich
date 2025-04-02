import mitt from 'mitt'

type Events = {
  'select-category': string
}

const emitter = mitt<Events>()

export const useEventBus = () => {
  return {
    emit: emitter.emit,
    on: emitter.on,
    off: emitter.off
  }
} 