"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nlAudioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    const next = lang === "nl" ? "fr" : "nl";
    setLang(next);
    if (next === "fr") {
      // Stop NL sound if playing
      if (nlAudioRef.current) {
        nlAudioRef.current.pause();
        nlAudioRef.current.currentTime = 0;
      }
      if (!audioRef.current) {
        audioRef.current = new Audio("/media/French meme song.mp3");
        audioRef.current.volume = 0.6;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 8000);
    } else {
      // Stop FR sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Play NL sound
      if (!nlAudioRef.current) {
        nlAudioRef.current = new Audio("/media/NL%20flag.m4a");
        nlAudioRef.current.volume = 0.7;
      }
      nlAudioRef.current.currentTime = 0;
      nlAudioRef.current.play().catch(() => {});
    }
  }

  return (
    <motion.button
      onClick={toggle}
      className="px-3 py-1.5 rounded-full font-boogaloo text-xs shadow flex items-center gap-1"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
      whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
      whileTap={{ scale: 0.95 }}
    >
      <span style={{ color: lang === "nl" ? "#FFCC00" : "rgba(255,255,255,0.35)", fontWeight: lang === "nl" ? "bold" : "normal" }}>
        NL
      </span>
      <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
      <span style={{ color: lang === "fr" ? "#FFCC00" : "rgba(255,255,255,0.35)", fontWeight: lang === "fr" ? "bold" : "normal" }}>
        FR
      </span>
    </motion.button>
  );
}
