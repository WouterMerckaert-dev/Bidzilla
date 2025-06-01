import {z} from 'zod'

export const sessionSchema = z.object({
  id: z.string().uuid(),
  activeFrom: z.date(),
  activeUntil: z.date(),
  userId: z.string().cuid(),
})

export type Session = z.infer<typeof sessionSchema>

export const createSessionSchema = sessionSchema.omit({id: true})

export const updateSessionSchema = sessionSchema.pick({activeUntil: true})
