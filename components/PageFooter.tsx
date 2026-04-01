"use client";

import { useLang } from "@/lib/i18n";

export default function PageFooter() {
  const { t } = useLang();
  return (
    <p className="relative z-10 text-white/15 text-xs text-center font-boogaloo pb-10">
      {t.voteInterval}
    </p>
  );
}
