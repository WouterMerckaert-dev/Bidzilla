import {getUserById} from '@/lib/server/actions/users'
import {notFound} from 'next/navigation'
import UserProfileContent from './UserProfileContent'
import React from 'react'
import {getSessionProfileOrRedirect} from '@mediators'

export default async function UserProfilePage(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const id = params.id
  const user = await getUserById(id)
  const currentUser = await getSessionProfileOrRedirect('/login')

  if (!user) {
    notFound()
  }

  return <UserProfileContent user={user} currentUserId={currentUser.id} showReview={user.id !== currentUser.id} />
}
