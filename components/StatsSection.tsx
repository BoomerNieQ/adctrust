"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface DayBucket {
  date: string;
  score: number;
  positive: number;
  negative: number;
  total: number;
}

interface MonthBucket {
  month: string;
  monthName: string;
  monthNameFr: string;
  year: number;
  score: number;
  positive: number;
  negative: number;
  total: number;
  bestDay: string | null;
  worstDay: string | null;
  comment: string;
  commentFr: string;
  emoji: string;
}

function formatDateLabel(dateStr: string, monthsShort: string[]): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.getUTCDate()} ${monthsShort[d.getUTCMonth()]}`;
}

function formatDayShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return String(d.getUTCDate());
}

// ─── Daily Bar Chart ─────────────────────────────────────────────────────────
function DailyChart({ days }: { days: DayBucket[] }) {
  const { t } = useLang();
  // Show last 14 days
  const visible = days.slice(-14);
  const maxAbs = Math.max(1, ...visible.map((d) => Math.abs(d.score)));

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#242424", border: "1px solid rgba(255,204,0,0.15)" }}
    >
      <h3 className="font-boogaloo text-lg mb-1" style={{ color: "#FFCC00" }}>
        {t.statsPerDay}
      </h3>
      <p className="text-white/30 text-xs font-boogaloo mb-5">{t.statsLast14}</p>

      {/* Chart area */}
      <div className="flex items-end gap-1.5 h-32 relative">
        {/* Zero line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ top: "50%", borderColor: "rgba(255,204,0,0.25)" }}
        />

        {visible.map((d, i) => {
          const pct = d.score === 0 ? 0 : (Math.abs(d.score) / maxAbs) * 45; // max 45% of height
          const isPos = d.score >= 0;
          const color = d.score > 0 ? "#22c55e" : d.score < 0 ? "#D40511" : "rgba(255,255,255,0.15)";
          const isEmpty = d.total === 0;

          return (
            <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-center group relative">
              {/* Tooltip */}
              <div
                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-boogaloo whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
                style={{ background: "#1C1C1C", border: "1px solid rgba(255,204,0,0.3)", color: "#FFCC00" }}
              >
                {formatDateLabel(d.date, t.monthsShort as string[])}: {d.score > 0 ? `+${d.score}` : d.score}
                {d.total > 0 && <span className="text-white/40"> ({t.statsVotesSuffix(d.total)})</span>}
              </div>

              {/* Positive bar (above center) */}
              <div className="w-full flex flex-col items-center" style={{ height: "50%" }}>
                <div className="flex-1" />
                {isPos && !isEmpty && (
                  <motion.div
                    className="w-full rounded-t"
                    style={{ background: color, minHeight: 2 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct * 2}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                  />
                )}
                {isEmpty && (
                  <div className="w-full rounded" style={{ height: 2, background: "rgba(255,255,255,0.1)" }} />
                )}
              </div>

              {/* Negative bar (below center) */}
              <div className="w-full flex flex-col items-center" style={{ height: "50%" }}>
                {!isPos && !isEmpty && (
                  <motion.div
                    className="w-full rounded-b"
                    style={{ background: color, minHeight: 2 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct * 2}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                  />
                )}
                <div className="flex-1" />
              </div>

              {/* Date label */}
              <span className="text-white/30 text-xs mt-1 font-boogaloo" style={{ fontSize: 9 }}>
                {formatDayShort(d.date)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs font-boogaloo text-white/40">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#22c55e" }} />
          {t.statsMoreTrust}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#D40511" }} />
          {t.statsLessTrust}
        </span>
      </div>
    </div>
  );
}

// ─── Monthly Score Badge ──────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score > 0 ? "#22c55e" : score < 0 ? "#D40511" : "#FFCC00";
  const bg = score > 0 ? "rgba(34,197,94,0.12)" : score < 0 ? "rgba(212,5,17,0.12)" : "rgba(255,204,0,0.12)";
  return (
    <span
      className="text-lg font-fredoka font-bold px-3 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      {score > 0 ? `+${score}` : score}
    </span>
  );
}

// ─── Monthly Card ─────────────────────────────────────────────────────────────
function MonthCard({ m, index }: { m: MonthBucket; index: number }) {
  const { t, lang } = useLang();
  const positivePct = m.total > 0 ? (m.positive / m.total) * 100 : 0;
  const negativePct = m.total > 0 ? (m.negative / m.total) * 100 : 0;

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.07)" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-fredoka font-bold text-white text-xl leading-tight">
            {lang === "fr" ? m.monthNameFr : m.monthName} {m.year}
          </h4>
          <p className="text-white/35 text-xs font-boogaloo mt-0.5">
            {t.statsVotesSuffix(m.total)}
          </p>
        </div>
        <ScoreBadge score={m.score} />
      </div>

      {/* The funny Dutch comment — the star of the show */}
      <div
        className="rounded-lg px-3 py-2.5 mb-3"
        style={{ background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.12)" }}
      >
        <p className="font-boogaloo text-sm leading-snug" style={{ color: "rgba(255,204,0,0.9)" }}>
          <span className="text-base mr-1.5">{m.emoji}</span>
          {lang === "fr" ? m.commentFr : m.comment}
        </p>
      </div>

      {/* Positive/negative mini bar */}
      {m.total > 0 && (
        <div>
          <div className="flex rounded-full overflow-hidden h-1.5 bg-white/10">
            <motion.div
              style={{ background: "#22c55e", width: `${positivePct}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${positivePct}%` }}
              transition={{ duration: 0.6, delay: index * 0.07 + 0.2 }}
            />
            <motion.div
              style={{ background: "#D40511", width: `${negativePct}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${negativePct}%` }}
              transition={{ duration: 0.6, delay: index * 0.07 + 0.2 }}
            />
          </div>
          <div className="flex justify-between text-xs font-boogaloo text-white/25 mt-1">
            <span>👍 {m.positive}</span>
            <span>👎 {m.negative}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function StatsSection() {
  const { t } = useLang();
  const [daily, setDaily] = useState<DayBucket[]>([]);
  const [monthly, setMonthly] = useState<MonthBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setDaily(data.daily ?? []);
        setMonthly(data.monthly ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="font-boogaloo text-white/30 animate-pulse">{t.statsLoading}</div>
      </div>
    );
  }

  const hasData = daily.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#242424", border: "1px solid rgba(255,204,0,0.15)" }}
      >
        <div className="text-4xl mb-2">📊</div>
        <p className="text-white/40 font-boogaloo text-lg">
          {t.statsEmpty}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(255,204,0,0.15)" }} />
        <h2 className="font-fredoka font-bold text-white/60 text-sm uppercase tracking-widest">
          {t.statsTitle}
        </h2>
        <div className="h-px flex-1" style={{ background: "rgba(255,204,0,0.15)" }} />
      </div>

      {/* Daily chart */}
      <DailyChart days={daily} />

      {/* Monthly cards */}
      {monthly.length > 0 && (
        <div>
          <h3 className="font-boogaloo text-lg mb-3" style={{ color: "#FFCC00" }}>
            {t.statsPerMonth}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {monthly.map((m, i) => (
              <MonthCard key={m.month} m={m} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
