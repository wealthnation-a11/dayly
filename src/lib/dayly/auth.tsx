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

const signedOut: Session = {
  signedIn: false,
  name: "",
  email: "",
};

interface AuthValue {
  session: Session;
  signIn: (email: string, name?: string) => void;
  /** Registration — swap the body for a real auth client later. */
  signUp: (details: SignUpDetails) => Promise<Session>;
  signOut: () => void;
  /** Session restoration used by the splash screen. */
  restore: () => Promise<Session>;
}

const AuthContext = createContext<AuthValue | null>(null);

function read(): Session {
  if (typeof window === "undefined") return signedOut;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : signedOut;
  } catch {
    return signedOut;
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
  const [session, setSession] = useState<Session>(signedOut);

  const signIn = useCallback((email: string, name?: string) => {
    const previous = read();
    const next: Session = {
      ...previous,
      signedIn: true,
      email,
      name: name ?? (previous.email === email ? previous.name : ""),
    };
    setSession(next);
    write(next);
  }, []);

  const signUp = useCallback(async (details: SignUpDetails) => {
    // Simulated network latency so the UI can show its pending state.
    await new Promise((res) => setTimeout(res, 900));
    const next: Session = {
      signedIn: true,
      name: details.fullName,
      email: details.email,
      householdName: details.householdName,
      timezone: details.timezone,
    };
    setSession(next);
    write(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    const next: Session = { ...read(), signedIn: false };
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
    () => ({ session, signIn, signUp, signOut, restore }),
    [session, signIn, signUp, signOut, restore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
