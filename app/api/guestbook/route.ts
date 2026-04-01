export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMOJIS = ["👍", "❤️", "😂"];

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const entries = await prisma.guestbookEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { firstName: true, lastName: true } },
      reactions: { select: { emoji: true, userId: true } },
    },
  });

  const result = entries.map((e) => {
    const counts: Record<string, number> = {};
    const mine: string[] = [];
    for (const emoji of EMOJIS) counts[emoji] = 0;
    for (const r of e.reactions) {
      counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
      if (r.userId === userId) mine.push(r.emoji);
    }
    return {
      id: e.id,
      message: e.message,
      createdAt: e.createdAt,
      user: e.user,
      reactions: counts,
      myReactions: mine,
    };
  });

  return NextResponse.json(result);
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

  const counts: Record<string, number> = { "👍": 0, "❤️": 0, "😂": 0 };
  return NextResponse.json({ ...entry, reactions: counts, myReactions: [] });
}
