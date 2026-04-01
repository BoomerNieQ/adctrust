export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["👍", "❤️", "😂"];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { emoji } = await req.json();
  if (!ALLOWED.includes(emoji)) {
    return NextResponse.json({ error: "Ongeldige reactie" }, { status: 400 });
  }

  const entryId = params.id;
  const userId = session.user.id;

  // Toggle: delete if exists, create if not
  const existing = await prisma.guestbookReaction.findUnique({
    where: { entryId_userId_emoji: { entryId, userId, emoji } },
  });

  if (existing) {
    await prisma.guestbookReaction.delete({ where: { id: existing.id } });
    return NextResponse.json({ added: false });
  } else {
    await prisma.guestbookReaction.create({ data: { entryId, userId, emoji } });
    return NextResponse.json({ added: true });
  }
}
