import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bidWithUser = Prisma.validator<Prisma.BidDefaultArgs>()({
  include: {
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  },
})

export type Bid = Prisma.BidGetPayload<typeof bidWithUser>

export type BidCreateInput = Omit<Bid, 'id' | 'createdAt' | 'user'>
