"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "mellon";
const STONE = "#0c0c14";
const DOOR_FILL = "#0f0f1a";
const SILVER = "#c8e0f8";
const STORAGE_KEY = "moria-gate-access";

// 7-pointed star at centre (225,48) — precomputed
const STAR =
  "M 225,20 L 230.1,37.4 L 246.5,30.8 L 236.2,45.7 L 251.8,54.2 " +
  "L 234.0,55.0 L 236.8,73.0 L 225,60 L 213.2,73.0 L 216.0,55.0 " +
  "L 198.2,54.2 L 213.8,45.7 L 203.5,30.8 L 219.9,37.4 Z";

const SMALL_STARS: [number, number][] = [
  [62,128],[33,158],[95,178],[46,292],[70,338],[27,386],[98,222],[55,256],[38,312],
  [388,128],[417,158],[355,178],[404,292],[380,338],[423,386],[352,222],[395,256],[412,312],
  [190,150],[260,145],[200,340],[250,335],
];

function star4(cx: number, cy: number) {
  return `M ${cx},${cy - 4} L ${cx + 1},${cy - 1} L ${cx + 4},${cy} L ${cx + 1},${cy + 1} L ${cx},${cy + 4} L ${cx - 1},${cy + 1} L ${cx - 4},${cy} L ${cx - 1},${cy - 1} Z`;
}

