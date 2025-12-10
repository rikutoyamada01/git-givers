
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { issueId, amount } = await req.json();

    if (!issueId || !amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid boost parameters" },
        { status: 400 }
      );
    }

    // 1. Check User Balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { karma: true },
    });

    if (!user || user.karma < amount) {
      return NextResponse.json(
        { message: "Insufficient Karma" },
        { status: 403 }
      );
    }

    // 2. Check if Issue exists and is Open
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      );
    }

    if (issue.state !== "open") {
      return NextResponse.json(
        { message: "Cannot boost a closed issue" },
        { status: 400 }
      );
    }

    // 3. Execute Transaction (Deduct Karma, Create Boost, Create Transaction Record)
    // NOTE: Creating a Transaction record for 'spent' karma helps history tracking.
    // The previous implementation used Transaction model for history.
    
    // We update User Karma -> Create Boost -> Create Transaction log
    const result = await prisma.$transaction(async (tx) => {
        // Deduct
        await tx.user.update({
            where: { id: session.user.id },
            data: { karma: { decrement: amount } },
        });

        // Create Boost
        const boost = await tx.boost.create({
            data: {
                amount,
                userId: session.user.id!,
                issueId: issueId,
            },
        });

        // Log Transaction
        await tx.transaction.create({
            data: {
                amount: -amount,
                description: `Boosted Issue #${issue.number}`,
                userId: session.user.id!,
                repositoryId: issue.repositoryId, 
            },
        });

        return boost;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Boost failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
