import {PrismaClient} from '@prisma/client'
import {vi} from 'vitest'

export const prisma = {
  user: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  auction: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  bid: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  category: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
} as unknown as PrismaClient

export default prisma
