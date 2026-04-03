export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const birthdays = await prisma.birthday.findMany({
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: [{ month: "asc" }, { day: "asc" }],
    });
    const myUserId = session?.user?.id ?? null;
    const hasOwn = myUserId ? birthdays.some((b) => b.userId === myUserId) : false;
    return NextResponse.json({ birthdays, hasOwn });
  } catch {
    return NextResponse.json({ birthdays: [], hasOwn: false });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { day, month } = await req.json();
  if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
    return NextResponse.json({ error: "Ongeldige datum" }, { status: 400 });
  }

  const entry = await prisma.birthday.upsert({
    where: { userId: session.user.id },
    update: { day, month },
    create: { userId: session.user.id, day, month },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return NextResponse.json(entry);
}
