"use client";

import { useState, useEffect, ReactNode, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const STORAGE_KEY = "dhl-gate-access";
const WAYBILL = "3180269042";
const RED = "#D40511";
const YELLOW = "#FFCC00";

const STEP_ICONS = ["📋", "🏭", "🚚", "✅"];
const STEP_TIMES = ["Gisteren 18:42", "Vandaag 04:17", "Vandaag 08:03", "Nu"];

export default function DHLGate({ children, onComplete }: { children: ReactNode; onComplete?: () => void }) {
  const { t } = useLang();
  const [dismissed, setDismissed] = useState(false);
  const [tracking,  setTracking]  = useState(false);
  const [step,      setStep]      = useState(-1);
  const [delivered, setDelivered] = useState(false);
  const [input,     setInput]     = useState("");
  const [shake,     setShake]     = useState(false);

  const STEPS = [
    { icon: STEP_ICONS[0], label: t.dhlStep1, time: STEP_TIMES[0] },
    { icon: STEP_ICONS[1], label: t.dhlStep2, time: STEP_TIMES[1] },
    { icon: STEP_ICONS[2], label: t.dhlStep3, time: STEP_TIMES[2] },
    { icon: STEP_ICONS[3], label: t.dhlStep4, time: STEP_TIMES[3] },
  ];

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
  }, []);

  function handleInput(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, WAYBILL.length);
    setInput(digits);
    if (digits.length === WAYBILL.length && digits.startsWith("3180") && digits.endsWith("42")) startTracking();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input !== WAYBILL) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function startTracking() {
    setTracking(true);
    [500, 1500, 2700, 4000].forEach((delay, i) => setTimeout(() => setStep(i), delay));
    setTimeout(() => setDelivered(true), 4600);
    setTimeout(() => { sessionStorage.setItem(STORAGE_KEY, "1"); onComplete?.(); setDismissed(true); }, 6200);
  }

  if (dismissed) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center" style={{ background: "#141414" }}>
      <div className="absolute top-0 left-0 right-0 h-2" style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }} />

      <motion.div className="mb-8 text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex">
          <span style={{ background: RED, color: YELLOW, fontWeight: 900, fontSize: "40px", padding: "4px 14px", letterSpacing: "-1px", fontFamily: "Arial Black, Impact, sans-serif", lineHeight: 1.1 }}>
            DHL
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "5px", marginTop: "8px" }}>EXPRESS DELIVERY</p>
      </motion.div>

      <motion.div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl" style={{ background: "#1e1e1e", border: "1px solid rgba(212,5,17,0.35)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="h-1" style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }} />
        <div className="p-6">
          <div className="rounded-lg p-3 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "9px", letterSpacing: "2px", marginBottom: "6px" }}>{t.dhlDeliveryTitle}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", lineHeight: 1.6 }}>
              {t.dhlDeliveryMsg.split("\n").map((line: string, i: number) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", marginTop: "6px", fontFamily: "monospace", letterSpacing: "2px" }}>
              {t.dhlRef} {WAYBILL.slice(0, 4)} **** {WAYBILL.slice(-2)}
            </p>
          </div>

          {!tracking ? (
            <div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "3px", marginBottom: "8px" }}>{t.dhlWaybillLabel}</p>
              <motion.div animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                <input
                  type="text" inputMode="numeric" value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.dhlWaybillPlaceholder}
                  maxLength={10} autoFocus
                  className="w-full py-3 px-4 rounded outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${shake ? RED : "rgba(255,255,255,0.15)"}`, color: "white", fontFamily: "monospace", fontSize: "18px", letterSpacing: "4px", transition: "border-color 0.2s" }}
                />
              </motion.div>
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", marginTop: "8px", textAlign: "center" }}>
                {t.dhlDigits(input.length, WAYBILL.length)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <motion.div key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: step >= i ? 1 : 0.15, x: 0 }} transition={{ duration: 0.35 }}>
                  <span style={{ fontSize: "22px", minWidth: "28px", textAlign: "center" }}>{s.icon}</span>
                  <div className="flex-1">
                    <p style={{ color: step >= i ? "white" : "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: step === i ? 700 : 400, transition: "color 0.3s" }}>{s.label}</p>
                    <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px" }}>{s.time}</p>
                  </div>
                  {step > i && <span style={{ color: YELLOW, fontSize: "13px" }}>✓</span>}
                  {step === i && i < STEPS.length - 1 && (
                    <motion.span style={{ color: YELLOW, fontSize: "10px" }} animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.1 }}>●</motion.span>
                  )}
                  {i === STEPS.length - 1 && step >= i && (
                    <motion.span style={{ color: YELLOW, fontSize: "20px" }} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}>★</motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {delivered && (
          <motion.p className="mt-6 text-center font-bold" style={{ color: YELLOW, fontSize: "11px", letterSpacing: "5px" }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {t.dhlDelivered}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }} />
    </div>
  );
}
