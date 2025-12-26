
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { syncRepositoryIssues } from "@/lib/github-sync"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = session.user.accessToken
  if (!token) {
    return NextResponse.json({ error: "GitHub Access Token missing in session" }, { status: 401 })
  }

  try {
    const { repositoryId } = await req.json()

    if (!repositoryId) {
      return NextResponse.json({ error: "Repository ID is required" }, { status: 400 })
    }

    const count = await syncRepositoryIssues(repositoryId, token);

    return NextResponse.json({ success: true, count, message: `Synced ${count} issues` })

  } catch (error: unknown) {
    console.error("Sync error:", error)
    // Handle known errors (like 404 from our helper) or generic 500
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    let status = 500;
    if (errorMessage.includes("GitHub API Error")) {
        status = 502;
    } else if (errorMessage === "Repository not found") {
        status = 404;
    }
    return NextResponse.json({ error: errorMessage || "Internal Server Error" }, { status })
  }
}
