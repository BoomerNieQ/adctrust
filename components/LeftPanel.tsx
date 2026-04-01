"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();
  const level =
    score > 75 ? { label: t.trustAbsolute, color: "#22c55e", icon: "🏆" } :
    score > 50 ? { label: t.trustStrong, color: "#4ade80", icon: "😊" } :
    score > 25 ? { label: t.trustLight, color: "#a3e635", icon: "🤔" } :
    score > 0  ? { label: t.trustDoubtful, color: "#FFCC00", icon: "😐" } :
    score === 0 ? { label: t.trustNeutral, color: "#FFCC00", icon: "⚖️" } :
    score > -25 ? { label: t.trustLightDistrust, color: "#fb923c", icon: "😕" } :
    score > -50 ? { label: t.trustDistrust, color: "#f97316", icon: "😠" } :
    score > -75 ? { label: t.trustStrongDistrust, color: "#D40511", icon: "💀" } :
    { label: t.trustCrisis, color: "#D40511", icon: "🚨" };

  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${level.color}40` }}
    >
      <div className="text-3xl mb-1">{level.icon}</div>
      <p className="font-boogaloo font-bold text-sm" style={{ color: level.color }}>
        {level.label}
      </p>
      <p className="text-white/30 text-xs mt-0.5 font-boogaloo">{t.currentStatus}</p>
    </div>
  );
}

export default function LeftPanel({ score, count, positiveCount, negativeCount, onAvatarClick }: LeftPanelProps) {
  const { t } = useLang();
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
        <p className="text-white/40 text-xs font-boogaloo mt-0.5">Team Manager</p>
      </div>

      {/* Status */}
      <TrustMeter score={score} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label={t.totalVotes} value={count} />
        <StatCard label={t.scoreLabel} value={score > 0 ? `+${score}` : score} color={
          score > 0 ? "#22c55e" : score < 0 ? "#D40511" : "#FFCC00"
        } />
        <StatCard label={`👍 ${t.positive}`} value={`${positivePct}%`} color="#4ade80" />
        <StatCard label={`👎 ${t.negative}`} value={`${negativePct}%`} color="#D40511" />
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
            <span>{t.trustLabel}</span>
            <span>{t.distrustLabel}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-white/20 text-xs text-center font-boogaloo border-t border-white/5 pt-3">
        {t.voteInterval}
      </p>
    </div>
  );
}
