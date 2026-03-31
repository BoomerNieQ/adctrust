export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/lib/score";

const MONTHS_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

interface DayBucket {
  date: string;       // YYYY-MM-DD
  score: number;      // net votes this day
  positive: number;
  negative: number;
  total: number;
}

interface MonthBucket {
  month: string;      // YYYY-MM
  monthName: string;
  year: number;
  score: number;
  positive: number;
  negative: number;
  total: number;
  bestDay: string | null;   // YYYY-MM-DD with highest net day
  worstDay: string | null;  // YYYY-MM-DD with lowest net day
  comment: string;
  emoji: string;
}

function getMonthComment(
  monthName: string,
  score: number,
  total: number,
  bestDay: string | null,
  worstDay: string | null
): { comment: string; emoji: string } {
  if (total === 0) return { comment: `Nog geen stemmen in ${monthName}`, emoji: "📭" };

  if (score > 60) {
    return { comment: `${monthName} was een absolute topmaand voor Dominique!`, emoji: "🏆" };
  }
  if (score > 30) {
    if (bestDay) {
      const d = new Date(bestDay + "T12:00:00Z");
      const day = d.getUTCDate();
      return {
        comment: `Op ${day} ${monthName.toLowerCase()} hadden de meeste mensen vertrouwen in Dominique`,
        emoji: "😊",
      };
    }
    return { comment: `${monthName} was een goede maand voor het vertrouwen`, emoji: "😊" };
  }
  if (score > 10) {
    return { comment: `${monthName} was lichtelijk positief — Dominique mag niet klagen`, emoji: "🤔" };
  }
  if (score > 0) {
    return { comment: `${monthName} was twijfelachtig maar net positief`, emoji: "😐" };
  }
  if (score === 0) {
    return { comment: `${monthName} was precies in balans — onbeslist!`, emoji: "⚖️" };
  }
  if (score > -10) {
    return { comment: `${monthName} was twijfelachtig maar net negatief`, emoji: "😕" };
  }
  if (score > -30) {
    return { comment: `${monthName} was niet zo'n lekkere maand voor Dominique`, emoji: "😬" };
  }
  if (score > -60) {
    if (worstDay) {
      const d = new Date(worstDay + "T12:00:00Z");
      const day = d.getUTCDate();
      return {
        comment: `Op ${day} ${monthName.toLowerCase()} was het wantrouwen op zijn hoogtepunt`,
        emoji: "😤",
      };
    }
    return { comment: `${monthName} was een slechte maand voor het vertrouwen`, emoji: "💀" };
  }
  return { comment: `${monthName} was een rampmaand — Dominique heeft wat uit te leggen!`, emoji: "🚨" };
}

export async function GET() {
  const votes = await prisma.vote.findMany({
    orderBy: { createdAt: "asc" },
    select: { value: true, createdAt: true },
  });

  // ── Daily buckets ─────────────────────────────────────────────────────────
  const dayMap = new Map<string, DayBucket>();

  for (const v of votes) {
    // Use UTC date string to avoid timezone drift
    const d = v.createdAt;
    const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

    if (!dayMap.has(dateStr)) {
      dayMap.set(dateStr, { date: dateStr, score: 0, positive: 0, negative: 0, total: 0 });
    }
    const bucket = dayMap.get(dateStr)!;
    bucket.total += 1;
    if (v.value > 0) bucket.positive++;
    else bucket.negative++;
    // Recompute percentage score after each vote
    bucket.score = calculateScore(bucket.positive, bucket.negative);
  }

  // Fill last 30 days (including empty days)
  const today = new Date();
  const daily: DayBucket[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    const dateStr = d.toISOString().split("T")[0];
    daily.push(dayMap.get(dateStr) ?? { date: dateStr, score: 0, positive: 0, negative: 0, total: 0 });
  }

  // ── Monthly buckets ────────────────────────────────────────────────────────
  const monthMap = new Map<
    string,
    { score: number; positive: number; negative: number; total: number; dayScores: Map<string, number> }
  >();

  for (const [dateStr, dayData] of dayMap) {
    const monthKey = dateStr.substring(0, 7); // YYYY-MM
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { score: 0, positive: 0, negative: 0, total: 0, dayScores: new Map() });
    }
    const m = monthMap.get(monthKey)!;
    m.positive += dayData.positive;
    m.negative += dayData.negative;
    m.total += dayData.total;
    m.score = calculateScore(m.positive, m.negative);
    m.dayScores.set(dateStr, dayData.score);
  }

  const monthly: MonthBucket[] = [...monthMap.entries()]
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
    .map(([monthKey, data]) => {
      const [yearStr, monthIdxStr] = monthKey.split("-");
      const year = parseInt(yearStr);
      const monthIdx = parseInt(monthIdxStr) - 1;
      const monthName = MONTHS_NL[monthIdx];

      // Find best and worst day
      let bestDay: string | null = null;
      let worstDay: string | null = null;
      let bestScore = -Infinity;
      let worstScore = Infinity;

      for (const [dateStr, dayScore] of data.dayScores) {
        if (data.total > 0) {
          if (dayScore > bestScore) { bestScore = dayScore; bestDay = dateStr; }
          if (dayScore < worstScore) { worstScore = dayScore; worstDay = dateStr; }
        }
      }

      // Only report best/worst if they're meaningfully different
      if (bestScore <= 0) bestDay = null;
      if (worstScore >= 0) worstDay = null;

      const { comment, emoji } = getMonthComment(monthName, data.score, data.total, bestDay, worstDay);

      return {
        month: monthKey,
        monthName,
        year,
        score: data.score,
        positive: data.positive,
        negative: data.negative,
        total: data.total,
        bestDay,
        worstDay,
        comment,
        emoji,
      };
    });

  return NextResponse.json({ daily, monthly });
}
