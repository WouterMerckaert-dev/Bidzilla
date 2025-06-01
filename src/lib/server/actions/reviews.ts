'use server'

import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {ActionResponse} from '@/lib/models/actions'
import {formAction, getSessionProfileAndOptionallyRenew} from '@mediators'
import {createReviewSchema, updateReviewSchema} from '@schemas'
import {Review} from '@/lib/models/reviews'
import {Prisma} from '@prisma/client'

export async function createReview(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  return formAction(createReviewSchema, formData, async (data, profile) => {
    try {
      if (data.revieweeId === profile.id) {
        return {success: false, message: 'Je kunt geen review voor jezelf achterlaten'}
      }

      const rating = Number(data.rating)
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return {success: false, message: 'Ongeldige beoordeling'}
      }

      // Fetch the reviewee (make sure reviewee is not null)
      const reviewee = await DAL.getUserById(data.revieweeId)
      if (!reviewee) {
        return {success: false, message: 'De opgegeven gebruiker voor de review bestaat niet.'}
      }

      const reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
        revieweeId: data.revieweeId,
        reviewerId: profile.id,
        rating: rating,
        content: data.content,
        reviewer: {
          id: profile.id,
          username: profile.username,
        },
        reviewee: {
          id: reviewee.id,
          username: reviewee.username,
        },
      }

      await DAL.createReview(reviewData)
      revalidatePath(`/users/${data.revieweeId}`)
      return {success: true, message: 'Review succesvol geplaatst.'}
    } catch (error) {
      console.error('Error creating review:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het plaatsen van de review.',
      }
    }
  })
}

export async function updateReview(
  id: string,
  _prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  return formAction(updateReviewSchema, formData, async (data, profile) => {
    try {
      const rating = Number(data.rating)
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return {success: false, message: 'Ongeldige beoordeling'}
      }

      const updateData: Prisma.ReviewUpdateInput = {
        rating: rating,
        content: data.content,
      }
      await DAL.updateReview(id, updateData, profile.id)
      revalidatePath(`/users/${id}`)
      return {success: true, message: 'Review succesvol bijgewerkt.'}
    } catch (error) {
      console.error('Error updating review:', error)
      return {success: false, message: 'Er is een fout opgetreden bij het bijwerken van de review.'}
    }
  })
}

export async function deleteReview(id: string): Promise<ActionResponse> {
  try {
    const profile = await getSessionProfileAndOptionallyRenew()
    await DAL.deleteReview(id, profile.id)
    revalidatePath('/reviews')
    return {success: true, message: 'Review succesvol verwijderd.'}
  } catch (error) {
    console.error('Error deleting review:', error)
    return {success: false, message: 'Er is een fout opgetreden bij het verwijderen van de review.'}
  }
}
