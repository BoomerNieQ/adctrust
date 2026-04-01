"use client";

import { useMemo } from "react";
import { useLang } from "@/lib/i18n";

export default function TitleSection() {
  const { t } = useLang();
  const tagline = useMemo(() => {
    const arr = t.taglines as string[];
    return arr[Math.floor(Math.random() * arr.length)];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative z-10 text-center px-4 py-4 pb-6">
      <h1 className="text-5xl sm:text-6xl font-boogaloo text-white leading-tight">
        {t.titleMain}{" "}
        <span
          className="font-fredoka"
          style={{
            background: "linear-gradient(135deg, #FFCC00, #D40511)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Dominique
        </span>
      </h1>
      <p className="text-white/35 font-boogaloo mt-1 text-sm">
        {t.subtitle}
      </p>
      <p
        className="mt-3 font-boogaloo text-base px-5 py-2 rounded-full inline-block"
        style={{
          color: "rgba(255,204,0,0.75)",
          background: "rgba(255,204,0,0.07)",
          border: "1px solid rgba(255,204,0,0.18)",
        }}
      >
        &ldquo;{tagline}&rdquo;
      </p>
    </div>
  );
}
