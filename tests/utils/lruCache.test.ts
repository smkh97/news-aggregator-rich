import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { LRUCache } from "~/utils/lruCache"

describe("LRUCache", () => {
  let cache: LRUCache<string, number>

  beforeEach(() => {
    vi.useFakeTimers()
    cache = new LRUCache<string, number>(3, 1000) // Max size 3, TTL 1000ms
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should store and retrieve values", () => {
    cache.set("a", 1)

    expect(cache.get("a")).toBe(1)
    expect(cache.has("a")).toBe(true)
    expect(cache.size).toBe(1)
  })

  it("should evict oldest items when max size is reached", () => {
    cache.set("a", 1)
    cache.set("b", 2)
    cache.set("c", 3)
    cache.set("d", 4) // This should evict 'a'

    expect(cache.get("a")).toBeNull()
    expect(cache.get("b")).toBe(2)
    expect(cache.get("c")).toBe(3)
    expect(cache.get("d")).toBe(4)
    expect(cache.size).toBe(3)
  })

  it("should expire items after TTL", () => {
    cache.set("a", 1)

    // Advance time past TTL
    vi.advanceTimersByTime(1500)

    expect(cache.get("a")).toBeNull()
    expect(cache.has("a")).toBe(false)
  })

  it("should move recently accessed items to the end", () => {
    cache.set("a", 1)
    cache.set("b", 2)
    cache.set("c", 3)

    // Access 'a' to move it to the end
    cache.get("a")

    // Add a new item, which should evict 'b' (now the oldest)
    cache.set("d", 4)

    expect(cache.get("a")).toBe(1)
    expect(cache.get("b")).toBeNull()
    expect(cache.get("c")).toBe(3)
    expect(cache.get("d")).toBe(4)
  })

  it("should delete items", () => {
    cache.set("a", 1)
    cache.set("b", 2)

    cache.delete("a")

    expect(cache.get("a")).toBeNull()
    expect(cache.get("b")).toBe(2)
    expect(cache.size).toBe(1)
  })

  it("should clear all items", () => {
    cache.set("a", 1)
    cache.set("b", 2)

    cache.clear()

    expect(cache.get("a")).toBeNull()
    expect(cache.get("b")).toBeNull()
    expect(cache.size).toBe(0)
  })
})

