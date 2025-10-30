"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import {
  setupAxiosInterceptors,
  getUser,
  logout as logoutAuth,
} from "@/lib/auth";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
} | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. D'abord configurer les intercepteurs axios
        setupAxiosInterceptors();

        // 2. Ensuite vérifier l'authentification
        const hasTokens =
          !!Cookies.get("access_token") && !!Cookies.get("refresh_token");

        if (hasTokens) {
          setUser(getUser());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur d'initialisation de l'authentification:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    logoutAuth(); // Supprime les cookies et redirige
    setUser(null); // Met à jour l'état local
  };

  const value = useMemo(
    () => ({ user, loading, logout }),
    [user, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
