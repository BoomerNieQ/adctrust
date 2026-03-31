"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface PackageProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
}

function FloatingPackage({ x, y, size, delay, opacity }: PackageProps) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%`, opacity, fontSize: size }}
      animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      📦
    </motion.div>
  );
}

export default function WindmillBackground() {
  const packages: PackageProps[] = useMemo(
    () => [
      { x: 4,  y: 12, size: 24, delay: 0,   opacity: 0.08 },
      { x: 91, y: 18, size: 18, delay: 1.2, opacity: 0.07 },
      { x: 8,  y: 72, size: 20, delay: 0.7, opacity: 0.09 },
      { x: 88, y: 65, size: 22, delay: 2,   opacity: 0.08 },
      { x: 48, y: 4,  size: 16, delay: 1.5, opacity: 0.06 },
      { x: 2,  y: 45, size: 14, delay: 0.3, opacity: 0.06 },
      { x: 93, y: 42, size: 18, delay: 1,   opacity: 0.07 },
      { x: 22, y: 88, size: 14, delay: 2.5, opacity: 0.05 },
      { x: 72, y: 85, size: 16, delay: 1.8, opacity: 0.06 },
    ],
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* DHL gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 50%, rgba(212, 5, 17, 0.06) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 50%, rgba(255, 204, 0, 0.06) 0%, transparent 55%),
            linear-gradient(to bottom, #1C1C1C, #141414)
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,204,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,204,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating packages */}
      {packages.map((p, i) => (
        <FloatingPackage key={i} {...p} />
      ))}

      {/* DHL accent bars (left/right) */}
      <div className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "linear-gradient(to bottom, #D40511, transparent, #D40511)", opacity: 0.3 }} />
      <div className="absolute right-0 top-0 bottom-0 w-1"
        style={{ background: "linear-gradient(to bottom, #FFCC00, transparent, #FFCC00)", opacity: 0.3 }} />
    </div>
  );
}
