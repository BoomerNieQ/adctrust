"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function RingingPhone({ inline = false }: { inline?: boolean }) {
  const { t } = useLang();
  const [answered, setAnswered] = useState(false);
  const [open, setOpen]         = useState(false);
  const [hasGutter, setHasGutter] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setHasGutter(window.innerWidth >= 1800);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/media/tubular-bells.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.55;
    audioRef.current.play().catch(() => {});
    return () => { audioRef.current?.pause(); };
  }, []);

  function handleAnswer() {
    audioRef.current?.pause();
    setAnswered(true);
    setOpen(true);
  }

  if (!inline && !hasGutter) return null;

  return (
    <section className={inline ? "flex flex-col items-center" : "fixed z-40 flex flex-col items-center"} style={inline ? {} : { top: "30vh", left: "calc(50vw + 720px)" }}>
      {/* Glow rings */}
      {!answered && (
        <>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${180 + i * 80}px`,
                height: `${180 + i * 80}px`,
                border: "2px solid rgba(255, 80, 80, 0.6)",
                boxShadow: "0 0 24px rgba(255,60,60,0.4)",
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.4, delay: i * 0.35, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      {/* The phone */}
      <motion.button
        onClick={handleAnswer}
        style={{ background: "none", border: "none", cursor: answered ? "default" : "pointer", padding: 0, position: "relative", zIndex: 1 }}
        animate={answered ? {} : {
          rotate: [-8, 8, -7, 7, -5, 5, 0],
          y: [0, -4, 0],
        }}
        transition={{ duration: 0.55, repeat: answered ? 0 : Infinity, repeatDelay: 0.7 }}
        whileHover={answered ? {} : { scale: 1.06 }}
        whileTap={answered ? {} : { scale: 0.95 }}
        aria-label="Telefoon opnemen"
      >
        <PhoneSVG answered={answered} callerName={t.phoneCaller} answeredText={t.phoneAnswered} />
      </motion.button>

      {/* Label below phone */}
      <AnimatePresence>
        {!answered && (
          <motion.p
            className="mt-5 font-boogaloo text-sm text-center"
            style={{ color: "rgba(255,100,100,0.85)", letterSpacing: "2px" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            {t.phoneIncoming}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Gotcha modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl text-center"
              style={{ background: "#1a1a1a", border: "2px solid rgba(255,80,80,0.4)" }}
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5" style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }} />
              <div className="px-6 pt-7 pb-3">
                <motion.div
                  style={{ fontSize: "56px", lineHeight: 1 }}
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.1 }}
                >
                  📞
                </motion.div>
                <motion.p
                  className="font-boogaloo mt-5 text-lg leading-snug"
                  style={{ color: "white" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.phoneGotcha}
                </motion.p>
                <motion.p
                  className="mt-3 font-boogaloo text-base"
                  style={{ color: "rgba(255,204,0,0.8)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  {t.phoneGotchaSub}
                </motion.p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <motion.button
                  onClick={() => setOpen(false)}
                  className="text-white/30 text-xs font-boogaloo hover:text-white/55 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {t.phoneHangUp}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PhoneSVG({ answered, callerName, answeredText }: { answered: boolean; callerName: string; answeredText: string }) {
  return (
    <svg width="140" height="240" viewBox="0 0 140 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="140" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="100%" stopColor="#111"/>
        </linearGradient>
        <filter id="phoneGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0.6  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 1.2 0" in="blur" result="g"/>
          <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="screenGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Phone body */}
      <rect x="4" y="4" width="132" height="232" rx="20" fill="url(#phoneBody)" filter={answered ? undefined : "url(#phoneGlow)"}/>
      <rect x="4" y="4" width="132" height="232" rx="20" fill="none" stroke={answered ? "rgba(80,80,80,0.6)" : "rgba(255,80,80,0.9)"} strokeWidth="2.5"/>

      {/* Side buttons */}
      <rect x="0" y="70" width="4" height="28" rx="2" fill="#333"/>
      <rect x="0" y="106" width="4" height="28" rx="2" fill="#333"/>
      <rect x="136" y="88" width="4" height="40" rx="2" fill="#333"/>

      {/* Notch / speaker */}
      <rect x="50" y="14" width="40" height="6" rx="3" fill="#111"/>
      <circle cx="96" cy="17" r="4" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
      {/* Camera dot */}
      <circle cx="96" cy="17" r="1.5" fill={answered ? "#333" : "rgba(255,80,80,0.8)"}/>

      {/* Screen */}
      <rect x="10" y="28" width="120" height="184" rx="12" fill={answered ? "#0d0d0d" : "#0d0d18"}/>

      {/* Screen content — ringing */}
      {!answered ? (
        <g filter="url(#screenGlow)">
          {/* Caller avatar circle */}
          <circle cx="70" cy="80" r="28" fill="rgba(255,60,60,0.15)" stroke="rgba(255,80,80,0.6)" strokeWidth="1.5"/>
          <text x="70" y="88" textAnchor="middle" fontSize="26" fill="white">👤</text>
          {/* Caller name */}
          <text x="70" y="125" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)" fontFamily="Arial,sans-serif" fontWeight="bold">
            {callerName}
          </text>
          <text x="70" y="138" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="Arial,sans-serif">
            Mobiel
          </text>

          {/* Pulsing ring indicator */}
          <motion.circle cx="70" cy="80" r="36" fill="none" stroke="rgba(255,80,80,0.4)" strokeWidth="1"
            animate={{ r: [36, 44, 36], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Decline button (red) */}
          <circle cx="46" cy="175" r="16" fill="rgba(220,30,30,0.9)"/>
          <text x="46" y="181" textAnchor="middle" fontSize="14" fill="white">📵</text>

          {/* Answer button (green) */}
          <circle cx="94" cy="175" r="16" fill="rgba(30,180,80,0.9)"/>
          <text x="94" y="181" textAnchor="middle" fontSize="14" fill="white">📞</text>
        </g>
      ) : (
        <g>
          <text x="70" y="120" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.25)" fontFamily="Arial,sans-serif">
            {answeredText}
          </text>
        </g>
      )}

      {/* Home bar */}
      <rect x="50" y="220" width="40" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}
