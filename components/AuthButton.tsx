"use client";

import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import LoginModal from "./LoginModal";
import { useLang } from "@/lib/i18n";

export default function AuthButton() {
  const { t } = useLang();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click — avoids z-index stacking issues
  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  if (status === "loading") {
    return <div className="w-24 h-9 rounded-full bg-white/10 animate-pulse" />;
  }

  if (!session) {
    return (
      <>
        <motion.button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 rounded-full font-boogaloo text-sm font-bold"
          style={{ background: "#FFCC00", color: "#1C1C1C" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t.loginSubmit}
        </motion.button>
        <AnimatePresence>
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </AnimatePresence>
      </>
    );
  }

  const firstName = (session.user as any).firstName ?? session.user.name ?? "DHL";
  const lastName = (session.user as any).lastName ?? "";
  const isAdmin = (session.user as any).isAdmin;

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full px-4 py-2 font-boogaloo text-sm"
        style={{
          background: "rgba(255, 204, 0, 0.15)",
          border: "1px solid rgba(255, 204, 0, 0.4)",
          color: "#FFCC00",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: "#FFCC00", color: "#1C1C1C" }}
        >
          {firstName[0]}{lastName[0]}
        </div>
        <span className="hidden sm:block max-w-[100px] truncate">{firstName}</span>
        <span className="text-xs opacity-50">▾</span>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 rounded-xl p-2 min-w-[200px] shadow-2xl"
            style={{
              background: "#2A2A2A",
              border: "1px solid rgba(255,204,0,0.3)",
              zIndex: 9999,
            }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-white font-boogaloo text-sm font-bold">{firstName} {lastName}</p>
              <p className="text-white/40 text-xs truncate">{session.user.email}</p>
            </div>

            {isAdmin && (
              <a
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-boogaloo text-sm hover:bg-white/10 transition-colors"
                style={{ color: "#FFCC00" }}
                onClick={() => setMenuOpen(false)}
              >
                {t.adminBtn}
              </a>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-boogaloo text-sm hover:bg-white/10 transition-colors text-left"
              style={{ color: "#D40511" }}
            >
              🚪 {t.logout}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
