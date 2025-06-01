import {z} from 'zod'

export const reviewSchema = z.object({
  id: z.string().cuid(),
  rating: z
    .number()
    .int()
    .min(1, {message: 'Rating must be at least 1.'})
    .max(5, {message: 'Rating cannot be higher than 5.'}),
  content: z
    .string()
    .min(10, {message: 'Review content must be at least 10 characters long.'})
    .max(500, {message: 'Review content cannot be longer than 500 characters.'}),
  createdAt: z.date(),
  updatedAt: z.date(),
  reviewerId: z.string().cuid(),
  revieweeId: z.string().cuid(),
  reviewer: z.object({
    id: z.string(),
    username: z.string(),
  }),
  reviewee: z.object({
    id: z.string(),
    username: z.string(),
  }),
})

export type Review = z.infer<typeof reviewSchema>

export const createReviewSchema = z.object({
  revieweeId: z.string().cuid(),
  rating: z.coerce.number().int().min(1).max(5),
  content: z
    .string()
    .min(10, {message: 'Review content must be at least 10 characters long.'})
    .max(500, {message: 'Review content cannot be longer than 500 characters.'}),
})

export const updateReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  content: z
    .string()
    .min(10, {message: 'Review content must be at least 10 characters long.'})
    .max(500, {message: 'Review content cannot be longer than 500 characters.'}),
})

export const reviewListItemSchema = reviewSchema.pick({
  id: true,
  rating: true,
  content: true,
  createdAt: true,
  reviewerId: true,
})
