'use client'

import {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'

export default function UserSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    router.push(`/users?${params.toString()}`)
  }, [searchTerm])

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Zoek gebruikers..."
        className="w-full p-2 border rounded"
      />
    </div>
  )
}
