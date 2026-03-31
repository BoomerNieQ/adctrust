"use client";

import { useRef, useState } from "react";

const SOUNDS = [
  `/media/${encodeURIComponent("VUILE VIEZE SJELE ROTGEK.m4a")}`,
  `/media/${encodeURIComponent("Mafkees.m4a")}`,
  `/media/${encodeURIComponent("jullie zuipen meer als mij man.m4a")}`,
];

export default function PinkFence({ className = "" }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = SOUNDS[index];
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setPlaying(true);
    audio.onended = () => setPlaying(false);
    setIndex((prev) => (prev + 1) % SOUNDS.length);
  };

  const pink = playing ? "#F472B6" : "#E85DB0";
  const pinkDark = playing ? "#DB2777" : "#C4489A";
  const postW = 18;
  const postH = 72;
  const gap = 10;
  const count = 12;
  const railY1 = 26;
  const railY2 = 50;
  const railH = 8;
  const totalW = count * (postW + gap) + gap;
  const totalH = postH + 10;

  return (
    <>
      <audio ref={audioRef} />
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Klik voor geluid"
        onClick={handleClick}
        style={{ cursor: "pointer", transition: "filter 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      >
        {/* Rails behind posts */}
        <rect x={0} y={railY1} width={totalW} height={railH} fill={pinkDark} rx="2" />
        <rect x={0} y={railY2} width={totalW} height={railH} fill={pinkDark} rx="2" />

        {/* Pickets */}
        {Array.from({ length: count }).map((_, i) => {
          const x = gap + i * (postW + gap);
          const bodyY = 6 + postW / 2;
          const bodyH = postH - bodyY;
          const cx = x + postW / 2;
          return (
            <g key={i}>
              <rect x={x} y={bodyY} width={postW} height={bodyH} fill={pink} />
              <ellipse cx={cx} cy={bodyY} rx={postW / 2} ry={postW / 2} fill={pink} />
              <rect x={x + 3} y={bodyY} width={4} height={bodyH - 4} fill="rgba(255,255,255,0.18)" rx="2" />
            </g>
          );
        })}

        {/* Rail fronts */}
        <rect x={0} y={railY1} width={totalW} height={4} fill={pink} rx="1" />
        <rect x={0} y={railY2} width={totalW} height={4} fill={pink} rx="1" />
      </svg>
    </>
  );
}
