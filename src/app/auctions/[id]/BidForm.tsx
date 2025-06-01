'use client'

import {useState} from 'react'
import {createBid} from '@/lib/server/actions/bids'
import {useRouter} from 'next/navigation'

interface BidFormProps {
  auctionId: string
  currentPrice: number
}

export default function BidForm({auctionId, currentPrice}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const result = await createBid({success: false, message: ''}, formData)

    if (result.success) {
      setBidAmount('')
      router.refresh()
    } else {
      setError(result.message || 'Er is een fout opgetreden bij het plaatsen van het bod.')
      console.error('Bid creation error:', result.errors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input type="hidden" name="auctionId" value={auctionId} />
      <input
        type="number"
        name="amount"
        value={bidAmount}
        onChange={e => setBidAmount(e.target.value)}
        placeholder="Uw bod"
        className="w-full p-2 border rounded-lg mb-2"
        min={currentPrice + 0.01}
        step="0.01"
        required
      />
      <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
        Plaats bod
      </button>
    </form>
  )
}
