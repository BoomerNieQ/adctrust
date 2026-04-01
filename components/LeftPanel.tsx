"use client";

import { motion } from "framer-motion";

interface LeftPanelProps {
  score: number;
  count: number;
  positiveCount: number;
  negativeCount: number;
  onAvatarClick?: () => void;
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-2xl font-boogaloo font-bold" style={{ color: color ?? "#FFCC00" }}>
        {value}
      </p>
      <p className="text-white/40 text-xs font-boogaloo mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function TrustMeter({ score }: { score: number }) {
  const level =
    score > 75 ? { label: "Absoluut vertrouwen", color: "#22c55e", icon: "🏆" } :
    score > 50 ? { label: "Sterk vertrouwen", color: "#4ade80", icon: "😊" } :
    score > 25 ? { label: "Licht vertrouwen", color: "#a3e635", icon: "🤔" } :
    score > 0  ? { label: "Twijfelachtig", color: "#FFCC00", icon: "😐" } :
    score === 0 ? { label: "Neutraal", color: "#FFCC00", icon: "⚖️" } :
    score > -25 ? { label: "Licht wantrouwen", color: "#fb923c", icon: "😕" } :
    score > -50 ? { label: "Wantrouwen", color: "#f97316", icon: "😠" } :
    score > -75 ? { label: "Sterk wantrouwen", color: "#D40511", icon: "💀" } :
    { label: "Crisis!", color: "#D40511", icon: "🚨" };

  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${level.color}40` }}
    >
      <div className="text-3xl mb-1">{level.icon}</div>
      <p className="font-boogaloo font-bold text-sm" style={{ color: level.color }}>
        {level.label}
      </p>
      <p className="text-white/30 text-xs mt-0.5 font-boogaloo">Huidige status</p>
    </div>
  );
}

export default function LeftPanel({ score, count, positiveCount, negativeCount, onAvatarClick }: LeftPanelProps) {
  const positivePct = count > 0 ? Math.round((positiveCount / count) * 100) : 0;
  const negativePct = count > 0 ? Math.round((negativeCount / count) * 100) : 0;

  return (
    <div
      className="rounded-2xl p-5 h-fit sticky top-6 space-y-4"
      style={{ background: "#242424", border: "1px solid rgba(255,204,0,0.15)" }}
    >
      {/* DHL Profile */}
      <div className="text-center pb-4 border-b border-white/10">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-fredoka font-bold cursor-pointer select-none"
          style={{ background: "linear-gradient(135deg, #FFCC00, #D40511)", color: "#1C1C1C" }}
          onClick={onAvatarClick}
          title="🤫"
        >
          D
        </div>
        <h3 className="font-fredoka font-bold text-white text-lg leading-tight">Dominique</h3>
        <p className="text-white/40 text-xs font-boogaloo mt-0.5">Team Manager · ADC</p>
        <div
          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-boogaloo"
          style={{ background: "rgba(255,204,0,0.1)", color: "#FFCC00", border: "1px solid rgba(255,204,0,0.2)" }}
        >
          <span>🏢</span> DHL Express NL
        </div>
      </div>

      {/* Status */}
      <TrustMeter score={score} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Totaal stemmen" value={count} />
        <StatCard label="Huidige score" value={score > 0 ? `+${score}` : score} color={
          score > 0 ? "#22c55e" : score < 0 ? "#D40511" : "#FFCC00"
        } />
        <StatCard label="👍 Positief" value={`${positivePct}%`} color="#4ade80" />
        <StatCard label="👎 Negatief" value={`${negativePct}%`} color="#D40511" />
      </div>

      {/* Positive/negative bar */}
      {count > 0 && (
        <div>
          <div className="flex rounded-full overflow-hidden h-3">
            <motion.div
              style={{ background: "#22c55e" }}
              initial={{ width: "50%" }}
              animate={{ width: `${positivePct}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />
            <motion.div
              style={{ background: "#D40511" }}
              initial={{ width: "50%" }}
              animate={{ width: `${negativePct}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />
          </div>
          <div className="flex justify-between text-xs font-boogaloo text-white/30 mt-1">
            <span>Vertrouwen</span>
            <span>Wantrouwen</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-white/20 text-xs text-center font-boogaloo border-t border-white/5 pt-3">
        📦 Stem elke 10 min
        <br />Alleen @dhl.com
      </p>
    </div>
  );
}
