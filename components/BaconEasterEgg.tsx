"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BaconEasterEgg() {
  const [open, setOpen] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  return (
    <>
      {/* Hidden pig — very faint, bottom-left corner */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-3 z-20 select-none"
        style={{ fontSize: "10px", opacity: 0.12, lineHeight: 1, background: "none", border: "none", cursor: "default", padding: 0 }}
        title=""
        aria-hidden="true"
      >
        🐷
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(8,8,8,0.94)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#141414", border: "2px solid rgba(212,5,17,0.5)" }}
              initial={{ scale: 0.7, rotate: 2 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />
              <div className="px-5 pt-3 pb-1">
                <p className="font-boogaloo text-xs uppercase tracking-widest" style={{ color: "rgba(212,5,17,0.6)" }}>
                  🐷 easter egg
                </p>
              </div>
              <div className="relative w-full bg-black" style={{ minHeight: "260px", maxHeight: "60vh" }}>
                <video
                  ref={videoRef}
                  src="/media/bacon.mp4"
                  className="w-full"
                  autoPlay
                  playsInline
                  loop
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    setPortrait(v.videoHeight > v.videoWidth);
                  }}
                  style={{
                    display: "block",
                    maxHeight: "60vh",
                    objectFit: portrait ? "cover" : "contain",
                    width: "100%",
                  }}
                />
              </div>
              <div className="px-5 py-3 text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/25 text-xs font-boogaloo hover:text-white/50 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