function DoorSVG({ side }: { side: "l" | "r" }) {
  const glow = `glow-${side}`;
  const arc  = `arc-${side}`;
  return (
    <svg
      viewBox="0 0 450 430"
      style={{ position: "absolute", top: 0, left: side === "l" ? 0 : "-225px", width: "450px", height: "430px" }}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feColorMatrix
            type="matrix"
            values="0.2 0 0 0 0.35  0.1 0 0 0 0.55  0 0 0 0 0.9  0 0 0 1.4 0"
            in="blur" result="cb"
          />
          <feMerge>
            <feMergeNode in="cb"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <path
          id={arc}
          d="M 30,426 L 30,230 Q 30,38 225,26 Q 420,38 420,230 L 420,426"
          fill="none"
        />
      </defs>

      {/* Stone background (corners outside arch) */}
      <rect width="450" height="430" fill={STONE}/>

      {/* Door surface */}
      <path d="M 14,428 L 14,220 Q 14,18 225,8 Q 436,18 436,220 L 436,428 Z" fill={DOOR_FILL}/>

      {/* All glowing design */}
      <g filter={`url(#${glow})`} strokeLinecap="round" strokeLinejoin="round">

        {/* Outer arch */}
        <path d="M 14,428 L 14,220 Q 14,18 225,8 Q 436,18 436,220 L 436,428"
          fill="none" stroke={SILVER} strokeWidth="2"/>
        {/* Inner arch */}
        <path d="M 24,428 L 24,226 Q 24,30 225,20 Q 426,30 426,226 L 426,428"
          fill="none" stroke={SILVER} strokeWidth="0.7" opacity="0.4"/>

        {/* ── 7-pointed star ── */}
        <path d={STAR} fill={SILVER} stroke="none"/>

        {/* ── Crescents either side of star ── */}
        {/* Left crescent */}
        <circle cx={172} cy={48} r={14} fill={SILVER}/>
        <circle cx={179} cy={48} r={11} fill={DOOR_FILL}/>
        {/* Right crescent */}
        <circle cx={278} cy={48} r={14} fill={SILVER}/>
        <circle cx={271} cy={48} r={11} fill={DOOR_FILL}/>

        {/* ── Left Elvish tree ── */}
        <g fill="none" stroke={SILVER} strokeWidth="1.5">
          {/* Trunk */}
          <path d="M 118,395 L 118,202"/>
          {/* Branches left */}
          <path d="M 118,228 Q 80,206 48,194 Q 32,188 22,186"/>
          <path d="M 48,194 Q 32,186 22,182"/>
          <path d="M 118,258 Q 86,247 62,242 Q 46,238 32,236"/>
          <path d="M 62,242 Q 46,236 32,232"/>
          <path d="M 118,292 Q 92,288 70,285 Q 52,283 38,281"/>
          <path d="M 118,322 Q 94,320 76,318"/>
          {/* Branches toward center */}
          <path d="M 118,243 Q 142,235 164,231"/>
          <path d="M 118,275 Q 148,268 170,264"/>
          {/* Roots */}
          <path d="M 118,395 Q 92,410 68,414 Q 50,416 34,412"/>
          <path d="M 118,395 Q 154,414 188,420 Q 210,424 225,425"/>
          <path d="M 118,395 Q 104,418 98,428"/>
        </g>

        {/* ── Right Elvish tree (mirror) ── */}
        <g fill="none" stroke={SILVER} strokeWidth="1.5">
          <path d="M 332,395 L 332,202"/>
          <path d="M 332,228 Q 370,206 402,194 Q 418,188 428,186"/>
          <path d="M 402,194 Q 418,186 428,182"/>
          <path d="M 332,258 Q 364,247 388,242 Q 404,238 418,236"/>
          <path d="M 388,242 Q 404,236 418,232"/>
          <path d="M 332,292 Q 358,288 380,285 Q 398,283 412,281"/>
          <path d="M 332,322 Q 356,320 374,318"/>
          <path d="M 332,243 Q 308,235 286,231"/>
          <path d="M 332,275 Q 302,268 280,264"/>
          <path d="M 332,395 Q 358,410 382,414 Q 400,416 416,412"/>
          <path d="M 332,395 Q 296,414 262,420 Q 240,424 225,425"/>
          <path d="M 332,395 Q 346,418 352,428"/>
        </g>

        {/* ── Root join at bottom centre ── */}
        <path d="M 180,420 Q 200,426 225,427 Q 250,426 270,420"
          fill="none" stroke={SILVER} strokeWidth="1.2" opacity="0.7"/>

        {/* ── Door centre line (gap) ── */}
        <line x1={225} y1={90} x2={225} y2={428} stroke={SILVER} strokeWidth="0.5" strokeDasharray="4,7" opacity="0.25"/>

        {/* ── Inscription along arch ── */}
        <text fontSize="7.5" fill={SILVER} stroke="none" opacity="0.8" letterSpacing="1.8">
          <textPath href={`#${arc}`} startOffset="3%">
            ENNYN DURIN ARAN MORIA · PEDO MELLON A MINNO · IM NARVI HAIN ECHANT ·
          </textPath>
        </text>

        {/* ── Small scattered stars ── */}
        {SMALL_STARS.map(([sx, sy], i) => (
          <path key={i} d={star4(sx, sy)} fill={SILVER} stroke="none" opacity="0.55"/>
        ))}
      </g>
    </svg>
  );
}

