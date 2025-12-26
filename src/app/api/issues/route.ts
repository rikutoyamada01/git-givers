
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repositoryId = searchParams.get('repositoryId')

    const whereClause: Prisma.IssueWhereInput = {
      state: 'open', // Always filter by open issues for now
    }
    
    // If repositoryId is provided, filter by it
    if (repositoryId) {
      whereClause.repositoryId = repositoryId
    }

    const issues = await prisma.issue.findMany({
      where: whereClause,
      include: {
        repository: true, // Include repository details
      },
      orderBy: {
        updatedAt: 'desc',
      },
      // Only limit if it's the general feed (no specific repo selected)
      take: repositoryId ? undefined : 20, 
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error("GET /api/issues Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
