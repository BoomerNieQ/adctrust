"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useLang();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const previewName = (() => {
    const match = email.match(/^([a-zA-Z]+)\.[a-zA-Z]+@dhl\.com$/i);
    if (!match) return null;
    return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  })();

  const isValid = /^[a-zA-Z]+\.[a-zA-Z]+@dhl\.com$/i.test(email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) { setError(t.loginError); return; }
    setLoading(true);
    setError("");
    const result = await signIn("dhl-email", { email: email.trim().toLowerCase(), redirect: false });
    setLoading(false);
    if (result?.error) {
      setError(t.loginError);
    } else {
      onClose();
      window.location.reload();
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,28,28,0.92)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#2A2A2A", border: "2px solid rgba(255,204,0,0.3)" }}
        initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="h-2 w-full" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-dhl-yellow px-5 py-2 rounded-lg mb-3">
              <span className="text-dhl-dark font-fredoka text-2xl font-bold tracking-wider">DHL</span>
            </div>
            <h2 className="text-xl text-white font-boogaloo">{t.loginTitle}</h2>
            <p className="text-white/40 text-sm mt-1 font-boogaloo">{t.headerSub}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-boogaloo mb-1.5">{t.loginEmailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={t.loginEmailPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-white font-boogaloo text-lg outline-none transition-all"
                style={{
                  background: "#1C1C1C",
                  border: `2px solid ${isValid ? "#FFCC00" : error ? "#D40511" : "rgba(255,255,255,0.1)"}`,
                }}
                autoFocus autoComplete="email" spellCheck={false}
              />
              <AnimatePresence>
                {previewName && (
                  <motion.p className="text-sm mt-2 font-boogaloo" style={{ color: "#FFCC00" }}
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {t.loginHi} {previewName}!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.p className="text-sm font-boogaloo px-3 py-2 rounded-lg"
                style={{ color: "#D40511", background: "rgba(212,5,17,0.1)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ⚠️ {error}
              </motion.p>
            )}

            <motion.button type="submit" disabled={!isValid || loading}
              className="w-full py-3 rounded-xl font-boogaloo text-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: isValid ? "#FFCC00" : "rgba(255,204,0,0.3)", color: "#1C1C1C" }}
              whileHover={isValid ? { scale: 1.02 } : {}} whileTap={isValid ? { scale: 0.98 } : {}}>
              {loading ? `⏳ ${t.loginLoading}` : `→ ${t.loginSubmit}`}
            </motion.button>

            <button type="button" onClick={onClose}
              className="w-full py-2 text-white/30 hover:text-white/60 font-boogaloo text-sm transition-colors">
              {t.loginCancel}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
