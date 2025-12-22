
import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileView } from "@/components/dashboard/views/ProfileView";
import { Metadata } from "next";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, username: true },
  });

  if (!user) {
    return {
      title: "User Not Found - GitGivers",
    };
  }

  return {
    title: `${user.name || user.username} (@${user.username}) - GitGivers`,
    description: `Check out ${user.name || user.username}'s profile and Karma on GitGivers.`,
  };
}

export default async function PublicUserProfilePage({ params }: PageProps) {
  const { username } = params;


  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      karma: true,
    },
  });

  if (!user) {
    notFound();
  }

  const transactionsSent = await prisma.transaction.count({
    where: {
      userId: user.id,
      amount: { lt: 0 },
    },
  });

  const transactionsReceived = await prisma.transaction.count({
    where: {
      userId: user.id,
      amount: { gt: 0 },
    },
  });

  const userWithCounts = {
    ...user,
    _count: {
      transactionsSent,
      transactionsReceived,
    },
  };




  // Transform to match UserProfileData interface if necessary, 
  // but the shape selected closely matches what ProfileView expects.
  // ProfileView expects _count keys to be transactionsSent/Received, which matches our select.

  return (
    <div className="min-h-screen bg-background text-brand-text flex flex-col">
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <ProfileView initialUser={userWithCounts} editable={false} />
      </main>
    </div>
  );
}
