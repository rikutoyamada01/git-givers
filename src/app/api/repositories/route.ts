import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

import { REPOSITORY_REGISTRATION_COST } from "@/lib/karma"

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { githubId, name, fullName, url, description, stargazersCount } = await req.json()

    if (!githubId || !name || !fullName || !url) {
      return NextResponse.json(
        { message: "Missing required repository fields" },
        { status: 400 },
      )
    }

    const existingRepository = await prisma.repository.findUnique({
      where: { githubId: githubId },
    })

    if (existingRepository) {
      return NextResponse.json(
        { message: "Repository already registered" },
        { status: 409 },
      )
    }

    // Check user's Karma
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { karma: true },
    })

    if (!user || user.karma < REPOSITORY_REGISTRATION_COST) {
      return NextResponse.json(
        { message: `Insufficient Karma. You need ${REPOSITORY_REGISTRATION_COST} Karma to register a repository.` },
        { status: 403 },
      )
    }

    // Execute transaction: Deduct Karma, Create Transaction, Create Repository
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct Karma
      await tx.user.update({
        where: { id: session.user.id },
        data: { karma: { decrement: REPOSITORY_REGISTRATION_COST } },
      })

      // 2. Create Transaction Record
      await tx.transaction.create({
        data: {
          amount: -REPOSITORY_REGISTRATION_COST, // Negative for spending
          description: `Register repository: ${fullName}`,
          userId: session.user.id!,
        },
      })

      // 3. Create Repository
      const newRepository = await tx.repository.create({
        data: {
          githubId,
          name,
          fullName,
          url,
          description,
          stargazersCount: stargazersCount || 0,
          registeredBy: {
            connect: {
              id: session.user.id,
            },
          },
        },
      })

      return newRepository
    })

    // 4. Auto-Sync Issues (Outside of transaction to avoid blocking DB if it takes long)
    // We swallow errors here because the registration itself was successful.
    // The user can manually sync later if this fails.
    if (session.user.accessToken) {
        try {
            const { syncRepositoryIssues } = await import("@/lib/github-sync");
            await syncRepositoryIssues(result.id, session.user.accessToken);
            console.log(`Auto-synced issues for newly registered repo: ${fullName}`);
        } catch (syncError) {
            console.error(`Auto-sync failed for ${fullName}:`, syncError);
        }
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error registering repository:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const owned = searchParams.get('owned') === 'true'
    const viewer = searchParams.get('viewer') === 'true'

    const whereClause: { registeredById?: string } = {}
    if (owned || viewer) {
        whereClause.registeredById = session.user.id
    }

    const repositories = await prisma.repository.findMany({
      where: whereClause,
      include: {
        registeredBy: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(repositories)
  } catch (error) {
    console.error("Error fetching registered repositories:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
