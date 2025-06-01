'use client'

import {Star} from 'lucide-react'
import ReviewForm from './ReviewForm'
import ExistingReviewForm from './ExistingReviewForm'
import {UserWithDetails} from '@/lib/models/users'
import {Review} from '@/lib/models/reviews'
import {useState, useEffect} from 'react'

interface UserProfileContentProps {
  user: UserWithDetails
  currentUserId: string
  showReview?: boolean
}

export default function UserProfileContent({user, currentUserId, showReview}: UserProfileContentProps) {
  const [existingReview, setExistingReview] = useState<Review | null>(null)

  useEffect(() => {
    const review = user.reviewsReceived.find(review => review.reviewer.id === currentUserId)
    if (review) {
      setExistingReview({
        ...review,
        reviewee: {
          id: user.id,
          username: user.username,
        },
      })
    } else {
      setExistingReview(null)
    }
  }, [user.reviewsReceived, currentUserId, user.id, user.username])

  const averageRating =
    user.reviewsReceived.length > 0
      ? user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / user.reviewsReceived.length
      : 0

  const activeAuctions = user.auctions.filter(a => a.status === 'ACTIVE').length
  const wonAuctionsCount = user.wonAuctions.length
  const participatedAuctions = user.auctions.length

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">{user.name || user.username}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>
                <strong className="text-indigo-600">E-mail:</strong> {user.email}
              </p>
              <p>
                <strong className="text-indigo-600">Lid sinds:</strong> {formatDate(user.createdAt)}
              </p>
              <p>
                <strong className="text-indigo-600">Bio:</strong> {user.bio || 'Geen bio beschikbaar'}
              </p>
              <p>
                <strong className="text-indigo-600">Actieve veilingen:</strong> {activeAuctions}
              </p>
              <p>
                <strong className="text-indigo-600">Gewonnen veilingen:</strong> {wonAuctionsCount}
              </p>
              <p>
                <strong className="text-indigo-600">Deelgenomen veilingen:</strong> {participatedAuctions}
              </p>
              <div className="flex items-center">
                <strong className="text-indigo-600 mr-2">Gemiddelde beoordeling:</strong>
                <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Reviews</h2>
              <div className="space-y-4">
                {user.reviewsReceived.map(review => (
                  <div key={review.id} className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <p className="font-bold mr-2">{review.reviewer.username}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReview &&
        (existingReview ? (
          <ExistingReviewForm review={existingReview} userId={user.id} />
        ) : (
          <ReviewForm userId={user.id} />
        ))}
    </div>
  )
}
