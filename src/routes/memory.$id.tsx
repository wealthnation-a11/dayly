import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText } from "lucide-react";

import { AppShell } from "@/components/dayly/app-shell";
import { VisibilityBadge } from "@/components/dayly/badges";
import { EventCard, SurfaceCard, TaskCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { EmptyState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/memory/$id")({
  head: () => ({
    meta: [
      { title: "Source detail — Dayly" },
      {
        name: "description",
        content:
          "See a captured source, what Dayly understood from it, and every task and event linked to it.",
      },
      { property: "og:title", content: "Source detail — Dayly" },
      { property: "og:description", content: "The source behind your Dayly actions." },
    ],
  }),
  component: MemoryDetail,
});

function MemoryDetail() {
  const { id } = Route.useParams();
  const itemQ = useQuery({
    queryKey: queryKeys.memoryItem(id),
    queryFn: () => daylyService.getMemoryItem(id),
  });
  const tasksQ = useQuery({ queryKey: queryKeys.tasks, queryFn: daylyService.getTasks });
  const eventsQ = useQuery({ queryKey: queryKeys.events, queryFn: daylyService.getEvents });

  if (itemQ.isPending) {
    return (
      <AppShell>
        <LoadingCards count={3} />
      </AppShell>
    );
  }

  const item = itemQ.data;
  if (!item) {
    return (
      <AppShell>
        <EmptyState
          title="Source not found"
          description="This item may have been deleted from your memory."
        />
      </AppShell>
    );
  }

  const linkedTasks = tasksQ.data?.filter((t) => item.linkedTaskIds.includes(t.id)) ?? [];
  const linkedEvents = eventsQ.data?.filter((e) => item.linkedEventIds.includes(e.id)) ?? [];

  return (
    <AppShell>
      <PageHeader title={item.title} description={`Captured ${item.capturedAt}`} />

      <div className="mt-6 space-y-8">
        <SurfaceCard>
          <div className="flex flex-wrap items-center gap-2">
            <VisibilityBadge visibility={item.visibility} />
            <span className="text-xs text-muted-foreground">
              {item.kind}
              {item.pages ? ` · ${item.pages} pages` : ""}
              {item.fileSize ? ` · ${item.fileSize}` : ""}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">{item.summary}</p>
          {item.notes ? (
            <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
              {item.notes}
            </p>
          ) : null}
          <Button variant="outline" className="mt-4" disabled>
            <FileText className="size-4" aria-hidden="true" />
            Open source
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            File viewing arrives with the storage backend.
          </p>
        </SurfaceCard>

        <Section title="Linked tasks" count={linkedTasks.length}>
          {linkedTasks.length > 0 ? (
            <div className="space-y-3">
              {linkedTasks.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          ) : (
            <EmptyState title="No tasks from this source yet" />
          )}
        </Section>

        <Section title="Linked events" count={linkedEvents.length}>
          {linkedEvents.length > 0 ? (
            <div className="space-y-3">
              {linkedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <EmptyState title="No events from this source yet" />
          )}
        </Section>

        {item.relatedTitles.length > 0 ? (
          <Section title="Related information">
            <SurfaceCard>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {item.relatedTitles.map((r) => (
                  <li key={r}>· {r}</li>
                ))}
              </ul>
            </SurfaceCard>
          </Section>
        ) : null}
      </div>
    </AppShell>
  );
}
