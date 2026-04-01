"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function RubenAppreciation() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-full font-boogaloo font-bold text-base shadow-lg"
        style={{
          background: "rgba(99,179,237,0.15)",
          border: "2px solid rgba(99,179,237,0.5)",
          color: "rgba(147,210,255,0.95)",
        }}
        whileHover={{ scale: 1.06, background: "rgba(99,179,237,0.25)" }}
        whileTap={{ scale: 0.95 }}
      >
        {t.btnRuben}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ background: "rgba(8,8,8,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl text-center"
              style={{ background: "#141414", border: "2px solid rgba(99,179,237,0.45)" }}
              initial={{ scale: 0.7, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #63B3ED 50%, #FFCC00 50%)" }} />

              <div className="px-6 pt-6 pb-2">
                <motion.p
                  className="font-boogaloo text-2xl font-bold"
                  style={{ color: "#63B3ED" }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {t.rubenFeels}
                </motion.p>
              </div>

              <div className="relative w-full" style={{ height: "320px" }}>
                <Image
                  src="/ruben.jpeg"
                  alt="Ruben"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />
              </div>

              <div className="px-6 py-4">
                <p className="text-white/30 text-xs font-boogaloo">{t.rubenClose}</p>
              </div>
            </motion.div>

            <audio ref={audioRef} src="/media/kutkind.m4a" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
