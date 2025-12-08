
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic fetch: get all issues from registered repositories
    // In future: Filter by "Recommended", or boost logic
    const issues = await prisma.issue.findMany({
      where: {
        state: 'open', // Only show open issues in feed
      },
      include: {
        repository: true, // Include repository details
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 20, // Limit for now
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Failed to fetch issues", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
