import Link from 'next/link'
import {getAuctions} from '@/lib/server/actions/auctions'

export default async function Home({searchParams}: {searchParams?: {[_key: string]: string | string[] | undefined}}) {
  const auctions = await getAuctions(searchParams)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welkom bij Bidzilla</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.slice(0, 6).map(auction => (
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
