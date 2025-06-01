import 'server-only'
import {prismaClient} from './utils/prismaClient'
import {Category} from '@/lib/models/categories'
import {categorySchema} from '@/lib/schemas'

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const validatedData = categorySchema.omit({id: true}).parse(data)
  return await prismaClient.category.create({
    data: validatedData,
  })
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const validatedData = categorySchema.partial().parse(data)
  return await prismaClient.category.update({
    where: {id},
    data: validatedData,
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await prismaClient.category.delete({
    where: {id},
  })
}

export async function getCategories(): Promise<Category[]> {
  return await prismaClient.category.findMany()
}
