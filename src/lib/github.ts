
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Parses a GitHub PR body to find linked issues.
 * Looks for "Closes #123", "Fixes #123", etc.
 */
export function extractLinkedIssueNumber(body: string | null): number | null {
  if (!body) return null;
  // Regex to match "closes #123", "fixes #123", etc.
  // GitHub supports: close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved
  // Followed by #<number>
  const regex = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#(\d+)/i;
  const match = body.match(regex);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Fetches issue details from GitHub.
 */
export async function getIssueDetails(owner: string, repo: string, issueNumber: number, token?: string) {
    // If a specific user token is provided, use it. Otherwise use the app token if available, or unauthenticated (rate limited).
    const client = token ? new Octokit({ auth: token }) : octokit;
    
    try {
        const { data } = await client.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
            owner,
            repo,
            issue_number: issueNumber,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return data;
    } catch (error) {
        console.error(`Failed to fetch issue ${owner}/${repo}#${issueNumber}:`, error);
        return null;
    }
}
