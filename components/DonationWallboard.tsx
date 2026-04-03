"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

type Attempt = {
  id: string;
  name: string;
  cause: string;
  amount: number;
  createdAt: string;
};

export default function DonationWallboard() {
  const { t } = useLang();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/donations");
    if (res.ok) setAttempts(await res.json());
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    const onDonation = () => load();
    window.addEventListener("donation-made", onDonation);
    return () => { clearInterval(interval); window.removeEventListener("donation-made", onDonation); };
  }, [load]);

  return (
    <section className="relative z-10 px-4 sm:px-6 pb-12 max-w-[1400px] mx-auto">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,204,0,0.15)" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="font-boogaloo text-white text-base" style={{ letterSpacing: "1px" }}>
              {t.exposedTitle as string}
            </p>
            <p style={{ color: "rgba(255,204,0,0.5)", fontSize: "11px" }}>
              {attempts.length === 0
                ? (t.exposedEmpty as string)
                : (t.exposedSubtitle as string)}
            </p>
          </div>
        </div>

        {/* Entries */}
        {attempts.length > 0 && (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <AnimatePresence initial={false}>
              {attempts.map((a, i) => (
                <motion.div
                  key={a.id}
                  className="px-6 py-3 flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span style={{ fontSize: "18px", marginTop: "1px" }}>😏</span>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.5 }}>
                    {(t.exposedEntry as (name: string, cause: string, amount: string) => string)(
                      a.name,
                      a.cause,
                      a.amount.toFixed(2)
                    )}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
