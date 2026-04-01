"use client";

import { useLang } from "@/lib/i18n";

export default function PageHeaderText() {
  const { t } = useLang();
  return (
    <span className="text-white/40 font-boogaloo hidden sm:block text-sm">
      {t.headerSub}
    </span>
  );
}
