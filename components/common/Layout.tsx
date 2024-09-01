"use client";
import { SessionProvider } from "next-auth/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
