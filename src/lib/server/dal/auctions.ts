import 'server-only'
import {prismaClient} from './utils/prismaClient'
import {Auction, AuctionCreateInput} from '@/lib/models/auctions'
import {auctionSchema} from '@/lib/schemas'

export async function createAuction(data: AuctionCreateInput): Promise<Auction> {
  const validatedData = auctionSchema
    .omit({id: true, createdAt: true, updatedAt: true, status: true, currentPrice: true})
    .parse(data)
  return prismaClient.auction.create({
    data: {
      ...validatedData,
      status: 'ACTIVE',
      currentPrice: validatedData.startPrice,
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          username: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  })
}

export async function updateAuction(id: string, data: Partial<AuctionCreateInput>, sellerId: string): Promise<Auction> {
  const validatedData = auctionSchema.partial().parse(data)
  return prismaClient.auction.update({
    where: {id, sellerId},
    data: validatedData,
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          username: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  })
}

export async function deleteAuction(id: string, sellerId: string): Promise<void> {
  await prismaClient.auction.delete({
    where: {id, sellerId},
  })
}

export async function getAuction(id: string): Promise<Auction | null> {
  return prismaClient.auction.findUnique({
    where: {id},
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          username: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  })
}

export async function getAuctions(filters?: {
  categoryId?: string
  active?: boolean
  sortByEndDate?: boolean
}): Promise<Auction[]> {
  return prismaClient.auction.findMany({
    where: {
      ...(filters?.categoryId ? {categoryId: filters.categoryId} : {}),
      ...(filters?.active ? {status: 'ACTIVE'} : {}),
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          username: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: filters?.sortByEndDate ? {endDate: 'asc'} : {createdAt: 'desc'},
  })
}

export async function getUserAuctions(userId: string): Promise<Auction[]> {
  return prismaClient.auction.findMany({
    where: {sellerId: userId},
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          username: true,
        },
      },
      bids: {
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {createdAt: 'desc'},
  })
}
