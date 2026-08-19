import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";

import { BottomNav, SideNav } from "./bottom-nav";
import { DaylyLogo } from "./brand";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
  unreadCount,
}: {
  children: ReactNode;
  className?: string;
  unreadCount?: number;
}) {
  return (
    <div className="flex min-h-svh bg-background">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/today" aria-label="Dayly home">
              <DaylyLogo size="sm" />
            </Link>
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
            >
              <Bell className="size-5" aria-hidden="true" />
              {unreadCount ? (
                <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          </div>
        </header>
        <main
          className={cn(
            "mx-auto w-full max-w-3xl flex-1 px-4 pt-5 pb-28 md:pb-10",
            className,
          )}
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
