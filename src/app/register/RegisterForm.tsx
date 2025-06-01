'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {signInOrRegister} from '@/lib/server/actions/users'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen')
      return
    }
    await signInOrRegister({email, password, username})
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 text-indigo-700">
            Gebruikersnaam
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-indigo-700">
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-indigo-700">
            Wachtwoord
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-indigo-700">
            Bevestig wachtwoord
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Registreren
        </button>
      </form>
      <p className="mt-4 text-center">
        Al een account?
        <Link href="/login" className="ml-1 text-indigo-600 hover:underline">
          Log hier in
        </Link>
      </p>
    </>
  )
}

