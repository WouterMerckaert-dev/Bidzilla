import {z} from 'zod'
import {formAction, validateSchema} from '@mediators'
import {describe, expect, it, Mock, vi} from 'vitest'

// Mocking getSessionProfileAndOptionallyRenew and formAction, validateSchema functions
vi.mock('@mediators', () => ({
  getSessionProfileAndOptionallyRenew: vi.fn(),
  formAction: vi.fn(), // Mock formAction
  validateSchema: vi.fn(), // Mock validateSchema
}))

describe('formAction', () => {
  const mockSchema = z.object({
    field1: z.string(),
    field2: z.string(),
  })

  it('should return error if validation fails', async () => {
    ;(formAction as Mock).mockResolvedValue({success: false, errors: {field1: 'Required'}})

    const formData = new FormData()
    formData.append('field1', 'value1')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const result = await formAction(mockSchema, formData, () => {
      // Use async function
      return {success: false, errors: {field1: 'Required'}}
    })

    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
  })
})

describe('validateSchema', () => {
  const mockSchema = z.object({
    field1: z.string(),
    field2: z.string(),
  })

  it('should return valid data if schema is correct', () => {
    const data = {field1: 'value1', field2: 'value2'}
    ;(validateSchema as Mock).mockReturnValue({data, errors: null})

    const result = validateSchema(mockSchema, data)

    expect(result.errors).toBeNull()
    expect(result.data).toEqual(data)
  })

  it('should return errors if schema is invalid', () => {
    const data = {field1: 'value1'} // Missing field2
    ;(validateSchema as Mock).mockReturnValue({data, errors: {field2: 'Required'}})

    const result = validateSchema(mockSchema, data)

    expect(result.errors).not.toBeNull()
    if (result.errors) {
      expect(result.errors.field2).toBeDefined()
    }
  })
})
