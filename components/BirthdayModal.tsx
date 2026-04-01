"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface Props {
  names: string[];   // people with birthday today
  onClose: () => void;
}

export default function BirthdayModal({ names, onClose }: Props) {
  const { t } = useLang();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 cursor-pointer"
        style={{ background: "rgba(8,8,8,0.95)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Confetti dots */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: i % 3 === 0 ? "#FFCC00" : i % 3 === 1 ? "#D40511" : "#fff",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, 30, -20, 40, 0], opacity: [1, 0.6, 1, 0.4, 1] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        <motion.div
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl text-center"
          style={{ background: "#141414", border: "2px solid rgba(255,204,0,0.5)" }}
          initial={{ scale: 0.7, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.7, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

          <div className="px-8 py-8">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              🎂
            </motion.div>

            <motion.h2
              className="font-boogaloo text-3xl font-bold mb-2"
              style={{ color: "#FFCC00" }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {t.birthdayHappy}!
            </motion.h2>

            {names.map((name) => (
              <p key={name} className="font-boogaloo text-xl text-white mb-1">
                🎉 <strong style={{ color: "#FFCC00" }}>{name}</strong> {t.birthdayToday}
              </p>
            ))}

            <p className="text-white/30 text-xs font-boogaloo mt-6">{t.birthdayClickClose}</p>
          </div>
        </motion.div>

        <audio ref={audioRef} src="/media/happy-birthday.mp3" loop />
      </motion.div>
    </AnimatePresence>
  );
}
