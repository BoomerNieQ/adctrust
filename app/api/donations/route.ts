export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const attempts = await prisma.donationAttempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(attempts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cause, amount } = await req.json();
  if (!cause || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const name = `${session.user.firstName} ${session.user.lastName}`;
  try {
    const attempt = await prisma.donationAttempt.create({
      data: { name, cause, amount: parseFloat(amount) },
    });
    return NextResponse.json(attempt);
  } catch {
    return NextResponse.json({ error: "DB not ready" }, { status: 503 });
  }
}
