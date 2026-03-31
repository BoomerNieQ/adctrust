"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Meme } from "@/lib/memes";

interface MemeOverlayProps {
  meme: Meme | null;
  onClose: () => void;
}

interface ConfettiPiece {
  id: number; x: number; color: string; delay: number; size: number;
}

function Confetti() {
  const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#FFCC00", "#D40511", "#FFFFFF", "#22c55e", "#FF9800"][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5,
    size: Math.random() * 12 + 6,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.55, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: Math.random() * 720 }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export default function MemeOverlay({ meme, onClose }: MemeOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    if (!meme) return;
    setMediaError(false);

    // Auto-close after 5 seconds (longer for video)
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [meme, onClose]);

  // Autoplay video when meme changes
  useEffect(() => {
    if (!meme?.isVideo || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => setMediaError(true));
  }, [meme]);

  if (!meme) return null;

  const isPositive = meme.type === "positive";
  const isBalanced = meme.type === "balanced";
  const borderColor = isBalanced ? "#FFCC00" : isPositive ? "#22c55e" : "#D40511";
  const overlayBg = isPositive ? "rgba(0,20,0,0.88)" : isBalanced ? "rgba(20,15,0,0.88)" : "rgba(30,0,0,0.92)";

  return (
    <>
      {isPositive && <Confetti />}
      <AnimatePresence>
        {meme && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer p-4"
            style={{ background: overlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="text-center max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "rgba(28,28,28,0.95)", border: `2px solid ${borderColor}` }}
              initial={{ scale: 0.5, rotate: isPositive ? -8 : 8 }}
              animate={{ scale: 1, rotate: 0, x: isPositive ? 0 : [0, -8, 8, -5, 5, 0] }}
              transition={{ duration: 0.4, ease: "backOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media — video or fallback */}
              <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                {meme.isVideo && !mediaError ? (
                  <video
                    ref={videoRef}
                    src={meme.mediaUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    onError={() => setMediaError(true)}
                    style={{ display: "block" }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {meme.emoji}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="px-5 py-4">
                <h2 className="text-2xl font-boogaloo font-bold leading-tight" style={{ color: borderColor }}>
                  {meme.text}
                </h2>
                {meme.subtext && (
                  <p className="text-white/60 text-sm mt-1 font-boogaloo">{meme.subtext}</p>
                )}
                <p className="text-white/25 text-xs mt-3">Klik om te sluiten</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
