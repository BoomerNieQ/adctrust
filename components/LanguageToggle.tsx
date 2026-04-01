"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, t, setLang } = useLang();

  return (
    <motion.button
      onClick={() => setLang(lang === "nl" ? "fr" : "nl")}
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
