import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auctionWithDetails = Prisma.validator<Prisma.AuctionDefaultArgs>()({
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

export type Auction = Prisma.AuctionGetPayload<typeof auctionWithDetails>

export type AuctionCreateInput = Omit<
  Auction,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentPrice' | 'bids' | 'seller' | 'category'
> & {
  image: string | null
}
