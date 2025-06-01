import {describe, expect, it, vi, beforeEach, Mock} from 'vitest'
import * as sessionMediators from '@/lib/server/mediators/sessionMediators'
import * as dal from '@dal' // Ensure this is the correct import
import {Profile} from '@/lib/models/users'
import {redirect} from 'next/navigation'
import {getSessionId} from '@utils'

// Mock specific parts of the module using `importOriginal`
vi.mock('@/lib/server/dal', async () => {
  const original = await vi.importActual<typeof dal>('@/lib/server/dal')
  return {
    ...original, // Keep the original implementation
    getSessionProfile: vi.fn(), // Mock the specific methods
    extendSession: vi.fn(),
    user: {
      findUnique: vi.fn().mockResolvedValue({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      }), // Mock the findUnique method to return a mock user profile
    },
  }
})

// Mock the next/navigation to test redirection
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock utils functions
vi.mock('@/lib/utils', () => ({
  getSessionId: vi.fn(),
  setSessionCookie: vi.fn(),
}))

const mockProfile: Profile = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  bio: 'Test Bio',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSessionProfile = {
  id: 'session-id',
  activeUntil: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 24 hours
  user: mockProfile,
}

describe('Session Mediators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect if no session profile', async () => {
    ;(getSessionId as Mock).mockResolvedValue(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const profile = await sessionMediators.getSessionProfileOrRedirect('/login')
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})
