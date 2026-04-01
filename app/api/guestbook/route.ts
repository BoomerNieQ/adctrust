export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.guestbookEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { firstName: true, lastName: true } } },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { message } = await req.json();
  const trimmed = (message ?? "").trim();
  if (!trimmed || trimmed.length > 300) {
    return NextResponse.json({ error: "Ongeldig bericht (max 300 tekens)" }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.create({
    data: { userId: session.user.id, message: trimmed },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return NextResponse.json(entry);
}
