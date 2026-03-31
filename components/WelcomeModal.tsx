"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MEDIA } from "@/lib/memes";

interface WelcomeModalProps {
  firstName: string;
  isReturning: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ firstName, isReturning, onClose }: WelcomeModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // play() may be blocked without user gesture on some browsers; that's fine — don't treat it as an error
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,28,28,0.92)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl text-center"
        style={{ background: "#2A2A2A", border: "2px solid rgba(255,204,0,0.5)" }}
        initial={{ scale: 0.7, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* DHL stripe */}
        <div className="h-2 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

        <div className="px-6 pt-5 pb-2">
          <div className="text-4xl mb-2">{isReturning ? "👋" : "🎉"}</div>
          <h2 className="text-3xl font-boogaloo font-bold" style={{ color: "#FFCC00" }}>
            {isReturning ? `Welkom terug,` : `Welkom,`}
          </h2>
          <p className="text-4xl font-fredoka font-bold text-white mt-1">{firstName}!</p>
        </div>

        {/* "Heet je echt zo?" meme video */}
        <div className="relative mx-4 rounded-xl overflow-hidden bg-black" style={{ height: "420px" }}>
          {!videoError ? (
            <video
              ref={videoRef}
              src={MEDIA.heetJeEchtZo}
              className="w-full h-full"
              autoPlay
              playsInline
              onError={() => setVideoError(true)}
              style={{ display: "block", objectFit: "cover", objectPosition: "center top" }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">🤔</span>
              <p className="text-white/60 font-boogaloo text-lg">Heet je echt zo?</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4">
          <p className="text-white/50 font-boogaloo text-sm mb-4">
            {isReturning
              ? `Fijn dat je er weer bij bent! Jouw stem telt.`
              : `Leuk dat je erbij bent! Stem mee over Dominique.`}
          </p>

          <motion.button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-boogaloo text-lg font-bold"
            style={{ background: "#FFCC00", color: "#1C1C1C" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Naar de barometer! 🌡️
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
