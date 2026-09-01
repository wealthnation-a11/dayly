import { Link } from "@tanstack/react-router";
import { Bell, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { MobileNav, SideNav } from "./bottom-nav";
import { DaylyLogo } from "./brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
  unreadCount,
}: {
  children: ReactNode;
  className?: string | undefined;
  unreadCount?: number | undefined;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      <SideNav />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11 md:hidden"
              aria-label="Open main navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <Link to="/today" aria-label="Dayly home" className="min-w-0 justify-self-start">
              <DaylyLogo size="sm" />
            </Link>
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative grid min-h-11 min-w-11 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
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
            "mx-auto w-full max-w-3xl flex-1 px-4 pt-5 pb-10",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
