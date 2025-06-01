import 'server-only'
import {prismaClient} from './utils/prismaClient'
import {Review} from '@/lib/models/reviews'
import {reviewSchema} from '@/lib/schemas'
import {Prisma} from '@prisma/client'

export async function createReview(
  data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Omit<Review, 'reviewer' | 'reviewee'>> {
  const validatedData = reviewSchema.omit({id: true, createdAt: true, updatedAt: true}).parse(data)
  return prismaClient.review.create({
    data: {
      rating: validatedData.rating,
      content: validatedData.content,
      reviewerId: validatedData.reviewerId,
      revieweeId: validatedData.revieweeId,
    },
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      reviewerId: true,
      revieweeId: true,
    },
  })
}

export async function updateReview(
  id: string,
  data: Prisma.ReviewUpdateInput,
  reviewerId: string,
): Promise<Omit<Review, 'reviewer' | 'reviewee'>> {
  const validatedData = reviewSchema.partial().parse(data)
  return prismaClient.review.update({
    where: {id, reviewerId},
    data: {
      rating: validatedData.rating,
      content: validatedData.content,
    },
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      reviewerId: true,
      revieweeId: true,
    },
  })
}

export async function deleteReview(id: string, reviewerId: string): Promise<void> {
  await prismaClient.review.delete({
    where: {id, reviewerId},
  })
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  return prismaClient.review.findMany({
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
}
