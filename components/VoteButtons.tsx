"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface VoteButtonsProps {
  isLoggedIn: boolean;
  onVote: (value: 1 | -1) => Promise<void>;
  disabled?: boolean;
  cooldownMessage?: string;
  onLoginRequest: () => void;
}

export default function VoteButtons({
  isLoggedIn,
  onVote,
  disabled,
  cooldownMessage,
  onLoginRequest,
}: VoteButtonsProps) {
  const { t } = useLang();
  const [voting, setVoting] = useState<1 | -1 | null>(null);

  async function handleVote(value: 1 | -1) {
    if (disabled || voting) return;
    setVoting(value);
    try {
      await onVote(value);
    } finally {
      setVoting(null);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <motion.button
          onClick={onLoginRequest}
          className="px-8 py-4 rounded-full text-xl font-boogaloo font-bold shadow-lg transition-all"
          style={{ background: "#FFCC00", color: "#1C1C1C" }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,204,0,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          🔐 {t.loginButton}
        </motion.button>
        <p className="text-white/40 mt-2 text-sm font-boogaloo">
          {t.loginOnly}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6">
        {/* Positive vote */}
        <motion.button
          onClick={() => handleVote(1)}
          disabled={!!disabled || voting !== null}
          className="w-24 h-24 rounded-full text-4xl font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            background: "rgba(34, 197, 94, 0.15)",
            border: "3px solid rgba(34,197,94,0.5)",
          }}
          whileHover={!disabled && voting === null ? { scale: 1.12, boxShadow: "0 0 20px rgba(34,197,94,0.4)" } : {}}
          whileTap={!disabled && voting === null ? { scale: 0.88 } : {}}
        >
          {voting === 1 ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              ⏳
            </motion.span>
          ) : "😇"}
        </motion.button>

        {/* Negative vote */}
        <motion.button
          onClick={() => handleVote(-1)}
          disabled={!!disabled || voting !== null}
          className="w-24 h-24 rounded-full text-4xl font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            background: "rgba(212, 5, 17, 0.15)",
            border: "3px solid rgba(212,5,17,0.5)",
          }}
          whileHover={!disabled && voting === null ? { scale: 1.12, boxShadow: "0 0 20px rgba(212,5,17,0.4)" } : {}}
          whileTap={!disabled && voting === null ? { scale: 0.88 } : {}}
        >
          {voting === -1 ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              ⏳
            </motion.span>
          ) : "💀"}
        </motion.button>
      </div>

      <div className="flex gap-4 text-sm font-boogaloo">
        <span className="text-green-400">{t.votePositive}</span>
        <span className="text-white/20">|</span>
        <span style={{ color: "#D40511" }}>{t.voteNegative}</span>
      </div>

      <AnimatePresence>
        {cooldownMessage && (
          <motion.p
            className="text-sm font-boogaloo text-center px-4 py-2 rounded-full"
            style={{ color: "#FFCC00", background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.3)" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ⏰ {cooldownMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
