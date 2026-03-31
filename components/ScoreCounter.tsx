"use client";

import { motion } from "framer-motion";

interface RecentVoter {
  firstName: string;
  lastName: string;
  value: number;
  createdAt: string;
}

interface ScoreCounterProps {
  count: number;
  lastVote: string | null;
  recentVoters: RecentVoter[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "zojuist";
  if (mins < 60) return `${mins} minuut${mins !== 1 ? "en" : ""} geleden`;
  if (hours < 24) return `${hours} uur geleden`;
  return `${days} dag${days !== 1 ? "en" : ""} geleden`;
}

export default function ScoreCounter({ count, lastVote, recentVoters }: ScoreCounterProps) {
  return (
    <div className="text-center space-y-3">
      <motion.div
        className="font-boogaloo text-xl"
        style={{ color: "rgba(255,255,255,0.7)" }}
        key={count}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        🗳️{" "}
        <span className="text-white font-bold">{count.toLocaleString()}</span>{" "}
        {count === 1 ? "persoon heeft" : "mensen hebben"} gestemd
      </motion.div>

      {lastVote && (
        <p className="text-white/40 text-sm font-boogaloo">
          Laatste stem: {timeAgo(lastVote)}
        </p>
      )}

      {recentVoters.length > 0 && (
        <div className="mt-4">
          <p className="text-white/30 text-xs font-boogaloo mb-2 uppercase tracking-widest">
            Recente stemmers
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {recentVoters.map((voter, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: voter.value > 0
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(212,5,17,0.1)",
                  border: `1px solid ${voter.value > 0 ? "rgba(34,197,94,0.3)" : "rgba(212,5,17,0.3)"}`,
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Initials avatar */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "#FFCC00", color: "#1C1C1C" }}
                >
                  {voter.firstName[0]}{voter.lastName[0]}
                </div>
                <span className="text-white/70 text-xs font-boogaloo">
                  {voter.firstName}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: voter.value > 0 ? "#4ade80" : "#D40511" }}
                >
                  {voter.value > 0 ? "+1" : "−1"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
