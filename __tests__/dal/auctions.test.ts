import {describe, it, expect, vi, beforeEach} from 'vitest'
import {prismaClient} from '@/lib/server/dal/utils/prismaClient'
import {
  createAuction,
  deleteAuction,
  getAuctions,
  getAuction,
  updateAuction,
  getUserAuctions,
} from '@/lib/server/dal/auctions'
import {Auction, AuctionCreateInput} from '@/lib/models/auctions'

vi.mock('@/lib/server/dal/utils/prismaClient', () => ({
  prismaClient: {
    auction: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

const mockAuctionData: AuctionCreateInput = {
  title: 'Test Auction',
  description: 'Test Description',
  startPrice: 10,
  startDate: new Date(),
  endDate: new Date(),
  categoryId: 'ckqn1q2x70000j3mhj0j0j0j0',
  sellerId: 'ckqn1q2x70000j3mhj0j0j0j1',
  image: null,
}

const mockAuction: Auction = {
  id: 'ckqn1q2x70000j3mhj0j0j0j2',
  ...mockAuctionData,
  currentPrice: 10,
  startDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'ACTIVE',
  category: {id: 'ckqn1q2x70000j3mhj0j0j0j0', name: 'Category 1'},
  seller: {id: 'ckqn1q2x70000j3mhj0j0j0j1', username: 'seller1'},
  bids: [],
}

describe('Auctions DAL', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create an auction', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.create).mockResolvedValue(mockAuction)
    const result = await createAuction(mockAuctionData)
    expect(result).toEqual(mockAuction)
  })

  it('should get all auctions', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.findMany).mockResolvedValue([mockAuction])
    const result = await getAuctions()
    expect(result).toEqual([mockAuction])
  })

  it('should get an auction by id', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.findUnique).mockResolvedValue(mockAuction)
    const result = await getAuction('ckqn1q2x70000j3mhj0j0j0j2')
    expect(result).toEqual(mockAuction)
  })

  it('should update an auction', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.update).mockResolvedValue(mockAuction)
    const result = await updateAuction(
      'ckqn1q2x70000j3mhj0j0j0j2',
      {title: 'Updated Auction'},
      'ckqn1q2x70000j3mhj0j0j0j1',
    )
    expect(result).toEqual(mockAuction)
  })

  it('should delete an auction', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.delete).mockResolvedValue(mockAuction)
    const result = await deleteAuction('ckqn1q2x70000j3mhj0j0j0j2', 'ckqn1q2x70000j3mhj0j0j0j1')
    expect(result).toEqual(undefined)
  })

  it('should get user auctions', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.auction.findMany).mockResolvedValue([mockAuction])
    const result = await getUserAuctions('ckqn1q2x70000j3mhj0j0j0j1')
    expect(result).toEqual([mockAuction])
  })
})
