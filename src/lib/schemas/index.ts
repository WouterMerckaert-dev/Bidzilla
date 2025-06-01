import * as userSchemas from './userSchemas'
import * as auctionSchemas from './auctionSchema'
import * as bidSchemas from './bidSchema'
import * as categorySchemas from './categorySchema'
import * as reviewSchemas from './reviewSchema'
import * as sessionSchemas from './sessionSchema'
import * as winnerSchemas from '@/lib/schemas/winnerSchema'

export * from './userSchemas'
export * from './auctionSchema'
export * from './bidSchema'
export * from './categorySchema'
export * from './reviewSchema'
export * from './sessionSchema'
export * from './winnerSchema'

const schemas = {
  ...userSchemas,
  ...auctionSchemas,
  ...bidSchemas,
  ...categorySchemas,
  ...reviewSchemas,
  ...sessionSchemas,
  ...winnerSchemas,
}

export default schemas
