import {Prisma} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const category = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  select: {
    id: true,
    name: true,
  },
})

export type Category = Prisma.CategoryGetPayload<typeof category>
