"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";

import { useCurrentUser } from "@bytebank/hooks/use-current-user";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
