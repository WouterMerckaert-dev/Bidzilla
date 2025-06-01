export function validateAuctionEndDate(endDate: Date): boolean {
  const now = new Date()
  return endDate > now
}

export function validateStartPrice(price: number): boolean {
  return price > 0
}
