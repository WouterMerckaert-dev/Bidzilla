import {getSessionProfileAndOptionallyRenew} from '@/lib/server/mediators'
import {redirect} from 'next/navigation'
import ProfileForm from './ProfileForm'
import {getUserAuctions} from '@/lib/server/actions/auctions'

export default async function ProfilePage() {
  const sessionProfile = await getSessionProfileAndOptionallyRenew()

  if (!sessionProfile) {
    redirect('/login')
  }

  const userAuctions = await getUserAuctions(sessionProfile.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mijn Profiel</h1>
      <ProfileForm user={sessionProfile} auctions={userAuctions} />
    </div>
  )
}
