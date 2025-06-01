import {PrismaClient, AuctionStatus} from '@prisma/client'
import {faker} from '@faker-js/faker'
import {hashPassword} from '../src/lib/utils/passwordUtils'
console.log(hashPassword)

const prisma = new PrismaClient()

const seedDev = async () => {
  console.log('Starting seeding...')

  // Create a specific test user
  const testUser = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashPassword('Azerty123'),
      name: 'Test User',
      bio: 'This is a test user account.',
    },
  })

  const testUser2 = await prisma.user.create({
    data: {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: hashPassword('Azerty123'),
      name: 'Test User 2',
      bio: 'This is a test user account.',
    },
  })

  console.log(`Test user created: ${testUser.email}`)

  // Create other random users
  const users = [testUser, testUser2] // Start with the test user
  for (let i = 0; i < 5; i++) {
    users.push(
      await prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: hashPassword('Azerty123'),
          name: faker.person.fullName(),
          bio: faker.lorem.sentence(),
        },
      }),
    )
  }

  console.log(`${users.length} users created.`)

  // Create categories
  const categories = []
  const categoryNames = ['Antiek', 'Elektronica', 'Boeken', 'Kunst', 'Meubels']

  for (const name of categoryNames) {
    categories.push(
      await prisma.category.create({
        data: {name},
      }),
    )
  }

  console.log(`${categories.length} categories created.`)

  // Create auctions
  const auctions = []
  for (let i = 0; i < 10; i++) {
    const category = faker.helpers.arrayElement(categories)
    const seller = faker.helpers.arrayElement(users)
    const startPrice = faker.number.float({min: 10, max: 100, fractionDigits: 2})

    auctions.push(
      await prisma.auction.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          startPrice,
          currentPrice: startPrice,
          endDate: faker.date.future(),
          image: faker.image.url(),
          sellerId: seller.id,
          categoryId: category.id,
          status: AuctionStatus.ACTIVE,
        },
      }),
    )
  }

  console.log(`${auctions.length} auctions created.`)

  // Create bids
  for (const auction of auctions) {
    const bidders = faker.helpers.arrayElements(users, faker.number.int({min: 1, max: 3}))

    for (const bidder of bidders) {
      const amount = auction.currentPrice + faker.number.float({min: 5, max: 20, fractionDigits: 2})

      await prisma.bid.create({
        data: {
          amount,
          userId: bidder.id,
          auctionId: auction.id,
        },
      })

      // Update current price of the auction
      await prisma.auction.update({
        where: {id: auction.id},
        data: {currentPrice: amount},
      })
    }
  }

  console.log('Bids created.')

  // Create reviews
  for (let i = 0; i < 10; i++) {
    const reviewer = faker.helpers.arrayElement(users)
    let reviewee = faker.helpers.arrayElement(users)

    // Ensure reviewer and reviewee are not the same
    while (reviewee.id === reviewer.id) {
      reviewee = faker.helpers.arrayElement(users)
    }

    await prisma.review.create({
      data: {
        rating: faker.number.int({min: 1, max: 5}),
        content: faker.lorem.sentence(),
        reviewerId: reviewer.id,
        revieweeId: reviewee.id,
      },
    })
  }

  console.log('Reviews created.')

  console.log('Seeding completed.')
}

seedDev()
  .catch(e => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
