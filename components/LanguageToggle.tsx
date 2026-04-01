"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, t, setLang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    const next = lang === "nl" ? "fr" : "nl";
    setLang(next);
    if (next === "fr") {
      // Play French meme song briefly
      if (!audioRef.current) {
        audioRef.current = new Audio("/media/French meme song.mp3");
        audioRef.current.volume = 0.6;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      // Stop after 8 seconds
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 8000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }

  return (
    <motion.button
      onClick={toggle}
      className="px-3 py-1.5 rounded-full font-boogaloo text-xs shadow"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.6)",
      }}
      whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
      whileTap={{ scale: 0.95 }}
    >
      {t.langToggle}
    </motion.button>
  );
}
