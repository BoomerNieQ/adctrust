"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import MaraudersGate from "@/components/MaraudersGate";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <LanguageProvider>
        <MaraudersGate>
          {children}
        </MaraudersGate>
      </LanguageProvider>
    </NextAuthSessionProvider>
  );
}
