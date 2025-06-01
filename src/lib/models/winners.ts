import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const winnerWithAuction = Prisma.validator<Prisma.WinnerDefaultArgs>()({
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

export type Winner = Prisma.WinnerGetPayload<typeof winnerWithAuction>
