"use client";

import { useState } from "react";
import DonateButton from "./DonateButton";
import DonationWallboard from "./DonationWallboard";

export default function DonateSection() {
  const [refresh, setRefresh] = useState(0);
  return (
    <>
      <div className="relative z-10 flex justify-center pb-6">
        <DonateButton onDonated={() => setRefresh(r => r + 1)} />
      </div>
      <DonationWallboard refresh={refresh} />
    </>
  );
}
