import {z} from 'zod'

export const bidSchema = z.object({
  id: z.string().cuid(),
  amount: z.number().positive({message: 'Bid amount must be a positive number.'}),
  createdAt: z.date(),
  userId: z.string().cuid(),
  auctionId: z.string().cuid(),
  user: z
    .object({
      id: z.string().cuid(),
      username: z.string(),
    })
    .optional(),
})

export type Bid = z.infer<typeof bidSchema>

export const createBidSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Bid amount must be a positive number.',
  }),
  auctionId: z.string().cuid(),
})

export const bidListItemSchema = bidSchema.pick({id: true, amount: true, createdAt: true, userId: true})
