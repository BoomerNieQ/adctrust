export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const attempts = await (prisma as any).donationAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(attempts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cause, amount } = await req.json();
  if (!cause || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const name = `${session.user.firstName} ${session.user.lastName}`;
  const attempt = await (prisma as any).donationAttempt.create({
    data: { name, cause, amount: parseFloat(amount) },
  });
  return NextResponse.json(attempt);
}
