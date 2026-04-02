"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const GATE_STYLES = [
  { id: "hp",   title: "Marauder's Map",  subtitle: "Harry Potter",      icon: "🗺️", bg: "linear-gradient(135deg, #1a0f00 0%, #0f0900 100%)", border: "rgba(199,152,45,0.4)",  accent: "#C7982D", glow: "rgba(199,152,45,0.12)" },
  { id: "lotr", title: "Doors of Durin",  subtitle: "Lord of the Rings", icon: "🌕", bg: "linear-gradient(135deg, #060c18 0%, #040810 100%)", border: "rgba(200,224,248,0.3)", accent: "#c8e0f8", glow: "rgba(100,160,240,0.1)"  },
  { id: "dhl",  title: "DHL Express",     subtitle: "",                  icon: "📦", bg: "linear-gradient(135deg, #1a0303 0%, #0f0202 100%)", border: "rgba(212,5,17,0.45)",  accent: "#FFCC00", glow: "rgba(212,5,17,0.1)"   },
];

export default function GateSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const { t } = useLang();

  const hints: Record<string, string> = {
    hp:   t.gateHpHint,
    lotr: t.gateLotRHint,
    dhl:  t.gateDhlHint,
  };
  const subtitles: Record<string, string> = {
    hp:   "Harry Potter",
    lotr: "Lord of the Rings",
    dhl:  t.gateDhlSubtitle,
  };

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center px-5" style={{ background: "#0d0d0d" }}>
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "6px", marginBottom: "12px" }}>
          {t.gateChoose}
        </p>
        <h1 style={{ color: "rgba(255,255,255,0.85)", fontSize: "20px", fontWeight: 700, letterSpacing: "1px" }}>
          {t.gateQuestion}
        </h1>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        {GATE_STYLES.map((gate, i) => (
          <motion.button
            key={gate.id}
            onClick={() => onSelect(gate.id)}
            className="flex-1 rounded-2xl p-6 text-left flex flex-col gap-4 cursor-pointer select-none"
            style={{ background: gate.bg, border: `1px solid ${gate.border}`, boxShadow: `0 0 32px ${gate.glow}` }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
            whileHover={{ scale: 1.03, boxShadow: `0 0 48px ${gate.glow}` }}
            whileTap={{ scale: 0.97 }}
          >
            <span style={{ fontSize: "34px", lineHeight: 1 }}>{gate.icon}</span>
            <div>
              <p style={{ color: gate.accent, fontSize: "16px", fontWeight: 700, marginBottom: "3px" }}>{gate.title}</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "3px" }}>{subtitles[gate.id].toUpperCase()}</p>
            </div>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontStyle: "italic", marginTop: "auto" }}>
              {hints[gate.id]}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
