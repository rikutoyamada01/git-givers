/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "@octokit/webhooks-methods";
import { extractLinkedIssueNumber } from "@/lib/github";
import { calculateIssueReward } from "@/lib/karma";


// Exported for testing
export async function validateSignature(req: NextRequest): Promise<boolean> {
   const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
   if (!WEBHOOK_SECRET) return false;
   
   const signature = req.headers.get("x-hub-signature-256");
   const body = await req.text();
   if (!signature) return false;
   
   return verify(WEBHOOK_SECRET, body, signature);
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("GITHUB_WEBHOOK_SECRET is not set");
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
  }

  // NOTE: verifying signature consumes the body stream, so we need to clone or handle it carefully.
  // Actually, req.text() consumes it.
  // In Next.js, we can read it once.
  
  const signature = req.headers.get("x-hub-signature-256");
  const body = await req.text();

  if (!signature) {
    return NextResponse.json({ message: "Missing signature" }, { status: 401 });
  }

  try {
    const isValid = await verify(WEBHOOK_SECRET, body, signature);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
  } catch (error) {
    console.error("Signature verification failed", error);
    return NextResponse.json({ message: "Signature verification failed" }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = req.headers.get("x-github-event");

  if (event === "ping") {
    return NextResponse.json({ message: "Pong" }, { status: 200 });
  }

  if (event === "pull_request") {
    const { action, pull_request, repository, sender: _sender } = payload;
    // We only care about closed PRs that were merged
    if (action === "closed" && pull_request.merged === true) {
      return handleMergedPR(pull_request, repository, _sender);
    }
  }

  return NextResponse.json({ message: "Event ignored" }, { status: 200 });
}

// Exported for testing
 
export async function handleMergedPR(pr: any, repo: any, sender: any) {
  console.log(`Processing merged PR #${pr.number} in ${repo.full_name}`);
  // ... (rest of logic)
  // 1. Check if Repo is registered in GitGivers
  const registeredRepo = await prisma.repository.findUnique({
    where: { githubId: repo.id },
    include: { registeredBy: true }, // We might need this for something later
  });

  if (!registeredRepo) {
    console.log(`Repo ${repo.full_name} is not registered. Ignoring.`);
    return NextResponse.json({ message: "Repository not registered" }, { status: 200 });
  }

  // 2. Find linked Issue
  // Try to parse "Closes #123" from PR body
  const issueNumber = extractLinkedIssueNumber(pr.body);

  if (!issueNumber) {
    console.log("No linked issue found in PR body.");
    return NextResponse.json({ message: "No linked issue found" }, { status: 200 });
  }

  // 3. Find Issue in our DB (It must be registered/synced to enable payment)
  const issue = await prisma.issue.findFirst({
    where: {
      repositoryId: registeredRepo.id,
      number: issueNumber,
    },
    include: { boosts: true }
  });

  if (!issue) {
      console.log(`Issue #${issueNumber} not found in DB. Skipping payout.`);
      return NextResponse.json({ message: `Issue #${issueNumber} not monitored` }, { status: 200 });
  }

  // CRITICAL FIX: Prevent Replay Attack / Double Spending
  if (issue.state === 'closed') {
      console.log(`Issue #${issueNumber} is already closed. Skipping payout to prevent double-spending.`);
      return NextResponse.json({ message: "Issue already closed", type: "replay_prevention" }, { status: 200 });
  }
  
  // 4. Identify Solver (PR Author)
  // NOTE: 'sender' is the person who triggered the event (merged the PR), usually the maintainer.
  // The 'solver' is the person who wrote the PR code (pr.user).
  const solverGithubId: number = pr.user.id;
  
  const solverAccount = await prisma.account.findFirst({
    where: {
      provider: "github",
      providerAccountId: String(solverGithubId),
    },
    include: { user: true },
  });
  
  if (!solverAccount || !solverAccount.user) {
      console.log(`Solver (PR Author: ${pr.user.login}) is not a GitGivers user.`);
      return NextResponse.json({ message: "Solver is not a registered user" }, { status: 200 });
  }
  
  const solver = solverAccount.user;

  // Validation: Anti-Gaming
  // 1. Solver cannot be the Issue Author (Self-Dealing)
  if (issue.authorGithubId && issue.authorGithubId === solverGithubId) {
       console.log("Anti-Gaming: Solver is Issue Author. 0 Karma.");
       return NextResponse.json({ message: "Payout skipped: Self-dealing (Solver is Issue Author)" }, { status: 200 });
  }

  // 2. Solver cannot be the Repo Owner (Self-Dealing)
  if (solver.id === registeredRepo.registeredById) {
       console.log("Anti-Gaming: Solver is Repo Owner. 0 Karma.");
       return NextResponse.json({ message: "Payout skipped: Self-dealing (Solver is Repo Owner)" }, { status: 200 });
  }
 
  // 5. Calculate Reward
  const totalUserBoost = (issue as any).boosts.reduce((sum: any, boost: any) => sum + boost.amount, 0);
  
  const reward = calculateIssueReward({
      stars: (registeredRepo as any).stargazersCount,
      totalUserBoost: totalUserBoost,
  });
  
  // 6. Execute Payout
  await prisma.$transaction(async (tx) => {
      // 6.1 Give Karma to Solver
      await tx.user.update({
          where: { id: solver.id },
          data: { karma: { increment: reward } },
      });
      
      // 6.2 Record Transaction
      await tx.transaction.create({
          data: {
              amount: reward,
              description: `Reward for fixing ${repo.full_name}#${issueNumber}`,
              userId: solver.id,
              repositoryId: registeredRepo.id,
          },
      });
      
      // 6.3 Update Issue State
      await tx.issue.update({
          where: { id: issue.id },
          data: { state: "closed" },
      });
  });
  
  console.log(`Paid ${reward} Karma to ${solver.username}`);
  return NextResponse.json({ message: "Payout processed", reward }, { status: 200 });
}
