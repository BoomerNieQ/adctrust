"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import GateManager from "@/components/GateManager";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <LanguageProvider>
        <GateManager>
          {children}
        </GateManager>
      </LanguageProvider>
    </NextAuthSessionProvider>
  );
}
