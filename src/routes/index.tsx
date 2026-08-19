import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { DaylyLogo } from "@/components/dayly/brand";
import { useAuth } from "@/lib/dayly/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dayly — Capture life, stay organized" },
      {
        name: "description",
        content:
          "Dayly turns photos, documents, notes and voice into proposed tasks, events and reminders you approve — plus searchable household memory.",
      },
      { property: "og:title", content: "Dayly — Capture life, stay organized" },
      {
        property: "og:description",
        content:
          "Capture anything. Dayly proposes what matters, you stay in control, and everything becomes searchable memory.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { restore } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void restore().then((session) => {
      if (cancelled) return;
      void navigate({ to: session.signedIn ? "/today" : "/signin" });
    });
    return () => {
      cancelled = true;
    };
  }, [restore, navigate]);

  return (
    <div className="dayly-sunburst grid min-h-svh place-items-center px-6">
      <div className="flex flex-col items-center text-center">
        <DaylyLogo size="lg" />
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Capture life. Dayly proposes. You stay in control.
        </p>
        <div className="mt-8 flex items-end gap-1.5" aria-label="Loading Dayly" role="status">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="dayly-wave-bar h-8 w-1.5 rounded-full bg-primary/70"
              style={{ animationDelay: `${i * 110}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
