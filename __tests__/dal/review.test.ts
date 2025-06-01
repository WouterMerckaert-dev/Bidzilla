import {prismaClient} from '@/lib/server/dal/utils/prismaClient'
import {deleteReview, getReviewsForUser} from '@dal'
import {vi, describe, expect, it, Mock} from 'vitest'

// Mocking prismaClient
vi.mock('@/lib/server/dal/utils/prismaClient', () => ({
  prismaClient: {
    review: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('Review service', () => {
  const reviewerId = 'cm5h4gqrr0000tkj47l5z0271' // Gebruik een voorbeeld CUID
  const revieweeId = 'cm5h4gqrr0001tkj4gg4r333i' // Gebruik een voorbeeld CUID

  const mockReview = {
    id: '1',
    rating: 5,
    content: 'Great review!',
    reviewerId,
    revieweeId,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviewer: {
      id: reviewerId,
      username: 'reviewerUsername',
    },
    reviewee: {
      id: revieweeId,
      username: 'revieweeUsername',
    },
  }

  it('should delete a review', async () => {
    // Arrange
    const reviewId = '1'
    const reviewerId = 'reviewer1'

    // Mocking the Prisma call
    ;(prismaClient.review.delete as Mock).mockResolvedValue(mockReview)

    // Act
    await deleteReview(reviewId, reviewerId)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaClient.review.delete).toHaveBeenCalledWith({
      where: {id: reviewId, reviewerId},
    })
  })

  it('should get reviews for a user', async () => {
    // Arrange
    const userId = 'reviewee1'

    // Mocking the Prisma call
    ;(prismaClient.review.findMany as Mock).mockResolvedValue([mockReview])

    // Act
    const result = await getReviewsForUser(userId)

    // Assert
    expect(result).toEqual([mockReview])
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaClient.review.findMany).toHaveBeenCalledWith({
      where: {revieweeId: userId},
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
  })
})
