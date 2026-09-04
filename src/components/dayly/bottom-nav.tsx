import { Link } from "@tanstack/react-router";
import { Camera, CalendarCheck, Inbox, Search, Settings, Users } from "lucide-react";

const items = [
  { to: "/today", label: "Today", Icon: CalendarCheck },
  { to: "/inbox", label: "Inbox", Icon: Inbox },
  { to: "/capture", label: "Capture", Icon: Camera },
  { to: "/memory", label: "Memory", Icon: Search },
  { to: "/household", label: "Household", Icon: Users },
  { to: "/settings", label: "Settings", Icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface/95 backdrop-blur md:hidden"
      style={{ boxShadow: "var(--shadow-nav)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold text-muted-foreground transition-colors data-[status=active]:text-primary"
              activeProps={{ "aria-current": "page" }}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SideNav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-1 border-r bg-surface px-4 py-6 md:flex"
    >
      <ul className="mt-2 space-y-1">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted data-[status=active]:bg-primary-soft data-[status=active]:text-accent-foreground"
              activeProps={{ "aria-current": "page" }}
            >
              <Icon className="size-4.5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
