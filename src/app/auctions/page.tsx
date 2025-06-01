import Link from 'next/link'
import {getAuctions} from '@/lib/server/actions/auctions'
import {getCategories} from '@/lib/server/actions/categories'
import {getSessionProfile} from '@/lib/server/mediators'
import AuctionFilters from '@/app/auctions/ActionFilters'

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined}
}) {
  const categories = await getCategories()
  const auctions = await getAuctions(searchParams)
  const user = await getSessionProfile()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-800">Veilingen</h1>
        {user ? (
          <Link href="/auctions/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nieuwe veiling
          </Link>
        ) : (
          <Link href="/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Log in om een veiling aan te maken
          </Link>
        )}
      </div>

      <AuctionFilters categories={categories} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map(auction => (
          <div key={auction.id} className="border rounded-lg p-4 shadow-md flex">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{auction.title}</h2>
              <p className="text-gray-600 mb-1">Categorie: {auction.category.name}</p>
              <p className="text-gray-600 mb-1">Huidig bod: €{auction.currentPrice}</p>
              <p className="text-gray-600 mb-4">Einddatum: {auction.endDate.toLocaleDateString()}</p>
              <Link
                href={`/auctions/${auction.id}`}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                Bekijk veiling
              </Link>
            </div>
            <div className="w-1/3 ml-4">
              <img
                src={auction.image || '/placeholder.svg'}
                alt={auction.title}
                width="200"
                className="h-36 object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
