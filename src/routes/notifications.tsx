import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellOff } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/dayly/app-shell";
import { NotificationCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Dayly" },
      {
        name: "description",
        content:
          "Reminders, review requests, assignments and Dayly updates, with read and unread states.",
      },
      { property: "og:title", content: "Notifications — Dayly" },
      { property: "og:description", content: "Everything Dayly wanted to tell you." },
    ],
  }),
  component: NotificationsScreen,
});

function NotificationsScreen() {
  const notificationsQ = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: daylyService.getNotifications,
  });
  const [read, setRead] = useState<Record<string, boolean>>({});

  const items = (notificationsQ.data ?? []).map((n) => ({
    ...n,
    read: n.read || Boolean(read[n.id]),
  }));
  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell unreadCount={unread}>
      <PageHeader
        title="Notifications"
        description="Titles stay light on detail — open an item to see the full context."
        action={
          unread > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setRead(Object.fromEntries(items.map((n) => [n.id, true])) as Record<string, boolean>)
              }
            >
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Section title="Recent" count={items.length} className="mt-6">
        {notificationsQ.isPending ? (
          <LoadingCards />
        ) : notificationsQ.isError ? (
          <ErrorState onRetry={() => void notificationsQ.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BellOff className="size-6" aria-hidden="true" />}
            title="No notifications"
            description="Reminders and review requests will appear here."
          />
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={() => setRead((r) => ({ ...r, [n.id]: true }))}
              />
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
