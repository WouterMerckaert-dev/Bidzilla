import {createReview, updateReview, deleteReview} from '@/lib/server/actions/reviews'
import * as DAL from '@/lib/server/dal/reviews'
import {getSessionProfileAndOptionallyRenew} from '@mediators'
import {revalidatePath} from 'next/cache'
import {Review} from '@/lib/models/reviews'
import {beforeEach, describe, expect, it, vi, Mock} from 'vitest'

// Mock noodzakelijke modules
vi.mock('server-only', () => ({
  default: vi.fn(),
}))
vi.mock('@/lib/server/dal/reviews', () => ({
  createReview: vi.fn(),
  updateReview: vi.fn(),
  deleteReview: vi.fn(),
  getReview: vi.fn(),
  getReviews: vi.fn(),
}))

vi.mock('@mediators', () => ({
  getSessionProfileAndOptionallyRenew: vi.fn(),
  formAction: vi.fn(async (schema, formData, callback) => {
    // Simuleer de data die uit het formulier komt
    const data = {
      rating: 5,
      content: 'This is a test review',
      revieweeId: '1',
    }
    const profile = {id: '1', username: 'reviewer1'}

    // Roep de callback aan met de gesimuleerde data en profiel
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
    return await callback(data, profile)
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockReview: Review = {
  id: '1',
  content: 'This is a test review',
  rating: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  reviewerId: '1',
  revieweeId: '2',
  reviewer: {id: '1', username: 'reviewer1'},
  reviewee: {id: '2', username: 'reviewee2'},
}

const mockProfile = {id: '1', username: 'reviewer1'}
const mockFormData = new FormData()
mockFormData.append('rating', '5')
mockFormData.append('content', 'This is a test review')
mockFormData.append('revieweeId', '1')

describe('Review Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getSessionProfileAndOptionallyRenew as Mock).mockResolvedValue(mockProfile)
  })

  it('should handle errors during review creation', async () => {
    ;(DAL.createReview as Mock).mockRejectedValueOnce(new Error('Je kunt geen review voor jezelf achterlaten'))
    const result = await createReview({success: false, message: ''}, mockFormData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Je kunt geen review voor jezelf achterlaten')
  })

  it('should handle errors during review update', async () => {
    ;(DAL.updateReview as Mock).mockRejectedValueOnce(
      new Error('Er is een fout opgetreden bij het bijwerken van de review.'),
    )
    const result = await updateReview('1', {success: false, message: ''}, mockFormData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Er is een fout opgetreden bij het bijwerken van de review.')
  })

  it('should delete a review successfully', async () => {
    ;(DAL.deleteReview as Mock).mockResolvedValue(undefined)
    const result = await deleteReview('1')

    expect(result.success).toBe(true)
    expect(result.message).toBe('Review succesvol verwijderd.')
    // Controleer dat de juiste URL wordt aangeroepen na de verwijdering
    expect(revalidatePath).toHaveBeenCalledWith('/reviews')
  })

  it('should handle errors during review deletion', async () => {
    ;(DAL.deleteReview as Mock).mockRejectedValueOnce(
      new Error('Er is een fout opgetreden bij het verwijderen van de review.'),
    )
    const result = await deleteReview('1')

    expect(result.success).toBe(false)
    expect(result.message).toContain('Er is een fout opgetreden bij het verwijderen van de review.')
  })
})
