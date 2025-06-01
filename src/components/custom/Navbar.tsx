import Link from 'next/link'
import {getSessionProfile} from '@/lib/server/mediators'

export default async function Navbar() {
  const user = await getSessionProfile()
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold hover:text-indigo-200">
            Bidzilla
          </Link>
          <div className="flex space-x-4">
            <Link href="/auctions" className="hover:text-indigo-200">
              Veilingen
            </Link>
            <Link href="/users" className="hover:text-indigo-200">
              Gebruikers
            </Link>
            {user ? (
              <Link href="/profile" className="hover:text-indigo-200">
                Profiel
              </Link>
            ) : (
              <Link href="/login" className="hover:text-indigo-200">
                Inloggen
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
