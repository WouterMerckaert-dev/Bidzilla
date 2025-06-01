import Link from 'next/link'
import {getUsers} from '@/lib/server/actions/users'
import UserSearch from './UserSearch'

export default async function UsersPage(props: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const searchParams = await props.searchParams
  const search = searchParams.search
  const searchTerm = typeof search === 'string' ? search : undefined
  const users = await getUsers(searchTerm)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">Gebruikers</h1>
      <UserSearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <Link href={`/users/${user.id}`} key={user.id}>
            <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
              <h2 className="text-xl font-semibold mb-2 text-indigo-700">{user.name || user.username}</h2>
              <p className="text-gray-600 mb-1">Lid sinds: {user.createdAt.toLocaleDateString()}</p>
              <p className="text-gray-600 mb-1">E-mail: {user.email}</p>
              <p className="text-gray-600">{user.bio || 'Geen bio beschikbaar'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
