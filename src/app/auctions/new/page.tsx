import NewAuctionForm from './NewAuctionForm'
import {getCategories} from '@/lib/server/actions/categories'

export default async function NewAuctionPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nieuwe Veiling Aanmaken</h1>
      <NewAuctionForm categories={categories} />
    </div>
  )
}
