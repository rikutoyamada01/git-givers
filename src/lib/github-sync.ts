import prisma from "@/lib/prisma"

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  updated_at: string;
  pull_request?: unknown;
  user: {
    id: number;
    login: string;
  }
}

export async function syncRepositoryIssues(repositoryId: string, accessToken: string): Promise<number> {
    // Fetch repository details to get owner/name
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId },
    })

    if (!repository) {
      throw new Error("Repository not found")
    }

    // Fetch issues from GitHub
    const githubRes = await fetch(`https://api.github.com/repos/${repository.fullName}/issues?state=open&per_page=50`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/vnd.github.v3+json"
        }
    })

    if (!githubRes.ok) {
        const errorText = await githubRes.text()
        throw new Error(`GitHub API Error: ${githubRes.status} ${errorText}`)
    }

    const issues = await githubRes.json()
    
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
                authorGithubId: issue.user.id,
                authorLogin: issue.user.login,
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
                authorGithubId: issue.user.id,
                authorLogin: issue.user.login,
            }
        })
    }))

    const count = results.filter(r => r !== null).length
    return count;
}
