import 'server-only'
import {prismaClient} from './utils/prismaClient'
import {Bid} from '@/lib/models/bids'
import {bidSchema} from '@/lib/schemas'

export async function createBid(data: Omit<Bid, 'id' | 'createdAt' | 'user'>): Promise<Omit<Bid, 'user'>> {
  const validatedData = bidSchema.omit({id: true, createdAt: true, user: true}).parse(data)
  const createdBid = await prismaClient.bid.create({
    data: validatedData,
    select: {
      id: true,
      amount: true,
      createdAt: true,
      userId: true,
      auctionId: true,
    },
  })

  // Update the auction's current price
  await prismaClient.auction.update({
    where: {id: data.auctionId},
    data: {currentPrice: data.amount},
  })

  return createdBid
}

export async function getBidsForAuction(auctionId: string): Promise<Bid[]> {
  return prismaClient.bid.findMany({
    where: {auctionId},
    include: {user: true},
    orderBy: {amount: 'desc'},
  })
}
