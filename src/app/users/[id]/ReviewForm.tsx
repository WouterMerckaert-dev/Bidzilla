'use client'

import React, {useState} from 'react'
import {createReview} from '@/lib/server/actions/reviews'
import {useRouter} from 'next/navigation'

interface ReviewFormProps {
  userId: string
}

export default function ReviewForm({userId}: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData()
      formData.append('revieweeId', userId)
      formData.append('rating', rating.toString())
      formData.append('content', reviewContent)

      const result = await createReview({success: false, message: ''}, formData)
      console.log(result)
      if (result.success) {
        setRating(5)
        setReviewContent('')
        router.refresh()
      } else {
        setError(result.message || 'Er is een fout opgetreden bij het plaatsen van de review.')
        if (result.errors) {
          console.error('Validation errors:', result.errors)
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
    }
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-700">Laat een review achter</h3>
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
          <button
            type="submit"
            id="reviewPlaatsen"
            name="reviewPlaatsen"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Review plaatsen
          </button>
        </form>
      </div>
    </div>
  )
}
