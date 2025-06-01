export function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(price)
}
