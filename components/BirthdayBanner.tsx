"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface BirthdayEntry {
  id: string;
  day: number;
  month: number;
  user: { firstName: string; lastName: string };
}

export default function BirthdayBanner() {
  const { t } = useLang();
  const [entries, setEntries] = useState<BirthdayEntry[]>([]);

  useEffect(() => {
    fetch("/api/birthdays")
      .then((r) => r.ok ? r.json() : { birthdays: [] })
      .then((data) => setEntries(Array.isArray(data) ? data : (data.birthdays ?? [])))
      .catch(() => {});
  }, []);

  if (entries.length === 0) return null;

  const today = new Date();
  const todayD = today.getDate();
  const todayM = today.getMonth() + 1;

  const todayBdays = entries.filter((e) => e.day === todayD && e.month === todayM);

  // Upcoming: next 14 days
  const upcoming = entries.filter((e) => {
    if (e.day === todayD && e.month === todayM) return false;
    const thisYear = new Date(today.getFullYear(), e.month - 1, e.day);
    if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
    const diff = (thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 14;
  }).sort((a, b) => {
    const aDate = new Date(today.getFullYear(), a.month - 1, a.day);
    const bDate = new Date(today.getFullYear(), b.month - 1, b.day);
    if (aDate < today) aDate.setFullYear(today.getFullYear() + 1);
    if (bDate < today) bDate.setFullYear(today.getFullYear() + 1);
    return aDate.getTime() - bDate.getTime();
  });

  if (todayBdays.length === 0 && upcoming.length === 0) return null;

  return (
    <div className="relative z-10 px-4 pb-2">
      <AnimatePresence>
        {todayBdays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mb-2 px-4 py-2 rounded-full text-center font-boogaloo text-sm"
            style={{ background: "rgba(255,204,0,0.15)", border: "1px solid rgba(255,204,0,0.4)", color: "#FFCC00" }}
          >
            🎂 {todayBdays.map((e) => `${e.user.firstName} ${e.user.lastName}`).join(" & ")} {t.birthdayBannerToday}
          </motion.div>
        )}
      </AnimatePresence>

      {upcoming.length > 0 && (
        <div className="max-w-xl mx-auto flex flex-wrap justify-center gap-2">
          {upcoming.map((e) => (
            <span
              key={e.id}
              className="font-boogaloo text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
            >
              🎁 {e.user.firstName} · {e.day} {(t.monthsShort as string[])[e.month - 1]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
