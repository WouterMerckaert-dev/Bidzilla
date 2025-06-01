'use client'

import {useState, useEffect} from 'react'
import {Category} from '@/lib/models/categories'
import {useRouter, useSearchParams} from 'next/navigation'

interface AuctionFiltersProps {
  categories: Category[]
}

export default function AuctionFilters({categories}: AuctionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [showActiveOnly, setShowActiveOnly] = useState(searchParams.get('active') === 'true')
  const [sortByEndDate, setSortByEndDate] = useState(searchParams.get('sort') === 'endDate')

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory) {
      params.set('category', selectedCategory)
    } else {
      params.delete('category')
    }
    params.set('active', showActiveOnly.toString())
    if (sortByEndDate) {
      params.set('sort', 'endDate')
    } else {
      params.delete('sort')
    }
    router.push(`/auctions?${params.toString()}`)
  }, [selectedCategory, showActiveOnly, sortByEndDate, router, searchParams])

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className="p-2 border rounded">
        <option value="">Alle categorieën</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={showActiveOnly}
          onChange={e => setShowActiveOnly(e.target.checked)}
          className="mr-2"
        />
        Alleen actieve veilingen
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={sortByEndDate}
          onChange={e => setSortByEndDate(e.target.checked)}
          className="mr-2"
        />
        Sorteer op einddatum
      </label>
    </div>
  )
}