export default function MoriaGate({ children, onComplete }: { children: ReactNode; onComplete?: () => void }) {
  const [phase, setPhase] = useState<"dark" | "moonlit" | "opening">("dark");
  const [typed, setTyped]   = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") { setDismissed(true); return; }
    setIsMobile("ontouchstart" in window);
    const t = setTimeout(() => setPhase("moonlit"), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (dismissed || phase === "opening" || isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === "Backspace") { setTyped(p => p.slice(0, -1)); return; }
      if (e.key.length !== 1) return;
      setTyped(prev => {
        const next = (prev + e.key.toLowerCase()).slice(-SECRET.length);
        if (next === SECRET) triggerOpen();
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissed, phase, isMobile]);

  function triggerOpen() {
    setPhase("opening");
    setTimeout(() => { sessionStorage.setItem(STORAGE_KEY, "1"); onComplete?.(); setDismissed(true); }, 2900);
  }

  function onMobileInput(val: string) {
    const lower = val.toLowerCase();
    setTyped(lower.slice(-SECRET.length));
    if (lower.endsWith(SECRET)) { triggerOpen(); inputRef.current?.blur(); }
  }

  if (dismissed) return <>{children}</>;

  const moonlit = phase !== "dark";
  const opening = phase === "opening";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden select-none"
      style={{ background: STONE }}
    >
      {/* Stone noise texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="snoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" result="n"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0 0.1  0 0 0 0.18 0" in="n" result="t"/>
            <feBlend in="SourceGraphic" in2="t" mode="overlay"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill={STONE} filter="url(#snoise)"/>
        <radialGradient id="svig" cx="50%" cy="50%" r="65%">
          <stop offset="35%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.75)"/>
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#svig)"/>
      </svg>

      {/* Warm light flooding through when opening */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: "600px", height: "500px",
              background:
                "radial-gradient(ellipse 65% 80% at 50% 60%, rgba(255,210,90,1) 0%, rgba(255,145,20,0.75) 22%, rgba(220,80,5,0.3) 50%, transparent 72%)",
            }}
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 1.8, delay: 0.25, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ─── The two door panels ─── */}
      <div style={{ position: "relative", width: "450px", height: "430px", perspective: "1400px" }}>

        {/* Left door */}
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, width: "225px", height: "430px", overflow: "hidden", transformOrigin: "left center" }}
          initial={{ opacity: 0.06 }}
          animate={{ opacity: moonlit ? 1 : 0.06, rotateY: opening ? -82 : 0 }}
          transition={{
            opacity:  { duration: 2.4, ease: "easeOut" },
            rotateY:  { duration: 2.6, ease: [0.55, 0.05, 0.35, 1] },
          }}
        >
          <DoorSVG side="l"/>
        </motion.div>

        {/* Right door */}
        <motion.div
          style={{ position: "absolute", left: "225px", top: 0, width: "225px", height: "430px", overflow: "hidden", transformOrigin: "right center" }}
          initial={{ opacity: 0.06 }}
          animate={{ opacity: moonlit ? 1 : 0.06, rotateY: opening ? 82 : 0 }}
          transition={{
            opacity:  { duration: 2.4, ease: "easeOut" },
            rotateY:  { duration: 2.6, ease: [0.55, 0.05, 0.35, 1] },
          }}
        >
          <DoorSVG side="r"/>
        </motion.div>
      </div>

      {/* ─── "Speak, friend, and enter" — dark phase ─── */}
      <AnimatePresence>
        {phase === "dark" && (
          <motion.p
            className="absolute"
            style={{ top: "11%", color: "rgba(196,220,244,0.3)", fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontSize: "20px", letterSpacing: "3px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: 0.6 }}
          >
            Speak, friend, and enter
          </motion.p>
        )}
      </AnimatePresence>

      {/* ─── Typing hint — moonlit phase ─── */}
      <AnimatePresence>
        {phase === "moonlit" && (
          <motion.div
            className="absolute text-center"
            style={{ bottom: "9%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.6 }}
          >
            <p style={{ color: "rgba(196,220,244,0.3)", fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "12px", letterSpacing: "4px", marginBottom: "10px" }}>
              pedo mellon a minno
            </p>
            {typed && (
              <p style={{ color: "rgba(196,220,244,0.65)", fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "18px", letterSpacing: "5px" }}>
                {typed}<span style={{ opacity: 0.5 }}>_</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile input ─── */}
      {isMobile && phase !== "opening" && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 z-20">
          <input
            ref={inputRef}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Enter the elvish word..."
            onChange={(e) => onMobileInput(e.target.value)}
            className="w-full max-w-xs px-4 py-2 text-center italic outline-none"
            style={{
              background: "rgba(196,220,244,0.06)",
              border: "1px solid rgba(196,220,244,0.22)",
              borderRadius: "3px",
              color: SILVER,
              fontFamily: "Georgia,serif",
              fontSize: "14px",
            }}
          />
        </div>
      )}
    </div>
  );
}
