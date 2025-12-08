import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Method not allowed. Use system actions to earn karma." }, { status: 405 })
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id
    },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(transactions)
}
