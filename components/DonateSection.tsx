"use client";

import { useState } from "react";
import DonateButton from "./DonateButton";
import DonationWallboard from "./DonationWallboard";

// Floating button (fixed left) — manages refresh state shared with wallboard via window event
export function FloatingDonateButton() {
  function handleDonated() {
    window.dispatchEvent(new CustomEvent("donation-made"));
  }
  return (
    <div className="fixed left-3 z-40" style={{ top: "55vh" }}>
      <DonateButton onDonated={handleDonated} />
    </div>
  );
}

// Inline wallboard — listens for donation events
export function InlineDonationWallboard() {
  const [refresh, setRefresh] = useState(0);
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
  }
  return <DonationWallboard refresh={refresh} onRefreshNeeded={() => setRefresh(r => r + 1)} />;
}

// Legacy default export (kept for compatibility)
export default function DonateSection() {
  const [refresh, setRefresh] = useState(0);
  return (
    <>
      <div className="fixed left-3 z-40" style={{ top: "55vh" }}>
        <DonateButton onDonated={() => setRefresh(r => r + 1)} />
      </div>
      <DonationWallboard refresh={refresh} />
    </>
  );
}
