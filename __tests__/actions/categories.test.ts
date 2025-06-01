import {describe, it, expect, vi, beforeEach, afterEach, Mock} from 'vitest'
import {prismaClient} from '@/lib/server/dal/utils/prismaClient'
import {createCategory, getCategories} from '@/lib/server/dal/categories'

vi.mock('next/cache')
vi.mock('./utils/prismaClient')

const mockCategory = {
  id: '1',
  name: 'Electronics',
}

describe('Categories DAL and Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a category', async () => {
    const mockCategory = {id: '1', name: 'Electronics'}
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.category.create).mockResolvedValue(mockCategory)

    const result = await createCategory({name: 'Electronics'})

    expect(result).toEqual(mockCategory)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaClient.category.create).toHaveBeenCalledWith({
      data: {name: 'Electronics'},
    })
  })

  it('should get all categories', async () => {
    const mockCategories = [
      {id: '1', name: 'Electronics'},
      {id: '2', name: 'Books'},
    ]
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(prismaClient.category.findMany).mockResolvedValue(mockCategories)

    const result = await getCategories()

    expect(result).toEqual(mockCategories)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaClient.category.findMany).toHaveBeenCalled()
  })

  it('should create a category successfully', async () => {
    const categoryData = {name: 'Electronics'} // Ensure name is provided

    ;(prismaClient.category.create as Mock).mockResolvedValue(mockCategory)

    const result = await createCategory(categoryData)

    expect(result.id).toBe(mockCategory.id)
    expect(result.name).toBe(mockCategory.name)
  })

  it('should throw an error if category creation fails', async () => {
    const categoryData = {name: 'Electronics'}

    ;(prismaClient.category.create as Mock).mockRejectedValue(new Error('Failed to create category'))

    await expect(createCategory(categoryData)).rejects.toThrow('Failed to create category')
  })
})
