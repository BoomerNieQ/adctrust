"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROSINE_MEMES } from "@/lib/memes";
import { useLang } from "@/lib/i18n";

// Random fixed position, computed once on mount (avoids SSR mismatch)
function useRandomPosition() {
  const [pos, setPos] = useState<{ top: string; left: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mobile = window.innerWidth < 640;
    const hasGutter = window.innerWidth >= 1800;
    setIsMobile(mobile || !hasGutter);
    if (!mobile && hasGutter) {
      setPos({
        top:  `${25 + Math.random() * 45}vh`,
        left: "calc(50vw - 740px)",
      });
    } else {
      setPos({ top: "0", left: "0" });
    }
  }, []);
  return { pos, isMobile };
}

export default function RosineMemes() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  // index tracks which meme to show next; persists across open/close
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { pos, isMobile } = useRandomPosition();

  const handleClick = () => {
    if (modalOpen) return; // ignore while already open
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    // advance to next meme for the next click
    setIndex((prev) => (prev + 1) % ROSINE_MEMES.length);
  };

  const active = ROSINE_MEMES[index];

  useEffect(() => {
    if (modalOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [modalOpen]);

  // Don't render until position is known (avoids hydration mismatch)
  if (!pos) return null;

  const buttonStyle = {
    background: "rgba(212,5,17,0.15)",
    border: "2px solid rgba(212,5,17,0.45)",
    color: "rgba(255,120,120,0.9)",
  };

  return (
    <>
      {/* On mobile: inline button (not fixed/floating) */}
      {isMobile ? (
        <div className="relative z-10 flex justify-center pb-4">
          <motion.button
            onClick={handleClick}
            className="px-5 py-2.5 rounded-full font-boogaloo font-bold text-base shadow-xl"
            style={buttonStyle}
            whileHover={{ scale: 1.08, background: "rgba(212,5,17,0.28)" }}
            whileTap={{ scale: 0.93 }}
          >
            {t.btnRosine}
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={handleClick}
          className="fixed px-5 py-2.5 rounded-full font-boogaloo font-bold text-base shadow-xl z-20"
          style={{ top: pos.top, left: pos.left, ...buttonStyle }}
          whileHover={{ scale: 1.08, background: "rgba(212,5,17,0.28)" }}
          whileTap={{ scale: 0.93 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        >
          💅 Rosine&apos;s life advise
        </motion.button>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ background: "rgba(10,10,10,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#1C1C1C", border: "2px solid rgba(212,5,17,0.6)" }}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />
              <div className="relative w-full bg-black" style={{ minHeight: "280px", maxHeight: "60vh" }}>
                <video
                  ref={videoRef}
                  src={active.file}
                  className="w-full"
                  autoPlay
                  playsInline
                  style={{ display: "block", maxHeight: "60vh", objectFit: "contain" }}
                />
              </div>
              <div className="px-5 py-3 text-center">
                <p className="font-boogaloo text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(212,5,17,0.7)" }}>
                  {t.btnRosine}
                </p>
                <p className="font-boogaloo text-lg" style={{ color: "#FFCC00" }}>{active.label}</p>
                <p className="text-white/25 text-xs mt-1">
                  {t.rosineClose} ({index + 1}/{ROSINE_MEMES.length})
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
