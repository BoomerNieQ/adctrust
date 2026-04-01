"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const WEEKLY_MEMES = [
  { file: "/media/i-dont-speak-taco-bell.mp4", label: "I don't speak Taco Bell" },
  { file: "/media/i-hope-it-sucks.mp4",        label: "I hope it sucks" },
];

// Hook used by parent to track secret clicks
export function useEasterEgg() {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    setClicks((c) => {
      const next = c + 1;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (next >= 5) {
        setOpen(true);
        return 0;
      }
      timerRef.current = setTimeout(() => setClicks(0), 2000);
      return next;
    });
  }

  return { open, setOpen, handleClick, clicks };
}

// Modal-only variant used for the easter egg
export function WeeklyMemesModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [index]);

  const current = WEEKLY_MEMES[index];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,8,0.94)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#141414", border: "2px solid rgba(212,5,17,0.5)" }}
        initial={{ scale: 0.8, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

        <div className="px-5 pt-4 pb-2">
          <p className="text-white/30 text-xs font-boogaloo uppercase tracking-widest mb-0.5">🥚 Easter egg gevonden!</p>
          <h2 className="font-boogaloo text-xl" style={{ color: "#FFCC00" }}>{t.weeklyTitle}</h2>
          <p className="text-white/35 text-xs font-boogaloo">{t.weeklySubtitle}</p>
        </div>

        <div className="relative w-full bg-black" style={{ minHeight: "260px", maxHeight: "55vh" }}>
          <video
            ref={videoRef}
            key={current.file}
            src={current.file}
            className="w-full"
            autoPlay
            playsInline
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setPortrait(v.videoHeight > v.videoWidth);
            }}
            style={{
              display: "block",
              maxHeight: "55vh",
              objectFit: portrait ? "cover" : "contain",
              width: "100%",
            }}
          />
        </div>

        <div className="px-5 py-3 flex items-center justify-between">
          <p className="font-boogaloo text-base" style={{ color: "#FFCC00" }}>{current.label}</p>
          {WEEKLY_MEMES.length > 1 && (
            <motion.button
              onClick={() => { setIndex((i) => (i + 1) % WEEKLY_MEMES.length); setPortrait(false); }}
              className="px-3 py-1.5 rounded-full font-boogaloo text-xs"
              style={{ background: "rgba(212,5,17,0.2)", border: "1px solid rgba(212,5,17,0.4)", color: "rgba(255,120,120,0.9)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volgende →
            </motion.button>
          )}
        </div>

        <div className="px-5 pb-4 text-center">
          <button onClick={onClose} className="text-white/25 text-xs font-boogaloo hover:text-white/50 transition-colors">
            {t.weeklyClose}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Full component with its own button (not used currently — easter egg only)
export default function DominiqueWeeklyMemes() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

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
        {t.btnWeeklyMemes}
      </motion.button>
      <AnimatePresence>
        {open && <WeeklyMemesModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
