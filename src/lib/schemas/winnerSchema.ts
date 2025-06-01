import {z} from 'zod'

export const winnerSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  auctionId: z.string().cuid(),
  userId: z.string().cuid(),
  finalPrice: z.number().positive({message: 'Final price must be a positive number.'}),
})

export type Winner = z.infer<typeof winnerSchema>

export const createWinnerSchema = winnerSchema.omit({id: true, createdAt: true})

export const winnerDetailsSchema = winnerSchema.extend({
  auctionTitle: z.string(),
  winnerUsername: z.string(),
})
