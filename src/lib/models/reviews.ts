import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reviewWithUsers = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    reviewer: {
      select: {
        id: true,
        username: true,
      },
    },
    reviewee: {
      select: {
        id: true,
        username: true,
      },
    },
  },
})

export type Review = Prisma.ReviewGetPayload<typeof reviewWithUsers>
