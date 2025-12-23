const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
if (!process.env.DATABASE_URL) {
  console.log('Trying .env fallback')
  require('dotenv').config()
}

// Initialize Prisma Client with Adapter
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env.local or .env')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  // Clean up existing data
  try {
      await prisma.boost.deleteMany()
      await prisma.transaction.deleteMany()
      await prisma.issue.deleteMany()
      await prisma.repository.deleteMany()
      await prisma.session.deleteMany()
      await prisma.account.deleteMany()
      await prisma.user.deleteMany()
  } catch (e) {
      console.warn("Cleanup failed, proceeding...", e)
  }

  const users = []
  
  // Create 5 Users
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        image: `https://github.com/identicons/user${i}.png`, 
        karma: 100 * i, 
        transactions: {
          create: [
            {
              amount: 100 * i,
              description: 'Initial Karma',
            }
          ]
        }
      }
    })
    users.push(user)
    console.log(`Created user: ${user.username}`)
  }

  // Create 10 Repositories
  let repoCounter = 1
  let issueCounter = 1
  
  for (const user of users) {
    // Each user gets 2 repositories
    for (let j = 0; j < 2; j++) {
      const repoId = repoCounter++
      const repo = await prisma.repository.create({
        data: {
          githubId: 1000 + repoId,
          name: `repo-${repoId}`,
          fullName: `${user.username}/repo-${repoId}`,
          url: `https://github.com/${user.username}/repo-${repoId}`,
          description: `Description for generic repository ${repoId}`,
          stargazersCount: Math.floor(Math.random() * 100),
          registeredById: user.id
        }
      })
      console.log(`Created repo: ${repo.fullName}`)

      // Create 3 Issues
      for (let k = 1; k <= 3; k++) {
        const issueId = issueCounter++
        await prisma.issue.create({
          data: {
            githubId: 2000 + issueId,
            number: k,
            title: `Issue ${k} for ${repo.name}`,
            body: `This is the body for issue ${k}. It contains some generic text.`,
            state: k % 2 === 0 ? 'closed' : 'open', 
            htmlUrl: `${repo.url}/issues/${k}`,
            repositoryId: repo.id
          }
        })
      }
    }
  }

  // Transactions
  await prisma.transaction.create({
    data: {
      amount: -50,
      description: 'Donation for exceptional work',
      userId: users[0].id,
      repositoryId: null 
    }
  })
  await prisma.transaction.create({
    data: {
      amount: 50,
      description: 'Received donation',
      userId: users[1].id,
      repositoryId: null
    }
  })

  // Boosts
  const user1Repo = await prisma.repository.findFirst({
    where: { registeredById: users[0].id }
  })
  
  if (user1Repo) {
    const issue = await prisma.issue.findFirst({
      where: { repositoryId: user1Repo.id }
    })
    
    if (issue) {
      await prisma.boost.create({
        data: {
          amount: 100,
          userId: users[2].id,
          issueId: issue.id
        }
      })
      console.log(`Created boost from ${users[2].username} to issue in ${user1Repo.fullName}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Adapter disconnect logic might be needed for pool?
    await prisma.$disconnect()
    await pool.end() // Explicitly close pool
  })
