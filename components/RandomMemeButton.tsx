"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RANDOM_MEMES } from "@/lib/memes";
import { useLang } from "@/lib/i18n";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomMemeButton() {
  const { t } = useLang();
  const [active, setActive] = useState<{ file: string; label: string } | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Queue: works through a shuffled copy of all memes; refills when empty
  const queueRef = useRef<typeof RANDOM_MEMES>([]);

  const playRandom = () => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle(RANDOM_MEMES);
    }
    const pick = queueRef.current.pop()!;
    setIsPortrait(false);
    setActive(pick);
  };

  useEffect(() => {
    if (!active || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [active]);

  return (
    <>
      <motion.button
        onClick={playRandom}
        className="px-5 py-2.5 rounded-full font-boogaloo font-bold text-base shadow-lg"
        style={{
          background: "rgba(255,204,0,0.12)",
          border: "2px solid rgba(255,204,0,0.4)",
          color: "rgba(255,204,0,0.85)",
        }}
        whileHover={{ scale: 1.05, background: "rgba(255,204,0,0.22)" }}
        whileTap={{ scale: 0.95 }}
      >
        {t.btnRandomMemes}
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ background: "rgba(10,10,10,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#1C1C1C", border: "2px solid rgba(255,204,0,0.5)" }}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />
              <div className="relative w-full bg-black overflow-hidden" style={{ minHeight: "280px", maxHeight: "60vh" }}>
                <video
                  ref={videoRef}
                  src={active.file}
                  className="w-full h-full"
                  autoPlay
                  playsInline
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    setIsPortrait(v.videoHeight > v.videoWidth);
                  }}
                  style={{
                    display: "block",
                    maxHeight: "60vh",
                    objectFit: isPortrait ? "cover" : "contain",
                  }}
                />
              </div>
              <div className="px-5 py-3 text-center">
                <p className="font-boogaloo text-lg" style={{ color: "#FFCC00" }}>{active.label}</p>
                <p className="text-white/25 text-xs mt-1">{t.clickToClose}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
