import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { DaylyLogo } from "@/components/dayly/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/dayly/auth";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Dayly" },
      {
        name: "description",
        content: "Sign in to Dayly to review proposed items and search your household memory.",
      },
      { property: "og:title", content: "Sign in — Dayly" },
      { property: "og:description", content: "Sign in to your Dayly household." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("joshua@example.com");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="dayly-sunburst grid min-h-svh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <DaylyLogo />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue organizing your day.
          </p>
        </div>

        <form
          className="mt-8 space-y-4 rounded-2xl border bg-card p-5 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) {
              setError("Enter a valid email and a password of at least 6 characters.");
              return;
            }
            setError(null);
            signIn(email);
            void navigate({ to: "/today" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New to Dayly?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Demo sign-in — no account is created.
          </p>
        </form>
      </div>
    </div>
  );
}
