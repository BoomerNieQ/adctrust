"use client";

import { useEffect, useRef, useState } from "react";
import { MEDIA } from "@/lib/memes";

const TUBULAR_CUT_SEC = 150; // 2m30s

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"tubular" | "bassie">("tubular");
  const hasStarted = useRef(false);

  // When phase changes to bassie, swap source and loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasStarted.current) return;
    if (phase === "bassie") {
      audio.src = MEDIA.bassieAdriaaan;
      audio.loop = true;
      audio.play().catch(() => {});
    }
  }, [phase]);

  // Monitor playback position to cut Tubular Bells at 2m30s
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (phase === "tubular" && audio.currentTime >= TUBULAR_CUT_SEC) {
        setPhase("bassie");
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [phase]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasStarted.current) {
      hasStarted.current = true;
      audio.src = MEDIA.tubularBells;
      audio.loop = false;
      audio.volume = 0.35;
      audio.play().catch(() => {});
      setPlaying(true);
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      <button
        onClick={toggle}
        title={playing ? "Muziek pauzeren" : "Muziek afspelen"}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{
          background: playing ? "#FFCC00" : "rgba(255,204,0,0.15)",
          border: "2px solid rgba(255,204,0,0.5)",
          color: playing ? "#1C1C1C" : "rgba(255,204,0,0.7)",
        }}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}
