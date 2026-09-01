/**
 * Mock session layer.
 * Deliberately tiny and self-contained: replace the internals with a real auth
 * client later without touching screen components.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "dayly.session";

interface Session {
  signedIn: boolean;
  name: string;
  email: string;
  householdName?: string;
  timezone?: string;
}

export interface SignUpDetails {
  fullName: string;
  email: string;
  password: string;
  householdName: string;
  timezone: string;
  phone?: string;
  acceptedTerms: boolean;
}

const demoSession: Session = {
  signedIn: true,
  name: "Joshua A.",
  email: "joshua@example.com",
};

interface AuthValue {
  session: Session;
  signIn: (email?: string, name?: string) => void;
  /** Mock registration — swap the body for a real auth client later. */
  signUp: (details: SignUpDetails) => Promise<Session>;
  signOut: () => void;
  /** Mock session restoration used by the splash screen. */
  restore: () => Promise<Session>;
}

const AuthContext = createContext<AuthValue | null>(null);

function read(): Session {
  if (typeof window === "undefined") return demoSession;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : demoSession;
  } catch {
    return demoSession;
  }
}

function write(session: Session) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(demoSession);

  const signIn = useCallback((email = demoSession.email, name = demoSession.name) => {
    const next = { signedIn: true, email, name };
    setSession(next);
    write(next);
  }, []);

  const signOut = useCallback(() => {
    const next = { ...demoSession, signedIn: false };
    setSession(next);
    write(next);
  }, []);

  const restore = useCallback(async () => {
    const stored = read();
    await new Promise((res) => setTimeout(res, 1400));
    setSession(stored);
    return stored;
  }, []);

  const value = useMemo(
    () => ({ session, signIn, signOut, restore }),
    [session, signIn, signOut, restore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
