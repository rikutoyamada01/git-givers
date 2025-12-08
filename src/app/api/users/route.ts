import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name must not be empty")
    .max(100, "Name is too long")
    .optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),
})

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: session.user.id
      ? { id: session.user.id }
      : { email: session.user.email ?? undefined },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const json = await request.json().catch(() => null)
  if (!json || typeof json !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = updateUserSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  try {
    const updated = await prisma.user.update({
      where: session.user.id
        ? { id: session.user.id }
        : { email: session.user.email ?? undefined },
      data: {
        name: data.name,
        image: data.image,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[users][PATCH] Failed to update profile", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
