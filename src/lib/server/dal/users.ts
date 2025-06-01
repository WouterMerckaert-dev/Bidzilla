import 'server-only'
import {prismaClient} from '@/lib/server/dal/utils/prismaClient'
import {Prisma, Session, User} from '@prisma/client'
import {Profile, SessionProfile} from '@/lib/models/users'
import {randomBytes} from 'crypto'
import {cache} from 'react'
import {hashPassword} from '@utils'

/**
 * Create a new user with a hashed and salted password.
 */
export async function createUser(data: Prisma.UserCreateInput): Promise<Profile> {
  return prismaClient.user.create({
    data: {
      ...data,
      password: hashPassword(data.password),
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

/**
 * Retrieve a user by email.
 * The result includes the hashed password and should therefore NEVER be exposed to the client.
 *
 * @param email The email address of the user to retrieve.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prismaClient.user.findFirst({where: {email}})
}

export async function getUsers(searchTerm?: string) {
  const where = searchTerm
    ? {
        OR: [
          {username: {contains: searchTerm, mode: Prisma.QueryMode.insensitive}},
          {name: {contains: searchTerm, mode: Prisma.QueryMode.insensitive}},
          {email: {contains: searchTerm, mode: Prisma.QueryMode.insensitive}},
        ],
      }
    : {}

  return prismaClient.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      createdAt: true,
    },
    orderBy: {createdAt: 'desc'},
  })
}

export async function getUserById(id: string) {
  return prismaClient.user.findUnique({
    where: {id},
    include: {
      auctions: {
        include: {
          category: true,
        },
      },
      wonAuctions: true,
      reviewsReceived: {
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {createdAt: 'desc'},
      },
    },
  })
} /**
 * Create a new session for the given user.
 *
 * @param userId
 */
export async function startSession(userId: string): Promise<Session> {
  // We maken hier een nieuw id aan via de randomBytes functie van Node.js.
  // Dit is een cryptografisch veilige functie om willekeurige strings te genereren.
  // Een V4 UUID is ook een goede optie, de randomBytes functie wordt hier gebruikt ter illustratie.
  // Deze functie is nuttig als je een unieke identifier hebt om een applicatie te ondertekenen.
  const id = randomBytes(32).toString('hex')

  return prismaClient.session.create({
    data: {
      id,
      userId,
      activeFrom: new Date(),
    },
  })
}

/**
 * Retrieve the session and associated user profile.
 * Only return active sessions, even if a session with the given id exists.
 *
 * @param id The id of the session to retrieve.
 */
export const getSessionProfile = cache(async (id: string): Promise<SessionProfile | null> => {
  return prismaClient.session.findUnique({
    where: {
      id,
      activeUntil: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      activeUntil: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })
})

/**
 * Stop the session with the given id.
 *
 * @param id The id of the session to stop.
 */
export async function stopSession(id: string): Promise<void> {
  await prismaClient.session.delete({where: {id}})
}

/**
 * Extend the session with the given id for 24 hours.
 *
 * @param id The id of the session to extend.
 */
export async function extendSession(id: string): Promise<Session> {
  return prismaClient.session.update({
    where: {id},
    data: {
      activeUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })
}

export async function updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<Profile> {
  return prismaClient.user.update({
    where: {id: userId},
    data: {
      ...data,
      id: userId,
    },
  })
}
