"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

function DickModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,8,0.96)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full"
        style={{ background: "#141414", border: "2px solid rgba(212,5,17,0.6)" }}
        initial={{ scale: 0.7, rotate: -3 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.7 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />
        <div className="px-4 pt-3 pb-2">
          <p className="font-boogaloo text-xs uppercase tracking-widest" style={{ color: "rgba(212,5,17,0.7)" }}>
            {t.dickLabel}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/dick.jpeg"
          alt="🤫"
          className="w-full"
          style={{ maxHeight: "65vh", objectFit: "contain", display: "block" }}
        />
        <div className="px-4 py-3 text-center">
          <button
            onClick={onClose}
            className="text-white/25 text-xs font-boogaloo hover:text-white/50 transition-colors"
          >
            {t.dickClose}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TitleSection() {
  const { t, lang } = useLang();
  const [dickOpen, setDickOpen] = useState(false);
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tagline = useMemo(() => {
    const arr = t.taglines as string[];
    return arr[Math.floor(Math.random() * arr.length)];
  }, [lang]); // re-pick on language switch

  function handleSubtitleClick() {
    clicksRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (clicksRef.current >= 3) {
      setDickOpen(true);
      clicksRef.current = 0;
      return;
    }
    timerRef.current = setTimeout(() => { clicksRef.current = 0; }, 2000);
  }

  return (
    <>
      <div className="relative z-10 text-center px-4 py-4 pb-6">
        <h1 className="text-5xl sm:text-6xl font-boogaloo text-white leading-tight">
          {t.titleMain}{" "}
          <span
            className="font-fredoka"
            style={{
              background: "linear-gradient(135deg, #FFCC00, #D40511)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dominique
          </span>
        </h1>
        <button
          className="text-white/35 font-boogaloo mt-1 text-sm select-none bg-transparent border-none p-0"
          onClick={handleSubtitleClick}
          style={{ cursor: "default", touchAction: "manipulation" }}
          title="🤫"
        >
          {t.subtitle}
        </button>
        <p
          className="mt-3 font-boogaloo text-base px-5 py-2 rounded-full inline-block"
          style={{
            color: "rgba(255,204,0,0.75)",
            background: "rgba(255,204,0,0.07)",
            border: "1px solid rgba(255,204,0,0.18)",
          }}
        >
          &ldquo;{tagline}&rdquo;
        </p>
      </div>

      <AnimatePresence>
        {dickOpen && <DickModal onClose={() => setDickOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
