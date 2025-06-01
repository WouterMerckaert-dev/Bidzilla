import '@testing-library/jest-dom'
import {vi} from 'vitest'

import __tests__ from './__tests__/__mocks__/prismaClient'

// Mocking next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mocking next/image
vi.mock('next/image', () => ({
  default: vi.fn(),
}))

// Mocking the Prisma client correctly
vi.mock('@/lib/server/dal/utils/prismaClient', () => ({
  prismaClient: __tests__,
}))

// Mocking server-only
vi.mock('server-only', () => ({
  default: vi.fn(),
}))
