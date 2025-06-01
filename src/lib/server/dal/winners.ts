import 'server-only'
import {prismaClient} from './utils/prismaClient'
import {Winner} from '@/lib/models/winners'
import {winnerSchema} from '@/lib/schemas'

export async function createWinner(data: Omit<Winner, 'id' | 'createdAt'>): Promise<Omit<Winner, 'auction' | 'user'>> {
  const validatedData = winnerSchema.omit({id: true, createdAt: true}).parse(data)
  return prismaClient.winner.create({
    data: validatedData,
    select: {
      id: true,
      createdAt: true,
      auctionId: true,
      userId: true,
      finalPrice: true,
    },
  })
}

export async function getWinnersForUser(userId: string): Promise<Winner[]> {
  return prismaClient.winner.findMany({
    where: {userId},
    include: {
      auction: {
        select: {
          id: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}
