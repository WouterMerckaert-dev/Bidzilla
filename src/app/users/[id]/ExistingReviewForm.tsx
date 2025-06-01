'use client'

import React, {useState} from 'react'
import {updateReview, deleteReview} from '@/lib/server/actions/reviews'
import {useRouter} from 'next/navigation'
import {Review} from '@/lib/models/reviews'

interface ExistingReviewFormProps {
  review: Review & {reviewee: {id: string; username: string}}
  userId: string
}

export default function ExistingReviewForm({review}: ExistingReviewFormProps) {
  const [rating, setRating] = useState(review.rating)
  const [reviewContent, setReviewContent] = useState(review.content)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData()
      formData.append('rating', rating.toString())
      formData.append('content', reviewContent)

      const result = await updateReview(review.id, {success: false, message: ''}, formData)

      console.log(result)

      if (result.success) {
        router.refresh()
      } else {
        setError(result.message || 'Er is een fout opgetreden bij het bijwerken van de review.')
      }
    } catch (err) {
      console.error('Error updating review:', err)
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
    }
  }

  const handleDeleteReview = async () => {
    try {
      const result = await deleteReview(review.id)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.message || 'Er is een fout opgetreden bij het verwijderen van de review.')
      }
    } catch (err) {
      console.error('Error deleting review:', err)
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
    }
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-700">Uw review bewerken</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block mb-1 text-indigo-600">
              Beoordeling
            </label>
            <select
              id="rating"
              name="rating"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500">
              <option value="1">1 ster</option>
              <option value="2">2 sterren</option>
              <option value="3">3 sterren</option>
              <option value="4">4 sterren</option>
              <option value="5">5 sterren</option>
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block mb-1 text-indigo-600">
              Review
            </label>
            <textarea
              id="content"
              name="content"
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Review bijwerken
            </button>
            <button
              type="button"
              onClick={handleDeleteReview}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Review verwijderen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
