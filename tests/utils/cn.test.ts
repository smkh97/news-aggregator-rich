import { describe, it, expect } from 'vitest'
import { cn } from '~/utils/cn'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class')
    expect(result).toBe('base-class additional-class')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', { 'conditional-class': true, 'unused-class': false })
    expect(result).toBe('base-class conditional-class')
  })

  it('should handle multiple conditional classes', () => {
    const result = cn(
      'base-class',
      { 'true-class': true, 'false-class': false },
      { 'another-true': true, 'another-false': false }
    )
    expect(result).toBe('base-class true-class another-true')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null)
    expect(result).toBe('base-class')
  })

  it('should handle array inputs', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle object inputs with nested arrays', () => {
    const result = cn('base-class', { 'true-class': ['nested1', 'nested2'] })
    expect(result).toBe('base-class true-class')
  })
}) 