"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "dhl-gate-access";
const WAYBILL = "3180269042";

const RED = "#D40511";
const YELLOW = "#FFCC00";

const STEPS = [
  { icon: "📋", label: "Pakketinfo ontvangen", time: "Gisteren 18:42" },
  { icon: "🏭", label: "Vertrokken uit depot", time: "Vandaag 04:17" },
  { icon: "🚚", label: "Uit voor bezorging",   time: "Vandaag 08:03" },
  { icon: "✅", label: "Bezorgd!",              time: "Nu"            },
];

export default function DHLGate({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed]   = useState(false);
  const [tracking,  setTracking]    = useState(false);
  const [step,      setStep]        = useState(-1);
  const [delivered, setDelivered]   = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
  }, []);

  function startTracking() {
    setTracking(true);
    [500, 1500, 2700, 4000].forEach((delay, i) => {
      setTimeout(() => setStep(i), delay);
    });
    setTimeout(() => setDelivered(true), 4600);
    setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setDismissed(true);
    }, 6200);
  }

  if (dismissed) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ background: "#141414" }}
    >
      {/* Top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }}
      />

      {/* DHL logo */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex">
          <span
            style={{
              background: RED,
              color: YELLOW,
              fontWeight: 900,
              fontSize: "40px",
              padding: "4px 14px",
              letterSpacing: "-1px",
              fontFamily: "Arial Black, Impact, sans-serif",
              lineHeight: 1.1,
            }}
          >
            DHL
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "5px", marginTop: "8px" }}>
          EXPRESS DELIVERY
        </p>
      </motion.div>

      {/* Tracking card */}
      <motion.div
        className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#1e1e1e", border: "1px solid rgba(212,5,17,0.35)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="h-1" style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }} />

        <div className="p-6">
          {/* Waybill number */}
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "3px", marginBottom: "4px" }}>
            WAYBILL
          </p>
          <p style={{ color: "white", fontFamily: "monospace", fontSize: "20px", letterSpacing: "4px", marginBottom: "4px" }}>
            {WAYBILL}
          </p>
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px", marginBottom: "20px" }}>
            Bestemmeling: ADC Team · België
          </p>

          {!tracking ? (
            <motion.button
              onClick={startTracking}
              className="w-full py-3 rounded font-bold text-sm"
              style={{
                background: RED,
                color: "white",
                border: "none",
                cursor: "pointer",
                letterSpacing: "3px",
                fontSize: "12px",
              }}
              whileHover={{ filter: "brightness(1.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              PAKKET VOLGEN
            </motion.button>
          ) : (
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: step >= i ? 1 : 0.15, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span style={{ fontSize: "22px", minWidth: "28px", textAlign: "center" }}>{s.icon}</span>
                  <div className="flex-1">
                    <p style={{
                      color: step >= i ? "white" : "rgba(255,255,255,0.2)",
                      fontSize: "13px",
                      fontWeight: step === i ? 700 : 400,
                      transition: "color 0.3s",
                    }}>
                      {s.label}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px" }}>{s.time}</p>
                  </div>

                  {/* Done checkmark */}
                  {step > i && (
                    <span style={{ color: YELLOW, fontSize: "13px" }}>✓</span>
                  )}

                  {/* Pulsing dot on current step */}
                  {step === i && i < STEPS.length - 1 && (
                    <motion.span
                      style={{ color: YELLOW, fontSize: "10px" }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.1 }}
                    >
                      ●
                    </motion.span>
                  )}

                  {/* Star on delivered */}
                  {i === STEPS.length - 1 && step >= i && (
                    <motion.span
                      style={{ color: YELLOW, fontSize: "20px" }}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 14 }}
                    >
                      ★
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Delivered banner */}
      <AnimatePresence>
        {delivered && (
          <motion.p
            className="mt-6 text-center font-bold"
            style={{ color: YELLOW, fontSize: "11px", letterSpacing: "5px" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            UW PAKKET IS BEZORGD — WELKOM
          </motion.p>
        )}
      </AnimatePresence>

      {/* Bottom stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{ background: `linear-gradient(to right, ${RED} 50%, ${YELLOW} 50%)` }}
      />
    </div>
  );
}
