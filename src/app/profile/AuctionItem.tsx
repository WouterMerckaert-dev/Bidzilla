'use client'

import {useState} from 'react'
import {Auction} from '@/lib/models/auctions'
import {updateAuction, deleteAuction} from '@/lib/server/actions/auctions'
import {useRouter} from 'next/navigation'

interface AuctionItemProps {
  auction: Auction
}

export default function AuctionItem({auction}: AuctionItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(auction.title)
  const [description, setDescription] = useState(auction.description)
  const [endDate, setEndDate] = useState(auction.endDate.toISOString().slice(0, 16))
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('endDate', endDate)

      const result = await updateAuction(auction.id, {success: false, message: ''}, formData)
      console.log('result:', result)

      if (result.success) {
        setIsEditing(false)
        router.refresh()
      } else {
        setError(result.message || 'Er is een fout opgetreden bij het bijwerken van de veiling.')
      }
    } catch (err) {
      console.error('Error updating auction:', err)
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Weet je zeker dat je deze veiling wilt verwijderen?')) {
      console.log('Auction ID:', auction.id)

      if (!auction.id) {
        setError('Veiling ID ontbreekt. Kan de veiling niet verwijderen.')
        return
      }

      try {
        const result = await deleteAuction(auction.id)
        console.log('result:', JSON.stringify(result, null, 2))

        if (result.success) {
          router.refresh()
        } else {
          setError(result.message || 'Er is een fout opgetreden bij het verwijderen van de veiling.')
        }
      } catch (err) {
        console.error('Error deleting auction:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
        setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
      }
    }
  }
  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titel
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Beschrijving
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Einddatum
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            id="Annuleren"
            name="Annuleren"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Annuleren
          </button>
          <button
            type="submit"
            id="bijwerken"
            name="bijwerken"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Bijwerken
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">{auction.title}</h3>
      <p className="text-gray-600 mb-2">{auction.description}</p>
      <p className="text-sm text-gray-500 mb-4" suppressHydrationWarning>
        Einddatum: {new Date(auction.endDate).toLocaleString()}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-indigo-600 font-semibold">Startprijs: €{auction.startPrice}</p>
        <div className="space-x-2">
          <button
            id="bewerken"
            name="bewerken"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Bewerken
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  )
}
