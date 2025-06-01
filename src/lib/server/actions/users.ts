'use server'

import DAL from '@dal'
import {redirect} from 'next/navigation'
import {Profile} from '@/lib/models/users'
import {Prisma} from '@prisma/client'
import {clearSessionCookie, getSessionId, setSessionCookie, verifyPassword} from '@utils'
import {revalidatePath} from 'next/cache'
import {getSessionProfileAndOptionallyRenew} from '@/lib/server/mediators'

interface SignInOrRegisterParams {
  email: string
  password: string
  username?: string
}

export async function signInOrRegister(params: SignInOrRegisterParams): Promise<void> {
  try {
    let profile: Profile | null = null
    if (params.username !== undefined) {
      profile = await DAL.createUser({...params, username: params.username})
    } else {
      const user = await DAL.getUserByEmail(params.email)

      if (!user) throw new Error('No user found')

      const isValidPassword = verifyPassword(user.password, params.password)

      if (!isValidPassword) throw new Error('No user found with the provided user/password combination.')

      profile = user
    }

    const session = await DAL.startSession(profile?.id)
    await setSessionCookie(session)

    redirect('/profile')
  } catch (error) {
    console.error('Error in signInOrRegister:', error)
    throw error
  }
}

export async function signOut(): Promise<void> {
  const sessionId = await getSessionId()
  if (sessionId) {
    await DAL.stopSession(sessionId)
    await clearSessionCookie()
  }
  redirect('/login')
}

export async function updateProfile(profile: Prisma.UserUpdateInput): Promise<void> {
  const sessionProfile = await getSessionProfileAndOptionallyRenew()
  await DAL.updateUser(sessionProfile.id, profile)
  revalidatePath('/', 'layout')
}

export async function getUsers(searchTerm?: string) {
  return DAL.getUsers(searchTerm)
}

export async function getUserById(id: string) {
  return DAL.getUserById(id)
}
