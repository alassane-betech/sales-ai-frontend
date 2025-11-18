"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type AuthMode = "signin" | "signup" | "forgot-password" | "otp";

type AuthFormContextValue = {
  mode: AuthMode;
  invitationToken?: string;
  email: string;
  password: string;
  setMode: (mode: AuthMode) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
};

const AuthFormContext = createContext<AuthFormContextValue | undefined>(
  undefined
);

export function AuthFormProvider({
  children,
  initialMode = "signin",
  invitationToken = null,
}: {
  children: ReactNode;
  initialMode?: AuthMode;
  invitationToken?: string | null;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const reset = () => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
  };

  const value = useMemo(() => ({
    invitationToken: invitationToken || undefined,
    mode,
    email,
    password,
    setMode,
    setEmail,
    setPassword,
    reset,
  }), [invitationToken, mode, email, password, reset]);

  return (
    <AuthFormContext.Provider
      value={value}
    >
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthForm() {
  const context = useContext(AuthFormContext);
  if (context === undefined) {
    throw new Error("useAuthForm must be used within an AuthFormProvider");
  }
  return context;
}

