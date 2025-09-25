"use client";

import { usePresence } from "@/hooks/usePresence";
import { ReactNode } from "react";

interface PresenceProviderProps {
  children: ReactNode;
}

export default function PresenceProvider({ children }: PresenceProviderProps) {
  // Initialize presence tracking
  usePresence();

  return <>{children}</>;
}
