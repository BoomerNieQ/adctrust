"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1C1C1C" }}>
        <div className="font-boogaloo text-2xl animate-pulse" style={{ color: "#FFCC00" }}>
          Laden...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: "#1C1C1C" }}>
        <p className="text-white font-boogaloo text-2xl">Log in om verder te gaan</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 rounded-full font-boogaloo font-bold"
          style={{ background: "#FFCC00", color: "#1C1C1C" }}
        >
          Inloggen
        </button>
      </div>
    );
  }

  // Only dominique.bollen@dhl.com has access
  const isAdmin = session.user.email === "dominique.bollen@dhl.com" || (session.user as any).isAdmin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: "#1C1C1C" }}>
        <p className="text-5xl">🚫</p>
        <p className="text-white font-boogaloo text-2xl">Geen toegang!</p>
        <p className="text-white/50 font-boogaloo">
          Hoi {(session.user as any).firstName ?? "vriend"}, jij bent geen admin.
        </p>
        <a href="/" className="font-boogaloo hover:underline" style={{ color: "#FFCC00" }}>
          ← Terug naar de barometer
        </a>
      </div>
    );
  }

  async function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setResetting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      setMessage(res.ok ? ("✅ " + data.message) : ("❌ " + data.error));
    } catch {
      setMessage("❌ Er ging iets mis");
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#1C1C1C" }}>
      {/* DHL top stripe */}
      <div className="fixed top-0 left-0 right-0 h-2 z-10"
        style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

      <motion.div
        className="max-w-md w-full rounded-2xl p-8 text-center"
        style={{ background: "#2A2A2A", border: "2px solid rgba(255,204,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* DHL header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4" style={{ background: "#FFCC00" }}>
          <span className="font-fredoka font-bold text-xl" style={{ color: "#1C1C1C" }}>DHL</span>
          <span className="font-boogaloo text-sm" style={{ color: "#1C1C1C" }}>Admin</span>
        </div>

        <h1 className="text-3xl font-boogaloo text-white mb-1">⚙️ Beheer</h1>
        <p className="text-white/40 font-boogaloo mb-8">
          Welkom, {(session.user as any).firstName}
        </p>

        <div className="space-y-4">
          <div className="rounded-xl p-6"
            style={{ background: "rgba(212,5,17,0.08)", border: "1px solid rgba(212,5,17,0.3)" }}>
            <h2 className="font-boogaloo text-xl mb-2" style={{ color: "#D40511" }}>
              🔴 Score Resetten
            </h2>
            <p className="text-white/40 text-sm font-boogaloo mb-4">
              Verwijdert ALLE stemmen. Geen weg terug.
            </p>

            {confirmReset && (
              <motion.p
                className="font-boogaloo mb-3"
                style={{ color: "#FFCC00" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Weet je het zeker? Klik nogmaals.
              </motion.p>
            )}

            <motion.button
              onClick={handleReset}
              disabled={resetting}
              className="w-full py-4 rounded-xl font-boogaloo text-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: confirmReset ? "#D40511" : "rgba(212,5,17,0.4)",
                border: `2px solid ${confirmReset ? "#D40511" : "rgba(212,5,17,0.5)"}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={confirmReset ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: confirmReset ? Infinity : 0, duration: 0.8 }}
            >
              {resetting ? "⏳ Bezig..." : confirmReset ? "🚨 JA, RESET ALLES!" : "🗑️ Reset Score"}
            </motion.button>
          </div>

          {message && (
            <motion.p
              className="text-white font-boogaloo text-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {message}
            </motion.p>
          )}

          <div className="flex gap-4 justify-center pt-2">
            <a href="/" className="font-boogaloo hover:underline transition-colors" style={{ color: "#FFCC00" }}>
              ← Barometer
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="font-boogaloo hover:underline transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Uitloggen
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
