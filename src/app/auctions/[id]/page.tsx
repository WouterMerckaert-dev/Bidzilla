import {getAuction} from '@/lib/server/actions/auctions'
import {notFound} from 'next/navigation'
import BidForm from './BidForm'
import {getSessionProfile} from '@/lib/server/mediators'
import Link from 'next/link'

export default async function AuctionPage({params}: {params: {id: string}}) {
  const auction = await getAuction(params.id)
  const user = await getSessionProfile()

  if (!auction) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{auction.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="justify-items-center">
            <img
              src={auction.image || '/placeholder.svg'}
              alt={auction.title}
              className="h-64 object-cover rounded-lg"
            />
          </div>
          <p className="mt-4 text-gray-600">{auction.description}</p>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-xl font-semibold">Huidig bod: €{auction.currentPrice}</p>
            <p className="text-gray-600">Einddatum: {auction.endDate.toLocaleDateString()}</p>
          </div>
          {user ? (
            <BidForm auctionId={auction.id} currentPrice={auction.currentPrice} />
          ) : (
            <Link
              href="/login"
              className="block w-full text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Log in om een bod te plaatsen
            </Link>
          )}
          <div>
            <h2 className="text-xl font-semibold mb-2">Biedgeschiedenis</h2>
            <ul className="space-y-2">
              {auction.bids.map(bid => (
                <li key={bid.id} className="bg-gray-100 p-2 rounded-lg">
                  {bid.user.username}: €{bid.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
