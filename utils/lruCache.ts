interface CacheItem<T> {
  value: T
  timestamp: number
}

export class LRUCache<K, V> {
  private cache: Map<K, CacheItem<V>>
  private maxSize: number
  private ttl: number

  constructor(maxSize: number = 100, ttl: number = 60000) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  set(key: K, value: V): void {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next()
      if (!firstKey.done) {
        this.cache.delete(firstKey.value)
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key: K): V | null {
    const item = this.cache.get(key)
    
    if (!item) return null

    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    // Move item to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, item)

    return item.value
  }

  has(key: K): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: K): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
} 