"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ThermometerProps {
  score: number;
  isShaking?: boolean;
}

function getColor(score: number): string {
  if (score < -50) return "#D40511";
  if (score < -20) return "#f97316";
  if (score < 20)  return "#FFCC00";
  if (score < 60)  return "#a3e635";
  return "#22c55e";
}

function getCrackOpacity(score: number): number {
  if (score <= -50) return (Math.abs(score) - 50) / 50;
  return 0;
}

export default function Thermometer({ score, isShaking }: ThermometerProps) {
  const clampedScore = Math.max(-100, Math.min(100, score));
  const fillPercent = ((clampedScore + 100) / 200) * 100;
  const color = getColor(clampedScore);
  const crackOpacity = getCrackOpacity(clampedScore);

  // Dimensions declared before hooks that reference them
  const svgW = 100;
  const tubeWidth = 26;
  const tubeHeight = 420;
  const bulbRadius = 32;

  const springScore = useSpring(fillPercent, { stiffness: 55, damping: 14 });
  useEffect(() => { springScore.set(fillPercent); }, [fillPercent, springScore]);

  const mercuryHeight = useTransform(springScore, (v) => `${v}%`);
  const mercuryY = useTransform(springScore, (v) => 12 + tubeHeight - (v / 100) * tubeHeight);
  const cx = svgW / 2;
  const svgH = tubeHeight + bulbRadius * 2 + 20;
  const rightLabelX = cx + tubeWidth / 2 + 14;

  const ticks = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

  return (
    <motion.div
      className="flex flex-col items-center select-none w-28 sm:w-36 md:w-44 lg:w-auto"
      animate={isShaking ? { x: [-5, 5, -5, 5, -3, 3, -2, 2, 0] } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Score label above */}
      <motion.div
        className="mb-3 text-center"
        key={clampedScore}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span
          className="text-4xl font-fredoka font-bold"
          style={{ color }}
        >
          {clampedScore > 0 ? `+${clampedScore}` : clampedScore}
        </span>
      </motion.div>

      {/* On mobile shrink to ~65% by constraining the SVG width — viewBox handles aspect ratio */}
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${svgW + 80} ${svgH + 10}`}
        style={{ overflow: "visible", maxWidth: svgW + 80 }}
      >
        <defs>
          <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>
          <radialGradient id="bulbGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="mercuryClip2">
            <rect x={cx - tubeWidth / 2 + 3} y={12} width={tubeWidth - 6} height={tubeHeight} rx={5} />
          </clipPath>
        </defs>

        <g transform="translate(36, 4)">
          {/* Tube background */}
          <rect
            x={cx - tubeWidth / 2} y={10}
            width={tubeWidth} height={tubeHeight + 4}
            rx={tubeWidth / 2}
            fill="rgba(20,20,30,0.85)"
            stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
          />

          {/* Mercury */}
          <g clipPath="url(#mercuryClip2)">
            <motion.rect
              x={cx - tubeWidth / 2 + 3}
              width={tubeWidth - 6}
              rx={5}
              fill={color}
              style={{ height: mercuryHeight, y: mercuryY }}
            />
          </g>

          {/* Glass shine */}
          <rect
            x={cx - tubeWidth / 2} y={10}
            width={tubeWidth} height={tubeHeight + 4}
            rx={tubeWidth / 2}
            fill="url(#tubeGrad)"
            pointerEvents="none"
          />
          <rect
            x={cx - tubeWidth / 2} y={10}
            width={tubeWidth} height={tubeHeight + 4}
            rx={tubeWidth / 2}
            fill="none"
            stroke="rgba(255,255,255,0.35)" strokeWidth={1}
          />

          {/* Crack at -50 */}
          {crackOpacity > 0 && (
            <g opacity={crackOpacity * 0.9}>
              <line x1={cx - 3} y1={50}  x2={cx + 8}  y2={100} stroke="#ff4444" strokeWidth={1.5} />
              <line x1={cx + 8} y1={100} x2={cx - 5}  y2={160} stroke="#ff4444" strokeWidth={1} />
              <line x1={cx + 5} y1={80}  x2={cx + 12} y2={130} stroke="#ff4444" strokeWidth={0.8} />
            </g>
          )}

          {/* Tick marks */}
          {ticks.map((tick) => {
            const pct = ((tick + 100) / 200) * 100;
            const y = 12 + tubeHeight - (pct / 100) * tubeHeight;
            const isMajor = tick % 50 === 0;
            const isZero = tick === 0;
            return (
              <g key={tick}>
                <line
                  x1={cx + tubeWidth / 2} y1={y}
                  x2={cx + tubeWidth / 2 + (isMajor ? 14 : 8)} y2={y}
                  stroke={isZero ? "#FFCC00" : "rgba(255,255,255,0.5)"}
                  strokeWidth={isMajor ? 2 : 1}
                />
                <line
                  x1={cx - tubeWidth / 2} y1={y}
                  x2={cx - tubeWidth / 2 - (isMajor ? 10 : 6)} y2={y}
                  stroke={isZero ? "#FFCC00" : "rgba(255,255,255,0.3)"}
                  strokeWidth={isMajor ? 1.5 : 1}
                />
                {isMajor && (
                  <text
                    x={rightLabelX}
                    y={y + 4}
                    fill={isZero ? "#FFCC00" : "rgba(255,255,255,0.6)"}
                    fontSize={11}
                    fontFamily="monospace"
                    fontWeight={isZero ? "bold" : "normal"}
                  >
                    {tick > 0 ? `+${tick}` : tick}
                  </text>
                )}
              </g>
            );
          })}

          {/* Bulb shell */}
          <circle
            cx={cx} cy={tubeHeight + bulbRadius + 14}
            r={bulbRadius}
            fill="rgba(18,18,28,0.92)"
            stroke="rgba(255,255,255,0.2)" strokeWidth={2}
          />
          {/* Bulb mercury */}
          <motion.circle
            cx={cx} cy={tubeHeight + bulbRadius + 14}
            r={bulbRadius - 5}
            fill="url(#bulbGrad)"
            filter="url(#glow2)"
          />
          {/* Bulb shine */}
          <circle cx={cx - 10} cy={tubeHeight + bulbRadius + 6} r={7}
            fill="rgba(255,255,255,0.18)" />

          {/* Score in bulb */}
          <text
            x={cx} y={tubeHeight + bulbRadius + 19}
            textAnchor="middle"
            fill="white" fontSize={12} fontWeight="bold" fontFamily="monospace"
          >
            {clampedScore > 0 ? `+${clampedScore}` : clampedScore}
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
