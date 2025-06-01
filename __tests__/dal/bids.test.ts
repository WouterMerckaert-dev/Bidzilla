import {describe, it, expect, vi, beforeEach} from 'vitest'
import {prismaClient} from '@/lib/server/dal/utils/prismaClient'
import {createBid, getBidsForAuction} from '@/lib/server/dal/bids'
import {Bid} from '@/lib/models/bids'

vi.mock('@/lib/server/dal/utils/prismaClient', () => ({
  prismaClient: {
    bid: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    auction: {
      update: vi.fn(),
    },
  },
}))

const mockBidData = {
  amount: 15,
  userId: 'ckqn1q2x70000j3mhj0j0j0j1',
  auctionId: 'ckqn1q2x70000j3mhj0j0j0j2',
}

const mockBid: Bid = {
  id: 'ckqn1q2x70000j3mhj0j0j0j3',
  ...mockBidData,
  createdAt: new Date(),
  user: {id: 'ckqn1q2x70000j3mhj0j0j0j1', username: 'user1'},
}

describe('Bids DAL', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a bid', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.bid.create).mockResolvedValue(mockBid)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.update).mockResolvedValue({
      id: 'ckqn1q2x70000j3mhj0j0j0j2',
      title: 'Test Auction',
      description: 'Test Description',
      startPrice: 10,
      currentPrice: 15,
      startDate: new Date(),
      endDate: new Date(),
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE',
      sellerId: 'ckqn1q2x70000j3mhj0j0j0j1',
      categoryId: 'ckqn1q2x70000j3mhj0j0j0j0',
    })

    const result = await createBid(mockBidData)

    // Now include the user object in the expected result
    expect(result).toEqual({
      id: 'ckqn1q2x70000j3mhj0j0j0j3',
      amount: 15,
      createdAt: mockBid.createdAt,
      userId: 'ckqn1q2x70000j3mhj0j0j0j1',
      auctionId: 'ckqn1q2x70000j3mhj0j0j0j2',
      user: {
        id: 'ckqn1q2x70000j3mhj0j0j0j1',
        username: 'user1',
      },
    })
  })

  it('should get bids for an auction', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.bid.findMany).mockResolvedValue([mockBid])
    const result = await getBidsForAuction('1')

    // Check that the result includes user data
    expect(result).toEqual([mockBid])
  })
})
