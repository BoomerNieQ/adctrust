"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Attempt = {
  id: string;
  name: string;
  cause: string;
  amount: number;
  createdAt: string;
};

export default function DonationWallboard() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/donations");
    if (res.ok) setAttempts(await res.json());
  }, []);

  useEffect(() => {
    load();
    // Refresh every 15s to pick up new donations from other users
    const interval = setInterval(load, 15000);
    // Also refresh on custom event from DonateButton in same tab
    const onDonation = () => load();
    window.addEventListener("donation-made", onDonation);
    return () => { clearInterval(interval); window.removeEventListener("donation-made", onDonation); };
  }, [load]);

  if (attempts.length === 0) return (
    <section className="relative z-10 px-4 sm:px-6 pb-12 max-w-[1400px] mx-auto">
      <div className="rounded-2xl px-6 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "22px" }}>🏆</span>
          <div>
            <p className="font-boogaloo text-white text-base">Wall of Sus Donateurs</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>Nog niemand sus genoeg geweest... tot nu toe.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="relative z-10 px-4 sm:px-6 pb-12 max-w-[1400px] mx-auto">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: "22px" }}>🏆</span>
          <div>
            <p className="font-boogaloo text-white text-base">Wall of Sus Donateurs</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Heel lief maar ook een beetje sus...</p>
          </div>
        </div>

        {/* Entries */}
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
                <div className="flex-1 min-w-0">
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.5 }}>
                    <span style={{ color: "white", fontWeight: 700 }}>{a.name}</span>
                    {" "}probeerde te doneren voor{" "}
                    <span style={{ color: "#FFCC00", fontStyle: "italic" }}>"{a.cause}"</span>
                    {" "}(€{a.amount.toFixed(2)}) — dat is heel lief maar ook een beetje sus...
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
