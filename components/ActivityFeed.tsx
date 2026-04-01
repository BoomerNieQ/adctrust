"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

export interface VoteActivity {
  firstName: string;
  lastName: string;
  value: number;
  createdAt: string;
}

interface ActivityFeedProps {
  votes: VoteActivity[];
  totalCount: number;
  score: number;
}

function VoteEntry({ vote, index }: { vote: VoteActivity; index: number }) {
  const { t } = useLang();
  const isPos = vote.value > 0;

  const diff = Date.now() - new Date(vote.createdAt).getTime();
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const timeStr =
    secs < 30 ? t.activityJustNow :
    mins < 60 ? t.activityMinAgo(mins) :
    hours < 24 ? t.activityHourAgo(hours) :
    t.activityDayAgo(days);

  return (
    <motion.div
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      {/* Initials */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
        style={{ background: "#FFCC00", color: "#1C1C1C" }}
      >
        {vote.firstName[0]}{vote.lastName[0]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm font-boogaloo leading-snug">
          <span className="text-white font-bold">{vote.firstName}</span>
          {" "}{t.activityHad}{" "}
          <span style={{ color: isPos ? "#4ade80" : "#D40511", fontWeight: "bold" }}>
            {isPos ? t.activityMore : t.activityLess}
          </span>
          {" "}{t.activityIn}{" "}
          <span style={{ color: "#FFCC00" }}>Dominique</span>
        </p>
        <p className="text-white/30 text-xs mt-0.5">{timeStr}</p>
      </div>

      {/* Vote badge */}
      <div
        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: isPos ? "rgba(34,197,94,0.15)" : "rgba(212,5,17,0.15)",
          color: isPos ? "#4ade80" : "#D40511",
          border: `1px solid ${isPos ? "rgba(34,197,94,0.3)" : "rgba(212,5,17,0.3)"}`,
        }}
      >
        {isPos ? "+1" : "−1"}
      </div>
    </motion.div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = ((score + 100) / 200) * 100;
  const color = score > 30 ? "#22c55e" : score < -30 ? "#D40511" : "#FFCC00";

  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs font-boogaloo text-white/40 mb-1">
        <span>−100</span>
        <span style={{ color }} className="font-bold">
          Score: {score > 0 ? `+${score}` : score}
        </span>
        <span>+100</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: "50%" }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />
      </div>
    </div>
  );
}

export default function ActivityFeed({ votes, totalCount, score }: ActivityFeedProps) {
  const { t } = useLang();
  return (
    <div
      className="rounded-2xl p-5 h-fit sticky top-6"
      style={{ background: "#242424", border: "1px solid rgba(255,204,0,0.15)" }}
    >
      <h3 className="font-boogaloo text-lg mb-1" style={{ color: "#FFCC00" }}>
        {t.activityTitle}
      </h3>
      <p className="text-white/30 text-xs font-boogaloo mb-4">
        {t.activityTotal(totalCount)}
      </p>

      <ScoreBar score={score} />

      <div className="space-y-0 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence>
          {votes.length === 0 ? (
            <p className="text-white/30 text-sm font-boogaloo text-center py-6">
              {t.activityEmpty}
            </p>
          ) : (
            votes.map((v, i) => (
              <VoteEntry key={`${v.firstName}-${v.createdAt}`} vote={v} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>

      {votes.length > 0 && (
        <p className="text-white/20 text-xs text-center mt-3 font-boogaloo">
          {t.activityRefresh}
        </p>
      )}
    </div>
  );
}
