export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, OWNER_EMAIL } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Only the owner (dominique.bollen@dhl.com) can reset
  if (session.user.email !== OWNER_EMAIL) {
    return NextResponse.json(
      { error: "Alleen Dominique kan de score resetten 😤" },
      { status: 403 }
    );
  }

  await prisma.vote.deleteMany({});

  return NextResponse.json({ success: true, message: "Score gereset! Frisse start. 📦" });
}
