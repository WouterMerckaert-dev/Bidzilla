'use server'

import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {ActionResponse} from '@/lib/models/actions'
import {formAction} from '@mediators'
import {createBidSchema} from '@schemas'
import {Bid} from '@/lib/models/bids'
import {requireAuth} from '@/lib/server/auth'

export async function createBid(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  return formAction(createBidSchema, formData, async data => {
    try {
      const profile = await requireAuth()
      const bidData: Omit<Bid, 'id' | 'createdAt' | 'user'> = {
        amount: Number(data.amount),
        userId: profile.id,
        auctionId: data.auctionId,
      }

      const createdBid = await DAL.createBid(bidData)

      if (!createdBid) {
        throw new Error('Failed to create bid')
      }

      revalidatePath(`/auctions/${data.auctionId}`)
      return {success: true, message: 'Bod succesvol geplaatst.'}
    } catch (error) {
      console.error('Error in createBid:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het plaatsen van het bod.',
        errors: error instanceof Error ? {_form: [error.message]} : undefined,
      }
    }
  })
}

export async function getBidsForAuction(auctionId: string) {
  return DAL.getBidsForAuction(auctionId)
}
