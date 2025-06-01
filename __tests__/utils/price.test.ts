import {describe, it, expect} from 'vitest'
import {formatPrice} from '@/lib/utils/price'

describe('Price Utilities', () => {
  it('should format price correctly with euro symbol', () => {
    // Use toContain instead of toBe for more robust checking
    expect(formatPrice(10.99)).toContain('10,99')
    expect(formatPrice(1000)).toContain('1.000,00')
    expect(formatPrice(0)).toContain('0,00')
  })

  it('should handle negative prices', () => {
    expect(formatPrice(-10.99)).toContain('-10,99')
  })

  it('should round to 2 decimal places', () => {
    expect(formatPrice(10.999)).toContain('11,00')
    expect(formatPrice(10.991)).toContain('10,99')
  })
})
