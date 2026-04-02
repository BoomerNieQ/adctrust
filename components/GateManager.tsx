"use client";

import { useState, useEffect, ReactNode } from "react";
import GateSelector from "./GateSelector";
import MaraudersGate from "./MaraudersGate";
import MoriaGate from "./MoriaGate";
import DHLGate from "./DHLGate";

const LS_KEY = "gate-state";

type GateState = { choice: string; done: boolean; date: string };

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): GateState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as GateState;
    if (state.date !== today()) return null; // new day → reset
    return state;
  } catch {
    return null;
  }
}

function saveState(choice: string, done: boolean) {
  localStorage.setItem(LS_KEY, JSON.stringify({ choice, done, date: today() }));
}

export default function GateManager({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [done,   setDone]   = useState(false);
  const [ready,  setReady]  = useState(false);

  useEffect(() => {
    const state = loadState();
    if (state) {
      setChoice(state.choice);
      setDone(state.done);
    }
    setReady(true);
  }, []);

  function handleSelect(id: string) {
    saveState(id, false);
    setChoice(id);
    setDone(false);
  }

  function handleComplete() {
    if (choice) saveState(choice, true);
    setDone(true);
  }

  if (!ready) return null;

  if (done)    return <>{children}</>;
  if (!choice) return <GateSelector onSelect={handleSelect} />;

  if (choice === "hp")   return <MaraudersGate onComplete={handleComplete}>{children}</MaraudersGate>;
  if (choice === "lotr") return <MoriaGate     onComplete={handleComplete}>{children}</MoriaGate>;
  if (choice === "dhl")  return <DHLGate       onComplete={handleComplete}>{children}</DHLGate>;

  return <>{children}</>;
}
