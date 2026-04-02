"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import MoriaGate from "@/components/MoriaGate";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <LanguageProvider>
        <MoriaGate>
          {children}
        </MoriaGate>
      </LanguageProvider>
    </NextAuthSessionProvider>
  );
}
