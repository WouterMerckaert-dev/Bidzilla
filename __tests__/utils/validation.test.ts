import {describe, it, expect} from 'vitest'
import {validateAuctionEndDate, validateStartPrice} from '@/lib/utils/validation'

describe('Auction Validation', () => {
  it('should validate end date is in the future', () => {
    const pastDate = new Date(Date.now() - 86400000) // Yesterday
    const futureDate = new Date(Date.now() + 86400000) // Tomorrow

    expect(validateAuctionEndDate(pastDate)).toBe(false)
    expect(validateAuctionEndDate(futureDate)).toBe(true)
  })

  it('should validate start price is positive', () => {
    expect(validateStartPrice(-10)).toBe(false)
    expect(validateStartPrice(0)).toBe(false)
    expect(validateStartPrice(10)).toBe(true)
  })
})
