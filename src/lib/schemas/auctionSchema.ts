import {z} from 'zod'

export const auctionStatusEnum = z.enum(['ACTIVE', 'ENDED', 'CANCELLED'])

export const auctionSchema = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(3, {message: 'Title must be at least 3 characters long.'})
    .max(100, {message: 'Title cannot be longer than 100 characters.'}),
  description: z
    .string()
    .min(10, {message: 'Description must be at least 10 characters long.'})
    .max(1000, {message: 'Description cannot be longer than 1000 characters.'}),
  startPrice: z.number().positive({message: 'Start price must be a positive number.'}),
  currentPrice: z.number().positive({message: 'Current price must be a positive number.'}),
  startDate: z.date(),
  endDate: z.date(),
  image: z.string().url({message: 'Invalid image URL.'}).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: auctionStatusEnum,
  sellerId: z.string().cuid(),
  categoryId: z.string().cuid(),
})

export type Auction = z.infer<typeof auctionSchema>

export const createAuctionSchema = z.object({
  title: z
    .string()
    .min(3, {message: 'Title must be at least 3 characters long.'})
    .max(100, {message: 'Title cannot be longer than 100 characters.'}),
  description: z
    .string()
    .min(10, {message: 'Description must be at least 10 characters long.'})
    .max(1000, {message: 'Description cannot be longer than 1000 characters.'}),
  startPrice: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Start price must be a positive number.',
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format.',
  }),
  categoryId: z.string().cuid(),
  image: z.string().url({message: 'Invalid image URL.'}).optional().nullable(),
})

export const updateAuctionSchema = auctionSchema
  .pick({title: true, description: true, endDate: true, image: true})
  .partial()
  .extend({
    endDate: z.coerce.date().refine(date => date instanceof Date && !isNaN(date.getTime()), {
      message: 'Invalid date format.',
    }),
  })

export const auctionListItemSchema = auctionSchema.pick({
  id: true,
  title: true,
  currentPrice: true,
  endDate: true,
  image: true,
})
