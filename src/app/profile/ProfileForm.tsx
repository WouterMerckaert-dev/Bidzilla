'use client'

import React, {useState} from 'react'
import {updateProfile, signOut} from '@/lib/server/actions/users'
import {Profile} from '@/lib/models/users'
import {Auction} from '@/lib/models/auctions'
import AuctionItem from './AuctionItem'

interface ProfileFormProps {
  user: Profile
  auctions: Auction[]
}

export default function ProfileForm({user, auctions}: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email)
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState(user.username || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({name, email, bio, username})
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Naam
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="username" className="block mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="bio" className="block mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">
              Annuleren
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Opslaan
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Naam:</strong> {user.name || 'Niet ingesteld'}
          </p>
          <p>
            <strong>E-mail:</strong> {user.email}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio || 'Niet ingesteld'}
          </p>
          <p>
            <strong>Gebruikersnaam:</strong> {user.username || 'Niet ingesteld'}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Profiel bewerken
          </button>
        </div>
      )}
      <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Uitloggen
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Mijn Veilingen</h2>
        <div className="space-y-4">
          {auctions.map(auction => (
            <AuctionItem key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  )
}
