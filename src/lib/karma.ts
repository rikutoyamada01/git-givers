/**
 * Core Karma Logic
 * Based on docs/architecture/04-core-logic.md
 */

// 4.2.1 K_base (Base Reward)
export const BASE_ISSUE_REWARD = 100;

// Repository Registration Cost (from previous implementation, centralized here)
export const REPOSITORY_REGISTRATION_COST = 50;

/**
 * Calculates the Discovery Multiplier based on repository stars.
 * 4.2.2 M_discovery
 * 
 * | GitHub Stars | Multiplier |
 * | :--- | :--- |
 * | 0 | 3.0x |
 * | 1 - 100 | 2.0x |
 * | 101 - 1000 | 1.5x |
 * | 1000+ | 1.0x |
 */
export function calculateDiscoveryMultiplier(stars: number): number {
  if (stars === 0) return 3.0;
  if (stars <= 100) return 2.0;
  if (stars <= 1000) return 1.5;
  return 1.0;
}

/**
 * Calculates total Karma reward for an issue.
 * 4.2 The Karma Formula
 * K_total = (K_base * M_discovery) + sum(K_boost)
 */
export function calculateIssueReward(params: {
  stars: number;
  totalUserBoost?: number;
}): number {
  const { stars, totalUserBoost = 0 } = params;
  const multiplier = calculateDiscoveryMultiplier(stars);
  const baseReward = BASE_ISSUE_REWARD * multiplier;
  
  return Math.floor(baseReward + totalUserBoost);
}

/**
 * Validates if an issue payout is legitimate based on Anti-Gaming rules.
 * 4.3 Anti-Gaming Mechanics
 */
export function validateIssuePayout(params: {
  issueAuthorId: string;
  repoOwnerId?: string; // If repo is owned by a user
  assigneeId: string;
  reviewerId?: string;
}): { valid: boolean; reason?: string } {
  const { issueAuthorId, repoOwnerId, assigneeId, reviewerId } = params;

  // 4.3.1 No Self-Dealing
  // Assignee cannot be the Author (User A creates issue, fixes it themselves)
  if (assigneeId === issueAuthorId) {
    return { valid: false, reason: "Self-dealing: Assignee is the Issue Author." };
  }

  // Assignee cannot be the Repo Owner
  if (repoOwnerId && assigneeId === repoOwnerId) {
    return { valid: false, reason: "Self-dealing: Assignee is the Repo Owner." };
  }
  
  // If the issue creator is also the one fixing it, it MIGHT be okay if it's not their own repo?
  // But generally "No Self-Dealing" implies you shouldn't get karma for fixing your own issue if you are the "client".
  // The doc example says "User A creates a repo...".
  // Let's stick to the explicit rules in doc:
  // 1. Reviewer == Author (PR Author/Assignee) -> Invalid (You can't review your own PR).
  // 2. Assignee == Repo.owner -> Invalid.

  if (reviewerId && reviewerId === assigneeId) {
      return { valid: false, reason: "Self-dealing: Reviewer cannot be the Assignee." };
  }

  return { valid: true };
}
