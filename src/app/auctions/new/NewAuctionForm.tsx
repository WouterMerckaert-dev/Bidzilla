'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {createAuction} from '@/lib/server/actions/auctions'
import {createCategory} from '@/lib/server/actions/categories'
import {Category} from '@/lib/models/categories'

interface NewAuctionFormProps {
  categories: Category[]
}

export default function NewAuctionForm({categories: initialCategories}: NewAuctionFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startPrice, setStartPrice] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categories, setCategories] = useState(initialCategories)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let finalCategoryId = categoryId

      // If adding a new category, create it first
      if (isAddingCategory && newCategoryName) {
        const newCategoryFormData = new FormData()
        newCategoryFormData.append('name', newCategoryName)
        const newCategoryResult = await createCategory({success: false, message: ''}, newCategoryFormData)

        if (newCategoryResult.success && newCategoryResult.category) {
          finalCategoryId = newCategoryResult.category.id
          setCategories([...categories, newCategoryResult.category])
          setIsAddingCategory(false)
          setNewCategoryName('')
        } else {
          throw new Error(newCategoryResult.message || 'Failed to create new category')
        }
      }

      if (!finalCategoryId) {
        throw new Error('Please select or create a category')
      }

      const formData = new FormData(e.target as HTMLFormElement)
      formData.set('categoryId', finalCategoryId)

      const result = await createAuction({success: false, message: ''}, formData)

      if (result.success) {
        router.push('/auctions')
      } else {
        throw new Error(result.message || 'Er is een fout opgetreden bij het aanmaken van de veiling.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = () => {
    setIsAddingCategory(true)
    setCategoryId('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="title" className="block mb-1">
          Naam van het item
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">
          Beschrijving
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>
      <div>
        <label htmlFor="startPrice" className="block mb-1">
          Startprijs (€)
        </label>
        <input
          type="number"
          id="startPrice"
          name="startPrice"
          value={startPrice}
          onChange={e => setStartPrice(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block mb-1">
          Einddatum
        </label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={endDate}
          min={new Date().toISOString().slice(0, 16)}
          onChange={e => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block mb-1">
          Categorie
        </label>
        {isAddingCategory ? (
          <div className="flex space-x-2">
            <input
              type="text"
              id="newCategory"
              name="newCategory"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="flex-grow p-2 border rounded"
              placeholder="Nieuwe categorie naam"
              required
            />
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
              Annuleren
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="flex-grow p-2 border rounded"
              required>
              <option value="">Selecteer een categorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Nieuwe categorie
            </button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="image" className="block mb-1">
          Afbeelding URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="https://voorbeeld.com/afbeelding.jpg"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isSubmitting}>
        {isSubmitting ? 'Bezig met aanmaken...' : 'Veiling Aanmaken'}
      </button>
    </form>
  )
}
