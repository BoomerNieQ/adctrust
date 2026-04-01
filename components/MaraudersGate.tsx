"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "i solemnly swear that i am up to no good";
const INK = "#2a1a0e";
const INK_MID = "rgba(42,26,14,0.55)";
const INK_FAINT = "rgba(42,26,14,0.25)";
const STORAGE_KEY = "marauders-map-access";

type Phase = "locked" | "revealing" | "revealed";

const CORRIDORS = [
  { d: "M 400,232 L 400,166 L 372,166 L 372,90 L 428,90",         delay: 0.2, dur: 1.6 },
  { d: "M 427,242 L 492,242 L 492,170 L 580,170 L 580,100 L 640,100", delay: 0.5, dur: 2.0 },
  { d: "M 448,262 L 552,262 L 552,218 L 670,218",                   delay: 0.7, dur: 1.5 },
  { d: "M 441,283 L 546,283 L 546,380 L 642,380 L 642,434",         delay: 0.5, dur: 2.0 },
  { d: "M 415,295 L 415,370 L 352,370 L 352,446 L 460,446",         delay: 0.3, dur: 2.0 },
  { d: "M 358,294 L 282,294 L 282,370 L 208,370 L 208,434 L 144,434", delay: 0.6, dur: 2.2 },
  { d: "M 352,262 L 272,262 L 272,200 L 182,200 L 144,200 L 100,160", delay: 0.8, dur: 2.2 },
  { d: "M 356,240 L 288,240 L 244,190 L 178,150 L 124,118",          delay: 1.0, dur: 1.8 },
  { d: "M 400,232 L 448,232 L 448,188 L 476,188",                    delay: 0.1, dur: 1.0 },
  { d: "M 442,248 L 558,248 L 558,156 L 622,156",                    delay: 0.6, dur: 1.5 },
];

const ROOMS = [
  { x: 350, y: 232, w: 100, h: 52,  label: "Entrance Hall",      sub: "",                        delay: 0.1 },
  { x: 358, y: 66,  w: 84,  h: 36,  label: "North Tower",        sub: "",                        delay: 0.9 },
  { x: 608, y: 78,  w: 100, h: 38,  label: "Astronomy Tower",    sub: "",                        delay: 1.1 },
  { x: 636, y: 196, w: 86,  h: 40,  label: "Library",            sub: "& Ravenclaw Tower",       delay: 1.2 },
  { x: 346, y: 432, w: 118, h: 50,  label: "The Great Hall",     sub: "",                        delay: 0.9 },
  { x: 42,  y: 144, w: 100, h: 38,  label: "Gryffindor Tower",   sub: "Common Room",             delay: 1.4 },
  { x: 94,  y: 412, w: 108, h: 44,  label: "The Dungeons",       sub: "Potions",                 delay: 1.2 },
  { x: 610, y: 416, w: 86,  h: 44,  label: "Greenhouses",        sub: "Herbology",               delay: 1.1 },
  { x: 596, y: 134, w: 96,  h: 40,  label: "Hospital Wing",      sub: "",                        delay: 1.2 },
  { x: 68,  y: 98,  w: 108, h: 40,  label: "Forbidden Forest",   sub: "⚠ Danger",               delay: 1.5 },
];

// Footsteps walking along the Gryffindor corridor
const STEPS = [
  { cx: 342, cy: 259, r: 90,  delay: 2.0 },
  { cx: 330, cy: 265, r: 90,  delay: 2.15 },
  { cx: 318, cy: 259, r: 90,  delay: 2.3 },
  { cx: 306, cy: 265, r: 90,  delay: 2.45 },
  { cx: 294, cy: 259, r: 90,  delay: 2.6 },
  { cx: 282, cy: 265, r: 90,  delay: 2.75 },
  { cx: 274, cy: 254, r: 5,   delay: 2.9 },
  { cx: 280, cy: 242, r: 175, delay: 3.05 },
  { cx: 274, cy: 230, r: 175, delay: 3.2 },
  { cx: 280, cy: 218, r: 175, delay: 3.35 },
  { cx: 274, cy: 206, r: 175, delay: 3.5 },
  { cx: 266, cy: 197, r: 90,  delay: 3.65 },
  { cx: 254, cy: 203, r: 90,  delay: 3.8 },
  { cx: 242, cy: 197, r: 90,  delay: 3.95 },
  { cx: 230, cy: 203, r: 90,  delay: 4.1 },
  { cx: 218, cy: 197, r: 90,  delay: 4.25 },
  { cx: 206, cy: 203, r: 90,  delay: 4.4 },
];

