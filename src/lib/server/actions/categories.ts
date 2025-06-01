'use server'

import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {ActionResponse} from '@/lib/models/actions'
import {formAction} from '@mediators'
import {createCategorySchema} from '@schemas'
import {Category} from '@/lib/models/categories'

export async function createCategory(
  _prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse & {category?: Category}> {
  return formAction(createCategorySchema, formData, async data => {
    try {
      const newCategory = await DAL.createCategory(data as Category)
      revalidatePath('/categories')
      return {
        success: true,
        message: 'Categorie succesvol aangemaakt.',
        category: newCategory,
      }
    } catch (error) {
      console.error('Error in createCategory:', error)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Er is een fout opgetreden bij het aanmaken van de categorie.',
        errors: error instanceof Error ? {_form: [error.message]} : undefined,
      }
    }
  })
}
export async function getCategories() {
  return DAL.getCategories()
}
