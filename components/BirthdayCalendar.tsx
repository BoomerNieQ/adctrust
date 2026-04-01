"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface BirthdayEntry {
  id: string;
  day: number;
  month: number;
  user: { firstName: string; lastName: string };
}

export default function BirthdayCalendar() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<BirthdayEntry[]>([]);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hasOwn, setHasOwn] = useState(false);

  useEffect(() => {
    if (open) fetchEntries();
  }, [open]);

  async function fetchEntries() {
    const res = await fetch("/api/birthdays");
    if (res.ok) {
      const data: BirthdayEntry[] = await res.json();
      setEntries(data);
      if (session?.user) {
        const userId = (session.user as any).id;
        setHasOwn(data.some((e: any) => e.userId === userId));
      }
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

  // Sort: upcoming first (from today), then wrap around
  const sorted = [...entries].sort((a, b) => {
    const aDays = ((a.month - todayM) * 31 + (a.day - todayD) + 365) % 365;
    const bDays = ((b.month - todayM) * 31 + (b.day - todayD) + 365) % 365;
    return aDays - bDays;
  });

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-full font-boogaloo font-bold text-sm shadow-lg"
        style={{
          background: "rgba(212,5,17,0.12)",
          border: "2px solid rgba(212,5,17,0.4)",
          color: "rgba(255,120,120,0.95)",
        }}
        whileHover={{ scale: 1.05, background: "rgba(212,5,17,0.22)" }}
        whileTap={{ scale: 0.95 }}
      >
        {t.btnBirthdays}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(8,8,8,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ background: "#141414", border: "2px solid rgba(212,5,17,0.35)", maxHeight: "85vh" }}
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 flex-shrink-0" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

              <div className="px-6 pt-5 pb-3 flex-shrink-0">
                <h2 className="font-boogaloo text-2xl" style={{ color: "#D40511" }}>{t.birthdayTitle}</h2>
                <p className="text-white/40 text-xs font-boogaloo">{t.birthdaySubtitle}</p>
              </div>

              {/* Add birthday */}
              {session && !hasOwn && (
                <div className="px-6 pb-4 flex-shrink-0">
                  <div className="rounded-xl p-3" style={{ background: "rgba(212,5,17,0.07)", border: "1px solid rgba(212,5,17,0.2)" }}>
                    <p className="text-white/60 text-xs font-boogaloo mb-2">{t.birthdayAdd}</p>
                    <div className="flex gap-2">
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="flex-1 rounded-lg px-2 py-1.5 text-sm font-boogaloo outline-none"
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
                        className="flex-1 rounded-lg px-2 py-1.5 text-sm font-boogaloo outline-none"
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
                </div>
              )}
              {session && hasOwn && (
                <p className="px-6 pb-3 text-white/30 text-xs font-boogaloo flex-shrink-0">{t.birthdayAlreadyAdded}</p>
              )}

              <div className="mx-6 flex-shrink-0" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

              {/* List */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
                {sorted.length === 0 && (
                  <p className="text-white/30 text-sm font-boogaloo text-center py-8">{t.birthdayEmpty}</p>
                )}
                {sorted.map((entry) => {
                  const isToday = entry.day === todayD && entry.month === todayM;
                  return (
                    <motion.div
                      key={entry.id}
                      className="rounded-xl px-4 py-3 flex items-center justify-between"
                      style={{
                        background: isToday ? "rgba(255,204,0,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isToday ? "rgba(255,204,0,0.4)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{isToday ? "🎂" : "🎁"}</span>
                        <span className="font-boogaloo text-sm" style={{ color: isToday ? "#FFCC00" : "rgba(255,255,255,0.8)" }}>
                          {entry.user.firstName} {entry.user.lastName}
                        </span>
                      </div>
                      <span className="font-boogaloo text-sm" style={{ color: isToday ? "#FFCC00" : "rgba(255,255,255,0.4)" }}>
                        {entry.day} {t.months[entry.month - 1]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="px-6 py-3 text-center flex-shrink-0">
                <button onClick={() => setOpen(false)} className="text-white/25 text-xs font-boogaloo hover:text-white/50 transition-colors">
                  {t.birthdayClose}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
