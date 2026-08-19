import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, CheckCircle2, Plus, Sparkles } from "lucide-react";

import { AppShell } from "@/components/dayly/app-shell";
import { StatusBadge } from "@/components/dayly/badges";
import { EventCard, SurfaceCard, TaskCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { queryKeys, daylyService } from "@/lib/dayly/service";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — Dayly" },
      {
        name: "description",
        content:
          "Your day at a glance: today's events, open tasks, reminders and items waiting for your review.",
      },
      { property: "og:title", content: "Today — Dayly" },
      { property: "og:description", content: "Your day at a glance in Dayly." },
    ],
  }),
  component: TodayScreen,
});

function TodayScreen() {
  const tasksQ = useQuery({ queryKey: queryKeys.tasks, queryFn: daylyService.getTasks });
  const eventsQ = useQuery({ queryKey: queryKeys.events, queryFn: daylyService.getEvents });
  const proposalsQ = useQuery({
    queryKey: queryKeys.proposals,
    queryFn: daylyService.getProposals,
  });
  const membersQ = useQuery({ queryKey: queryKeys.members, queryFn: daylyService.getMembers });
  const notificationsQ = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: daylyService.getNotifications,
  });

  const unread = notificationsQ.data?.filter((n) => !n.read).length ?? 0;
  const todayEvents = eventsQ.data?.slice(0, 2) ?? [];
  const overdue = tasksQ.data?.filter((t) => t.status === "overdue") ?? [];
  const openTasks = tasksQ.data?.filter((t) => t.status === "open") ?? [];
  const nameFor = (id?: string) => membersQ.data?.find((m) => m.id === id)?.name;

  return (
    <AppShell unreadCount={unread}>
      <PageHeader
        title="Today"
        description="What needs your attention right now."
        action={
          <Button asChild size="sm">
            <Link to="/capture">
              <Plus className="size-4" aria-hidden="true" />
              Capture
            </Link>
          </Button>
        }
      />

      <div className="mt-6 space-y-8">
        {proposalsQ.data && proposalsQ.data.length > 0 ? (
          <SurfaceCard className="border-primary/30 bg-primary-soft">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-card text-primary">
                <Sparkles className="size-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-bold">Waiting for your review</h2>
                <p className="mt-0.5 text-sm text-accent-foreground">
                  Dayly found {proposalsQ.data.length} possible items from what you captured.
                  Nothing is added until you approve it.
                </p>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/review">Review items</Link>
                </Button>
              </div>
            </div>
          </SurfaceCard>
        ) : null}

        <Section title="Today's schedule" count={todayEvents.length}>
          {eventsQ.isPending ? (
            <LoadingCards count={2} />
          ) : eventsQ.isError ? (
            <ErrorState onRetry={() => void eventsQ.refetch()} />
          ) : todayEvents.length === 0 ? (
            <EmptyState
              icon={<CalendarPlus className="size-6" aria-hidden="true" />}
              title="Nothing scheduled today"
              description="Events you approve or add will show up here."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/event">Add event</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </Section>

        {overdue.length > 0 ? (
          <Section
            title="Overdue"
            count={overdue.length}
            action={<StatusBadge tone="danger">Needs action</StatusBadge>}
          >
            <div className="space-y-3">
              {overdue.map((task) => (
                <TaskCard key={task.id} task={task} assigneeName={nameFor(task.assigneeId)} />
              ))}
            </div>
          </Section>
        ) : null}

        <Section
          title="Open tasks"
          count={openTasks.length}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/task">Add task</Link>
            </Button>
          }
        >
          {tasksQ.isPending ? (
            <LoadingCards />
          ) : tasksQ.isError ? (
            <ErrorState onRetry={() => void tasksQ.refetch()} />
          ) : openTasks.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-6" aria-hidden="true" />}
              title="You're all caught up"
              description="Approved tasks appear here so nothing slips."
            />
          ) : (
            <div className="space-y-3">
              {openTasks.map((task) => (
                <TaskCard key={task.id} task={task} assigneeName={nameFor(task.assigneeId)} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
