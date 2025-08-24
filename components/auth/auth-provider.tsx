"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import { setupAxiosInterceptors, getUser } from "@/lib/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: unknown | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasTokens =
      !!Cookies.get("access_token") && !!Cookies.get("refresh_token");
    setIsAuthenticated(hasTokens);
    setUser(getUser());
    setupAxiosInterceptors();
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, loading }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
