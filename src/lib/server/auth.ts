import {PrismaAdapter} from '@auth/prisma-adapter'
import {PrismaClient} from '@prisma/client'
import {compare, hash} from 'bcrypt'
import {redirect} from 'next/navigation'
import {getSessionProfile} from '@/lib/server/mediators'

const prisma = new PrismaClient()

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function requireAuth() {
  const user = await getSessionProfile()
  if (!user) {
    redirect('/login')
  }
  return user
}
