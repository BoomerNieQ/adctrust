"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface BirthdayEntry {
  id: string;
  userId: string;
  day: number;
  month: number;
  user: { firstName: string; lastName: string };
}

export default function BirthdayWidget() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [entries, setEntries] = useState<BirthdayEntry[]>([]);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hasOwn, setHasOwn] = useState(false);

  useEffect(() => {
    fetch("/api/birthdays")
      .then((r) => r.ok ? r.json() : { birthdays: [], hasOwn: false })
      .then(({ birthdays, hasOwn: own }: { birthdays: BirthdayEntry[]; hasOwn: boolean }) => {
        setEntries(birthdays);
        setHasOwn(own);
      })
      .catch(() => {});
  }, [session]);

  async function fetchEntries() {
    const res = await fetch("/api/birthdays");
    if (res.ok) {
      const { birthdays, hasOwn: own } = await res.json();
      setEntries(birthdays);
      setHasOwn(own);
    }
  }

  async function save() {
    if (!day || !month) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/birthdays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: Number(day), month: Number(month) }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchEntries();
      setDay("");
      setMonth("");
      setHasOwn(true);
    } else {
      setError(data.error ?? "Er ging iets mis");
    }
    setSaving(false);
  }

  const today = new Date();
  const todayD = today.getDate();
  const todayM = today.getMonth() + 1;

  function daysUntil(day: number, month: number) {
    const now = new Date();
    const year = now.getFullYear();
    let next = new Date(year, month - 1, day);
    if (next.setHours(0,0,0,0) < now.setHours(0,0,0,0)) {
      next = new Date(year + 1, month - 1, day);
    }
    return (next.getTime() - new Date().setHours(0,0,0,0)) / 86400000;
  }

  const sorted = [...entries].sort((a, b) => daysUntil(a.day, a.month) - daysUntil(b.day, b.month));

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#242424", border: "1px solid rgba(255,204,0,0.15)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1" style={{ background: "rgba(255,204,0,0.15)" }} />
        <h2 className="font-fredoka font-bold text-white/60 text-sm uppercase tracking-widest">
          {t.birthdayTitle}
        </h2>
        <div className="h-px flex-1" style={{ background: "rgba(255,204,0,0.15)" }} />
      </div>

      {/* Add birthday form for logged-in users without one */}
      {session && !hasOwn && (
        <div
          className="rounded-xl p-3 mb-4"
          style={{ background: "rgba(212,5,17,0.07)", border: "1px solid rgba(212,5,17,0.2)" }}
        >
          <p className="text-white/60 text-xs font-boogaloo mb-2">{t.birthdayAdd}</p>
          <div className="flex gap-2 flex-wrap">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-lg px-2 py-1.5 text-sm font-boogaloo outline-none"
              style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <option value="">{t.birthdaySelectDay}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg px-2 py-1.5 text-sm font-boogaloo outline-none"
              style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <option value="">{t.birthdaySelectMonth}</option>
              {(t.months as string[]).map((m: string, i: number) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <motion.button
              onClick={save}
              disabled={saving || !day || !month}
              className="px-4 py-1.5 rounded-full font-boogaloo text-sm font-bold disabled:opacity-40"
              style={{ background: "#D40511", color: "white" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {saving ? "..." : t.birthdayAddBtn}
            </motion.button>
          </div>
          {error && <p className="text-red-400 text-xs mt-1 font-boogaloo">{error}</p>}
        </div>
      )}
      {session && hasOwn && (
        <p className="text-white/30 text-xs font-boogaloo mb-3">{t.birthdayAlreadyAdded}</p>
      )}

      {/* Birthday list */}
      {sorted.length === 0 ? (
        <p className="text-white/30 text-sm font-boogaloo text-center py-6">{t.birthdayEmpty}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {sorted.map((entry) => {
            const isToday = entry.day === todayD && entry.month === todayM;
            return (
              <motion.div
                key={entry.id}
                className="rounded-xl px-3 py-2.5 text-center"
                style={{
                  background: isToday ? "rgba(255,204,0,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isToday ? "rgba(255,204,0,0.4)" : "rgba(255,255,255,0.07)"}`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-lg mb-0.5">{isToday ? "🎂" : "🎁"}</div>
                <p className="font-boogaloo text-xs font-bold leading-tight" style={{ color: isToday ? "#FFCC00" : "rgba(255,255,255,0.8)" }}>
                  {entry.user.firstName}
                </p>
                <p className="font-boogaloo text-xs" style={{ color: isToday ? "#FFCC00" : "rgba(255,255,255,0.35)" }}>
                  {entry.day} {(t.monthsShort as string[])[entry.month - 1]}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
