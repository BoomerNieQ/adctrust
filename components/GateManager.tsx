"use client";

import { useState, useEffect, ReactNode } from "react";
import GateSelector from "./GateSelector";
import MaraudersGate from "./MaraudersGate";
import MoriaGate from "./MoriaGate";
import DHLGate from "./DHLGate";

const CHOICE_KEY = "gate-choice";
const ACCESS_KEYS: Record<string, string> = {
  hp:   "marauders-map-access",
  lotr: "moria-gate-access",
  dhl:  "dhl-gate-access",
};

export default function GateManager({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [ready,  setReady]  = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(CHOICE_KEY);
    if (saved && sessionStorage.getItem(ACCESS_KEYS[saved]) === "1") {
      // Already passed through their chosen gate this session
      setChoice("passed");
    } else if (saved) {
      setChoice(saved);
    }
    setReady(true);
  }, []);

  function handleSelect(id: string) {
    sessionStorage.setItem(CHOICE_KEY, id);
    setChoice(id);
  }

  // Avoid flash before sessionStorage is read
  if (!ready) return null;

  if (choice === "passed") return <>{children}</>;
  if (!choice)             return <GateSelector onSelect={handleSelect} />;
  if (choice === "hp")     return <MaraudersGate>{children}</MaraudersGate>;
  if (choice === "lotr")   return <MoriaGate>{children}</MoriaGate>;
  if (choice === "dhl")    return <DHLGate>{children}</DHLGate>;

  return <>{children}</>;
}
