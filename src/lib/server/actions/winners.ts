'use server'

import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {ActionResponse} from '@/lib/models/actions'
import {formAction} from '@mediators'
import {createWinnerSchema} from '@schemas'
import {Winner} from '@/lib/models/winners'

export async function createWinner(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  return formAction(createWinnerSchema, formData, async data => {
    await DAL.createWinner(data as Winner)
    revalidatePath(`/auctions/${data.auctionId}`)
  })
}

export async function getWinnersForUser(userId: string) {
  return DAL.getWinnersForUser(userId)
}
