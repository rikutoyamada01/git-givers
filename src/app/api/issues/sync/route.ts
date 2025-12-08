
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  updated_at: string;
  pull_request?: unknown;
}

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

    // Fetch repository details to get owner/name
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId },
    })

    if (!repository) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 })
    }

    // Fetch issues from GitHub
    // Using user's access token if available, essentially acting on their behalf
    // Token already validated above

    const githubRes = await fetch(`https://api.github.com/repos/${repository.fullName}/issues?state=open&per_page=50`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    })

    if (!githubRes.ok) {
        const errorText = await githubRes.text()
        return NextResponse.json({ error: `GitHub API Error: ${githubRes.status} ${errorText}` }, { status: githubRes.status })
    }

    const issues = await githubRes.json()
    // Type saftey for issues? explicit any for now or define type
    
    // Upsert issues to DB
    const results = await Promise.all(issues.map(async (issue: GitHubIssue) => {
        // Skip Pull Requests (GitHub API returns PRs as issues)
        if (issue.pull_request) return null

        return prisma.issue.upsert({
            where: { githubId: issue.id },
            update: {
                title: issue.title,
                body: issue.body,
                state: issue.state,
                updatedAt: new Date(issue.updated_at),
                repositoryId: repository.id,
                // If assignee logic needed
            },
            create: {
                githubId: issue.id,
                number: issue.number,
                title: issue.title,
                body: issue.body,
                state: issue.state,
                htmlUrl: issue.html_url,
                repositoryId: repository.id,
                updatedAt: new Date(issue.updated_at),
            }
        })
    }))

    const count = results.filter(r => r !== null).length

    return NextResponse.json({ success: true, count, message: `Synced ${count} issues` })

  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
