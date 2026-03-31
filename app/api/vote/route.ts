export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/lib/score";

const RATE_LIMIT_MINUTES = 10;

export async function GET() {
  const [votes, positiveCount, negativeCount] = await Promise.all([
    prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.vote.count({ where: { value: 1 } }),
    prisma.vote.count({ where: { value: -1 } }),
  ]);

  const count = positiveCount + negativeCount;
  const score = calculateScore(positiveCount, negativeCount);

  return NextResponse.json({
    score,
    count,
    positiveCount,
    negativeCount,
    lastVote: votes[0]?.createdAt ?? null,
    recentVoters: votes.map((v) => ({
      firstName: v.user.firstName,
      lastName: v.user.lastName,
      value: v.value,
      createdAt: v.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await req.json();
  const value = body.value;

  if (value !== 1 && value !== -1) {
    return NextResponse.json({ error: "Ongeldige stem" }, { status: 400 });
  }

  const rateLimitCutoff = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000);
  const recentVote = await prisma.vote.findFirst({
    where: { userId: session.user.id, createdAt: { gte: rateLimitCutoff } },
    orderBy: { createdAt: "desc" },
  });

  if (recentVote) {
    const nextAllowed = new Date(recentVote.createdAt.getTime() + RATE_LIMIT_MINUTES * 60 * 1000);
    const waitMs = nextAllowed.getTime() - Date.now();
    const waitMins = Math.ceil(waitMs / 60000);
    return NextResponse.json(
      { error: `Te snel! Wacht nog ${waitMins} minuut${waitMins !== 1 ? "en" : ""}.` },
      { status: 429 }
    );
  }

  await prisma.vote.create({ data: { value, userId: session.user.id } });

  const [positiveCount, negativeCount] = await Promise.all([
    prisma.vote.count({ where: { value: 1 } }),
    prisma.vote.count({ where: { value: -1 } }),
  ]);

  const count = positiveCount + negativeCount;
  const score = calculateScore(positiveCount, negativeCount);
  return NextResponse.json({ success: true, score, count, positiveCount, negativeCount });
}
