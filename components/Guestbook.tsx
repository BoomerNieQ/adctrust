"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface Entry {
  id: string;
  message: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

export default function Guestbook() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) fetchEntries();
  }, [open]);

  async function fetchEntries() {
    const res = await fetch("/api/guestbook");
    if (res.ok) setEntries(await res.json());
  }

  async function submit() {
    if (!message.trim()) return;
    setSending(true);
    setError("");
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (res.ok) {
      setEntries((prev) => [data, ...prev]);
      setMessage("");
    } else {
      setError(data.error ?? "Er ging iets mis");
    }
    setSending(false);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-full font-boogaloo font-bold text-sm shadow-lg"
        style={{
          background: "rgba(255,204,0,0.12)",
          border: "2px solid rgba(255,204,0,0.4)",
          color: "rgba(255,220,80,0.95)",
        }}
        whileHover={{ scale: 1.05, background: "rgba(255,204,0,0.22)" }}
        whileTap={{ scale: 0.95 }}
      >
        📖 Gastenboek
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(8,8,8,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{
                background: "#141414",
                border: "2px solid rgba(255,204,0,0.35)",
                maxHeight: "85vh",
              }}
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header stripe */}
              <div className="h-1.5 w-full flex-shrink-0" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />

              {/* Title */}
              <div className="px-6 pt-5 pb-3 flex-shrink-0">
                <h2 className="font-boogaloo text-2xl" style={{ color: "#FFCC00" }}>
                  📖 Gastenboek
                </h2>
                <p className="text-white/40 text-xs font-boogaloo mt-0.5">
                  Laat een berichtje achter voor Dominique
                </p>
              </div>

              {/* Input area — only for logged-in users */}
              {session ? (
                <div className="px-6 pb-4 flex-shrink-0">
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.2)" }}
                  >
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                      placeholder="Schrijf iets..."
                      rows={3}
                      className="w-full bg-transparent text-white/90 text-sm font-boogaloo resize-none outline-none placeholder-white/25"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/25 text-xs">{message.length}/300</span>
                      <motion.button
                        onClick={submit}
                        disabled={sending || !message.trim()}
                        className="px-4 py-1.5 rounded-full font-boogaloo text-sm font-bold disabled:opacity-40"
                        style={{ background: "#FFCC00", color: "#1C1C1C" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sending ? "..." : "Verstuur"}
                      </motion.button>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-1 font-boogaloo">{error}</p>}
                  </div>
                </div>
              ) : (
                <p className="px-6 pb-4 text-white/40 text-sm font-boogaloo flex-shrink-0">
                  Log in om een berichtje achter te laten.
                </p>
              )}

              {/* Divider */}
              <div className="mx-6 flex-shrink-0" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

              {/* Entries */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                {entries.length === 0 && (
                  <p className="text-white/30 text-sm font-boogaloo text-center py-8">
                    Nog geen berichten. Wees de eerste!
                  </p>
                )}
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-boogaloo text-sm font-bold" style={{ color: "#FFCC00" }}>
                        {entry.user.firstName} {entry.user.lastName}
                      </span>
                      <span className="text-white/30 text-xs font-boogaloo">{formatDate(entry.createdAt)}</span>
                    </div>
                    <p className="text-white/80 text-sm font-boogaloo leading-relaxed">{entry.message}</p>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 text-center flex-shrink-0">
                <button onClick={() => setOpen(false)} className="text-white/25 text-xs font-boogaloo hover:text-white/50 transition-colors">
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
