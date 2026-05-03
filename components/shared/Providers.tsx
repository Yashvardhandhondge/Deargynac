"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider
      session={session ?? undefined}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}