// House crests — one per corner
const CRESTS = [
  { tx: 8,   ty: 8,   house: "GRYFFINDOR", top: "#7B0D0D", bot: "#B8860B", delay: 1.7, animal: "lion"   },
  { tx: 732, ty: 8,   house: "RAVENCLAW",  top: "#0C2461", bot: "#7B5800", delay: 1.7, animal: "eagle"  },
  { tx: 8,   ty: 472, house: "HUFFLEPUFF", top: "#D4A000", bot: "#1a1a1a", delay: 1.8, animal: "badger" },
  { tx: 732, ty: 472, house: "SLYTHERIN",  top: "#1A4A2A", bot: "#6e6e6e", delay: 1.8, animal: "snake"  },
];

// Decorative dots for staircases
const STAIR_DOTS = Array.from({ length: 5 }, (_, i) => ({
  x: 450 + i * 6,
  y: 212,
  delay: 0.4 + i * 0.05,
}));

export default function MaraudersGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [typed, setTyped] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
      return;
    }
    setIsMobile("ontouchstart" in window);
  }, []);

  // Desktop keypress listener
  useEffect(() => {
    if (dismissed || isMobile || phase !== "locked") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
        return;
      }
      if (e.key.length !== 1) return;
      setTyped((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-SECRET.length);
        if (next === SECRET) triggerReveal();
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissed, isMobile, phase]);

  function triggerReveal() {
    setPhase("revealing");
    setTimeout(() => setPhase("revealed"), 5500);
  }

  function onMobileChange(val: string) {
    const lower = val.toLowerCase();
    setTyped(lower.slice(-SECRET.length));
    if (lower.toLowerCase().endsWith(SECRET)) {
      triggerReveal();
      inputRef.current?.blur();
    }
  }

  function handleMischief() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  if (dismissed) return <>{children}</>;

  const showMap = phase !== "locked";
  const typedHint = typed.slice(-30);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden select-none"
      style={{ background: "#e6d090" }}
    >
      {/* SVG paper texture overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="paper-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
            <feBlend in="SourceGraphic" in2="grey" mode="multiply"/>
          </filter>
          <filter id="aged">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="2" result="warp"/>
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        {/* Parchment age spots */}
        <ellipse cx="15%" cy="12%" rx="18%" ry="14%" fill="rgba(160,110,40,0.18)" filter="url(#paper-noise)"/>
        <ellipse cx="85%" cy="8%"  rx="16%" ry="12%" fill="rgba(140,90,30,0.14)" filter="url(#paper-noise)"/>
        <ellipse cx="90%" cy="85%" rx="20%" ry="15%" fill="rgba(170,120,50,0.16)" filter="url(#paper-noise)"/>
        <ellipse cx="8%"  cy="78%" rx="14%" ry="18%" fill="rgba(150,100,35,0.15)" filter="url(#paper-noise)"/>
        <ellipse cx="50%" cy="50%" rx="55%" ry="48%" fill="rgba(230,200,140,0.22)" filter="url(#paper-noise)"/>
        {/* Vignette */}
        <radialGradient id="vig" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(90,55,15,0.45)"/>
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#vig)"/>
      </svg>

      {/* Dark veil that lifts when revealing */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(15,8,2,0.88)" }}
        animate={{ opacity: showMap ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* ─── MAP SVG ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 800 560"
          className="w-full h-full"
          style={{ maxWidth: "1200px", maxHeight: "90vh" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              .map-label { font-family: Georgia, "Times New Roman", serif; font-style: italic; fill: ${INK}; }
              .map-sub   { font-family: Georgia, "Times New Roman", serif; font-style: italic; fill: ${INK_MID}; }
              .map-title { font-family: "Cinzel Decorative", Georgia, serif; fill: ${INK}; letter-spacing: 3px; }
              .map-cursive { font-family: Georgia, "Times New Roman", serif; font-style: italic; fill: ${INK}; }
            `}</style>
          </defs>

          {/* ── Corridors ── */}
          {CORRIDORS.map((c, i) => (
            <motion.path
              key={i}
              d={c.d}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={showMap ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { duration: c.dur, delay: c.delay, ease: "linear" },
                opacity: { duration: 0.05, delay: c.delay },
              }}
            />
          ))}

          {/* Staircase dots */}
          {STAIR_DOTS.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.x} cy={d.y} r={1.5}
              fill={INK}
              initial={{ opacity: 0 }}
              animate={showMap ? { opacity: 0.7 } : { opacity: 0 }}
              transition={{ delay: d.delay, duration: 0.1 }}
            />
          ))}

          {/* ── Rooms ── */}
          {ROOMS.map((r, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={showMap ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: r.delay }}
            >
              <rect
                x={r.x} y={r.y} width={r.w} height={r.h}
                fill="rgba(230,208,150,0.6)"
                stroke={INK}
                strokeWidth={1.2}
              />
              {/* Double border inner line */}
              <rect
                x={r.x + 3} y={r.y + 3} width={r.w - 6} height={r.h - 6}
                fill="none"
                stroke={INK_FAINT}
                strokeWidth={0.6}
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + (r.sub ? r.h / 2 - 2 : r.h / 2 + 5)}
                textAnchor="middle"
                fontSize={r.w > 90 ? "8.5" : "8"}
                className="map-label"
              >
                {r.label}
              </text>
              {r.sub && (
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 10}
                  textAnchor="middle"
                  fontSize="7"
                  className="map-sub"
                >
                  {r.sub}
                </text>
              )}
            </motion.g>
          ))}

          {/* ── Footsteps ── */}
          {STEPS.map((s, i) => (
            <motion.ellipse
              key={i}
              cx={s.cx} cy={s.cy}
              rx={3.5} ry={5}
              transform={`rotate(${s.r}, ${s.cx}, ${s.cy})`}
              fill={INK}
              fillOpacity={0.7}
              initial={{ opacity: 0 }}
              animate={showMap ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: s.delay, duration: 0.08 }}
            />
          ))}

          {/* ── Central Hogwarts Crest Area ── */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={showMap ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Outer decorative border */}
            <rect x={330} y={218} width={140} height={70} fill="rgba(230,208,150,0.7)" stroke={INK} strokeWidth={1.4}/>
            <rect x={334} y={222} width={132} height={62} fill="none" stroke={INK_FAINT} strokeWidth={0.7}/>
            {/* Corner flourishes */}
            {[[334,222],[466,222],[334,280],[466,280]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={2} fill={INK} opacity={0.5}/>
            ))}
            <text x={400} y={243} textAnchor="middle" fontSize="10" className="map-title" letterSpacing="4">HOGWARTS</text>
            <line x1={344} y1={248} x2={456} y2={248} stroke={INK_MID} strokeWidth={0.6}/>
            <text x={400} y={259} textAnchor="middle" fontSize="7.5" className="map-cursive">School of Witchcraft</text>
            <text x={400} y={270} textAnchor="middle" fontSize="7.5" className="map-cursive">and Wizardry</text>
          </motion.g>

          {/* ── Compass Rose ── */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={showMap ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <circle cx={740} cy={520} r={18} fill="none" stroke={INK_MID} strokeWidth={0.8}/>
            <circle cx={740} cy={520} r={4}  fill="none" stroke={INK_MID} strokeWidth={0.8}/>
            <line x1={740} y1={500} x2={740} y2={538} stroke={INK_MID} strokeWidth={0.8}/>
            <line x1={720} y1={520} x2={758} y2={520} stroke={INK_MID} strokeWidth={0.8}/>
            <polygon points="740,500 737,508 743,508" fill={INK_MID}/>
            <text x={740} y={496} textAnchor="middle" fontSize="7" className="map-sub">N</text>
          </motion.g>

          {/* ── House Crests ── */}
          {CRESTS.map((c) => {
            const ac =
              c.animal === "lion"   ? "rgba(255,210,0,0.92)"  :
              c.animal === "eagle"  ? "rgba(190,145,55,0.92)" :
              c.animal === "badger" ? "#111111"                :
                                     "rgba(140,220,120,0.95)";
            return (
              <motion.g
                key={c.house}
                transform={`translate(${c.tx},${c.ty})`}
                initial={{ opacity: 0 }}
                animate={showMap ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.9, delay: c.delay }}
              >
                {/* Shield fill — top half */}
                <rect x={0} y={0} width={60} height={38} fill={c.top} opacity={0.88}/>
                {/* Shield fill — bottom trapezoid */}
                <path d="M 0,38 L 60,38 L 60,56 L 30,76 L 0,56 Z" fill={c.bot} opacity={0.88}/>
                {/* Shield outline */}
                <path d="M 0,0 L 60,0 L 60,56 L 30,76 L 0,56 Z" fill="none" stroke={INK} strokeWidth={1.3}/>
                <path d="M 3,3 L 57,3 L 57,54 L 30,73 L 3,54 Z" fill="none" stroke="rgba(42,26,14,0.18)" strokeWidth={0.5}/>
                <line x1={4} y1={38} x2={56} y2={38} stroke="rgba(42,26,14,0.3)" strokeWidth={0.6}/>

                {/* Animal */}
                {c.animal === "lion" && (
                  <g>
                    <circle cx={30} cy={20} r={12} fill="rgba(185,140,0,0.25)" stroke="rgba(255,210,0,0.5)" strokeWidth={1}/>
                    <circle cx={30} cy={20} r={7.5} fill={ac}/>
                    <ellipse cx={30} cy={36} rx={8} ry={8} fill={ac}/>
                    <path d="M 22,29 Q 15,22 13,17" fill="none" stroke={ac} strokeWidth={2.5} strokeLinecap="round"/>
                    <path d="M 38,34 Q 48,26 46,18 Q 45,14 49,12" fill="none" stroke={ac} strokeWidth={1.5} strokeLinecap="round"/>
                  </g>
                )}
                {c.animal === "eagle" && (
                  <g fill={ac}>
                    <path d="M 3,30 Q 15,17 30,26 Q 45,17 57,30 L 52,32 Q 44,21 30,30 Q 16,21 8,32 Z"/>
                    <ellipse cx={30} cy={39} rx={7} ry={9}/>
                    <circle cx={30} cy={22} r={5.5}/>
                    <path d="M 34,23 L 41,25 L 34,27 Z"/>
                    <path d="M 24,47 L 22,53 M 28,48 L 27,54 M 32,48 L 33,54 M 36,47 L 38,53" fill="none" stroke={ac} strokeWidth={1.4} strokeLinecap="round"/>
                  </g>
                )}
                {c.animal === "badger" && (
                  <g>
                    <ellipse cx={30} cy={41} rx={14} ry={9} fill={ac}/>
                    <ellipse cx={30} cy={25} rx={11} ry={9} fill={ac}/>
                    <ellipse cx={21} cy={17} rx={4} ry={3.5} fill={ac}/>
                    <ellipse cx={39} cy={17} rx={4} ry={3.5} fill={ac}/>
                    <rect x={27.5} y={15} width={5} height={19} rx={2.5} fill="rgba(240,228,170,0.9)"/>
                    <circle cx={24} cy={23} r={1.5} fill="#FFD700"/>
                    <circle cx={36} cy={23} r={1.5} fill="#FFD700"/>
                  </g>
                )}
                {c.animal === "snake" && (
                  <g>
                    <path d="M 22,53 Q 7,46 12,33 Q 17,21 31,26 Q 45,31 48,18 Q 51,9 43,8" fill="none" stroke={ac} strokeWidth={4} strokeLinecap="round"/>
                    <ellipse cx={44} cy={9} rx={6} ry={4} fill={ac} transform="rotate(-35,44,9)"/>
                    <path d="M 49,6 L 55,3 M 49,6 L 55,9" fill="none" stroke="#cc3333" strokeWidth={1} strokeLinecap="round"/>
                    <circle cx={43} cy={7} r={1.2} fill="#0a1a0a"/>
                  </g>
                )}

                {/* House name */}
                <text x={30} y={84} textAnchor="middle" fontSize="5.5" className="map-label" letterSpacing="1.5" opacity={0.8}>
                  {c.house}
                </text>
              </motion.g>
            );
          })}

          {/* ── Bottom presentation text ── */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={phase === "revealed" ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <line x1={180} y1={508} x2={620} y2={508} stroke={INK_MID} strokeWidth={0.6}/>
            <text x={400} y={522} textAnchor="middle" fontSize="8.5" className="map-cursive" opacity="0.75">
              Messrs. Moony, Wormtail, Padfoot, and Prongs are proud to present
            </text>
            <text x={400} y={534} textAnchor="middle" fontSize="11" className="map-title" letterSpacing="2">
              The Marauder&apos;s Map
            </text>
            <line x1={180} y1={542} x2={620} y2={542} stroke={INK_MID} strokeWidth={0.6}/>
          </motion.g>
        </svg>
      </div>

      {/* ─── LOCKED STATE ────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "locked" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Animated title in locked state */}
            <motion.div
              className="text-center px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <p
                className="text-2xl sm:text-3xl mb-3 italic"
                style={{ color: "rgba(232,210,140,0.85)", fontFamily: "Georgia, serif", textShadow: "0 0 20px rgba(232,210,140,0.3)" }}
              >
                Mr Prongs cautions all who enter
              </p>
              <p
                className="text-base italic"
                style={{ color: "rgba(232,210,140,0.5)", fontFamily: "Georgia, serif" }}
              >
                that extraordinary danger lies ahead
              </p>

              {/* Typing indicator */}
              <motion.div
                className="mt-16"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {typedHint ? (
                  <p
                    className="text-base italic tracking-widest"
                    style={{ color: "rgba(232,210,140,0.55)", fontFamily: "Georgia, serif" }}
                  >
                    {typedHint}
                    <span className="animate-pulse">|</span>
                  </p>
                ) : (
                  <p
                    className="text-xs uppercase tracking-[0.4em]"
                    style={{ color: "rgba(232,210,140,0.3)", fontFamily: "Georgia, serif" }}
                  >
                    {isMobile ? "tap below to enter the incantation" : "begin the incantation..."}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MISCHIEF MANAGED BUTTON ─────────────────────────────── */}
      <AnimatePresence>
        {phase === "revealed" && (
          <motion.div
            className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              onClick={handleMischief}
              className="px-8 py-3 text-lg italic"
              style={{
                color: INK,
                fontFamily: "Georgia, 'Times New Roman', serif",
                border: `1.5px solid ${INK_MID}`,
                background: "rgba(230,208,150,0.85)",
                borderRadius: "4px",
                letterSpacing: "1px",
                boxShadow: "0 2px 12px rgba(42,26,14,0.15)",
              }}
              whileHover={{ scale: 1.04, background: "rgba(220,195,130,0.95)" }}
              whileTap={{ scale: 0.97 }}
            >
              Mischief Managed
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE INPUT ────────────────────────────────────────── */}
      {isMobile && phase === "locked" && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 px-8">
          <input
            ref={inputRef}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Enter the incantation..."
            onChange={(e) => onMobileChange(e.target.value)}
            className="w-full max-w-sm px-4 py-2 text-center italic outline-none"
            style={{
              background: "rgba(230,208,150,0.7)",
              border: `1px solid ${INK_MID}`,
              borderRadius: "4px",
              color: INK,
              fontFamily: "Georgia, serif",
              fontSize: "14px",
            }}
          />
        </div>
      )}
    </div>
  );
}
