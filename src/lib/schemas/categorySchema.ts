import {z} from 'zod'

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(2, {message: 'Category name must be at least 2 characters long.'})
    .max(50, {message: 'Category name cannot be longer than 50 characters.'}),
})

export type Category = z.infer<typeof categorySchema>

export const createCategorySchema = categorySchema.omit({id: true})

export const updateCategorySchema = categorySchema.pick({name: true})
