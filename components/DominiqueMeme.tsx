"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DOMINIQUE_MEME } from "@/lib/memes";
import { useLang } from "@/lib/i18n";

export default function DominiqueMeme() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-full font-boogaloo font-bold text-base shadow-lg"
        style={{
          background: "rgba(255,204,0,0.08)",
          border: "2px solid rgba(255,204,0,0.3)",
          color: "rgba(255,204,0,0.75)",
        }}
        whileHover={{ scale: 1.05, background: "rgba(255,204,0,0.16)" }}
        whileTap={{ scale: 0.95 }}
      >
        {t.btnDominiqueMeme}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ background: "rgba(10,10,10,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
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
              <div className="relative w-full bg-black" style={{ minHeight: "280px", maxHeight: "60vh" }}>
                <video
                  ref={videoRef}
                  src={DOMINIQUE_MEME.file}
                  className="w-full"
                  autoPlay
                  playsInline
                  style={{ display: "block", maxHeight: "60vh", objectFit: "contain" }}
                />
              </div>
              <div className="px-5 py-3 text-center">
                <p className="font-boogaloo text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,204,0,0.5)" }}>
                  {t.dominiqueMemeTitle}
                </p>
                <p className="font-boogaloo text-lg" style={{ color: "#FFCC00" }}>{DOMINIQUE_MEME.label}</p>
                <p className="text-white/25 text-xs mt-1">{t.clickToClose}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
