import {createAuction, deleteAuction, updateAuction} from '@/lib/server/actions/auctions'
import * as DAL from '@/lib/server/dal/auctions'
import {getSessionProfileAndOptionallyRenew} from '@mediators'
import {revalidatePath} from 'next/cache'
import {Auction} from '@/lib/models/auctions'
import {beforeEach, describe, expect, it, vi, Mock} from 'vitest'

// Mock noodzakelijke modules
vi.mock('server-only', () => ({
  default: vi.fn(),
}))
vi.mock('@/lib/server/dal/auctions', () => ({
  createAuction: vi.fn(),
  updateAuction: vi.fn(),
  deleteAuction: vi.fn(),
  getAuction: vi.fn(),
  getAuctions: vi.fn(),
  getUserAuctions: vi.fn(),
}))
vi.mock('@mediators', () => ({
  getSessionProfileAndOptionallyRenew: vi.fn(),
  formAction: vi.fn(async (schema, formData, callback) => {
    // Simuleer de data die uit het formulier komt
    const data = {
      title: 'Test Auction',
      description: 'Test Description',
      startPrice: '10',
      endDate: new Date().toISOString(),
      categoryId: '1',
      image: null,
    }
    const profile = {id: '1', username: 'testuser'}

    // Roep de callback aan met de gesimuleerde data en profiel
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
    return await callback(data, profile)
  }),
}))
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockAuction: Auction = {
  id: '1',
  title: 'Test Auction',
  description: 'Test Description',
  startPrice: 10,
  currentPrice: 10,
  startDate: new Date(),
  endDate: new Date(),
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'ACTIVE',
  sellerId: '1',
  categoryId: '1',
  category: {id: '1', name: 'Category 1'},
  seller: {id: '1', username: 'seller1'},
  bids: [],
}

const mockProfile = {id: '1', username: 'testuser'}
const mockFormData = new FormData()
mockFormData.append('title', 'Test Auction')
mockFormData.append('description', 'Test Description')
mockFormData.append('startPrice', '10')
mockFormData.append('endDate', new Date().toISOString())
mockFormData.append('categoryId', '1')

describe('Auction Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getSessionProfileAndOptionallyRenew as Mock).mockResolvedValue(mockProfile)
  })

  it('should create an auction successfully', async () => {
    ;(DAL.createAuction as Mock).mockResolvedValue(mockAuction)
    const result = await createAuction({success: false, message: ''}, mockFormData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Veiling succesvol aangemaakt.')
    expect(revalidatePath).toHaveBeenCalledWith('/auctions')
  })

  it('should handle errors during auction creation', async () => {
    ;(DAL.createAuction as Mock).mockRejectedValueOnce(new Error('Auction creation failed'))
    const result = await createAuction({success: false, message: ''}, mockFormData)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Auction creation failed')
  })

  it('should update an auction successfully', async () => {
    ;(DAL.updateAuction as Mock).mockResolvedValue(mockAuction)
    const result = await updateAuction('1', {success: false, message: ''}, mockFormData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Veiling succesvol bijgewerkt.')
    expect(revalidatePath).toHaveBeenCalledWith('/auctions/1')
  })

  it('should handle errors during auction update', async () => {
    ;(DAL.updateAuction as Mock).mockRejectedValueOnce(new Error('Auction update failed'))
    const result = await updateAuction('1', {success: false, message: ''}, mockFormData)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Auction update failed')
  })

  it('should delete an auction successfully', async () => {
    ;(DAL.deleteAuction as Mock).mockResolvedValue(undefined)
    const result = await deleteAuction('1')
    expect(result.success).toBe(true)
    expect(result.message).toBe('Veiling succesvol verwijderd.')
    expect(revalidatePath).toHaveBeenCalledWith('/profile')
  })

  it('should handle errors during auction deletion', async () => {
    ;(DAL.deleteAuction as Mock).mockRejectedValueOnce(new Error('Auction deletion failed'))
    const result = await deleteAuction('1')
    expect(result.success).toBe(false)
    expect(result.message).toContain('Auction deletion failed')
  })
})
