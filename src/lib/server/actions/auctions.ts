'use server'

import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {ActionResponse} from '@/lib/models/actions'
import {formAction, getSessionProfileAndOptionallyRenew} from '@mediators'
import {createAuctionSchema, updateAuctionSchema} from '@schemas'
import {AuctionCreateInput} from '@/lib/models/auctions'

export async function createAuction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  return formAction(createAuctionSchema, formData, async (data, profile) => {
    try {
      const auctionData: AuctionCreateInput = {
        title: data.title,
        description: data.description,
        startPrice: Number(data.startPrice),
        endDate: new Date(data.endDate),
        startDate: new Date(),
        sellerId: profile.id,
        categoryId: data.categoryId || '', // Provide a default empty string if categoryId is undefined
        image: data.image || null,
      }

      const createdAuction = await DAL.createAuction(auctionData)

      if (!createdAuction) {
        throw new Error('Failed to create auction')
      }

      revalidatePath('/auctions')
      return {success: true, message: 'Veiling succesvol aangemaakt.'}
    } catch (error) {
      console.error('Error in createAuction:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het aanmaken van de veiling.',
        errors: error instanceof Error ? {_form: [error.message]} : undefined,
      }
    }
  })
}

export async function updateAuction(
  id: string,
  _prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  return formAction(updateAuctionSchema, formData, async (data, profile) => {
    try {
      await DAL.updateAuction(id, data, profile.id)
      revalidatePath(`/auctions/${id}`)
      return {success: true, message: 'Veiling succesvol bijgewerkt.'}
    } catch (error) {
      console.error('Error updating auction:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het bijwerken van de veiling.',
        errors: error instanceof Error ? {_form: [error.message]} : undefined,
      }
    }
  })
}

export async function deleteAuction(id: string): Promise<ActionResponse> {
  const profile = await getSessionProfileAndOptionallyRenew()
  console.log('Profile ID:', profile.id)

  try {
    await DAL.deleteAuction(id, profile.id)
    revalidatePath('/profile')
    return {success: true, message: 'Veiling succesvol verwijderd.'}
  } catch (error) {
    console.error('Error deleting auction:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return {
      success: false,
      message: `Er is een fout opgetreden bij het verwijderen van de veiling: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`,
    }
  }
}

export async function getAuction(id: string) {
  return DAL.getAuction(id)
}

export async function getAuctions(searchParams?: {[key: string]: string | string[] | undefined}) {
  const categoryId =
    searchParams?.category && typeof searchParams.category === 'string' ? searchParams.category : undefined
  const active = searchParams?.active === 'true'
  const sortByEndDate = searchParams?.sort === 'endDate'

  return DAL.getAuctions({categoryId, active, sortByEndDate})
}

export async function getUserAuctions(userId: string) {
  try {
    const userAuctions = await DAL.getUserAuctions(userId)
    return userAuctions
  } catch (error) {
    console.error('Error fetching user auctions:', error)
    throw new Error('Failed to fetch user auctions')
  }
}
