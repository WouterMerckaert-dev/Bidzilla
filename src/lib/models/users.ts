import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithDetails = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    reviewsReceived: {
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
    auctions: {
      include: {
        category: true,
      },
    },
    wonAuctions: true,
  },
})

export type UserWithDetails = Prisma.UserGetPayload<typeof userWithDetails>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const profile = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    username: true,
    email: true,
    name: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
  },
})

export type Profile = Prisma.UserGetPayload<typeof profile>

const SessionProfile = Prisma.validator<Prisma.SessionDefaultArgs>()({
  select: {
    id: true,
    activeUntil: true,
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
})

export type SessionProfile = Prisma.SessionGetPayload<typeof SessionProfile>
