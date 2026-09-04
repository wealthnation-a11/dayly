import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Link2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { ChangeKindBadge, ReviewStatusBadge, StatusBadge } from "@/components/dayly/badges";
import { SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { SourcesTrigger } from "@/components/dayly/sources";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { aiKeys, aiService } from "@/services/ai";
import type { ReviewStatus } from "@/services/types";

export const Route = createFileRoute("/changes")({
  head: () => ({
    meta: [
      { title: "What changed — Dayly" },
      {
        name: "description",
        content:
          "Schedule changes, new information and possible conflicts Dayly spotted across your household's emails, documents and calendar.",
      },
      { property: "og:title", content: "What changed — Dayly" },
      {
        property: "og:description",
        content: "Everything that moved, was added or now conflicts — waiting for your decision.",
      },
    ],
  }),
  component: ChangesScreen,
});

function ChangesScreen() {
  const queryClient = useQueryClient();
  const changesQ = useQuery({ queryKey: aiKeys.changes, queryFn: aiService.getChanges });
  const clustersQ = useQuery({ queryKey: aiKeys.clusters, queryFn: aiService.getClusters });

  const resolve = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: ReviewStatus }) =>
      aiService.resolveChange(id, decision),
    onSuccess: (_d, vars) => {
      toast.success(vars.decision === "approved" ? "Change accepted" : "Change dismissed");
      void queryClient.invalidateQueries({ queryKey: ["ai"] });
    },
  });

  const changes = changesQ.data ?? [];
  const pending = changes.filter((c) => c.status === "needs_review");
  const handled = changes.filter((c) => c.status !== "needs_review");
  const clusters = clustersQ.data ?? [];

  return (
    <AppShell>
      <PageHeader
        title="What changed?"
        description="Dayly watches your sources for updates and tells you — it never changes your plans on its own."
      />

      <div className="mt-6 space-y-8">
        <Section title="Needs your decision" count={pending.length}>
          {changesQ.isPending ? (
            <LoadingCards count={3} />
          ) : changesQ.isError ? (
            <ErrorState onRetry={() => void changesQ.refetch()} />
          ) : pending.length === 0 ? (
            <EmptyState
              icon={<RefreshCw className="size-6" aria-hidden="true" />}
              title="Nothing has changed"
              description="When a date moves, a detail is updated or two sources disagree, it shows up here first."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/inbox">Open Family Inbox</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {pending.map((change) => (
                <SurfaceCard as="article" key={change.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                      {change.emoji} {change.category}
                    </p>
                    <ChangeKindBadge kind={change.kind} />
                  </div>
                  <h3 className="mt-1 text-base font-bold break-words">{change.title}</h3>

                  {change.previous || change.next ? (
                    <div className="mt-3 grid gap-2 rounded-xl bg-muted p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                      <p className="font-medium text-muted-foreground line-through break-words">
                        {change.previous}
                      </p>
                      <ArrowRight
                        className="hidden size-4 text-muted-foreground sm:block"
                        aria-hidden="true"
                      />
                      <p className="font-bold break-words">{change.next}</p>
                    </div>
                  ) : null}

                  {change.detail ? (
                    <p className="mt-3 text-sm text-muted-foreground break-words">{change.detail}</p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">{change.detectedLabel}</StatusBadge>
                    <SourcesTrigger sources={change.sources} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="flex-1 min-w-28"
                      disabled={resolve.isPending}
                      onClick={() => resolve.mutate({ id: change.id, decision: "approved" })}
                    >
                      <Check className="size-4" aria-hidden="true" />
                      Accept change
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 min-w-24"
                      disabled={resolve.isPending}
                      onClick={() => resolve.mutate({ id: change.id, decision: "dismissed" })}
                    >
                      <X className="size-4" aria-hidden="true" />
                      Dismiss
                    </Button>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </Section>

        {clusters.length > 0 ? (
          <Section title="Connected information" count={clusters.length}>
            <div className="space-y-3">
              {clusters.map((cluster) => (
                <SurfaceCard key={cluster.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-2 text-sm font-bold">
                      <Link2 className="size-4 text-primary" aria-hidden="true" />
                      {cluster.emoji} {cluster.topic}
                    </p>
                    {cluster.conflict ? (
                      <StatusBadge tone="warning">
                        {cluster.conflictLabel ?? "Possible conflict"}
                      </StatusBadge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground break-words">{cluster.insight}</p>
                  <div className="mt-3">
                    <SourcesTrigger sources={cluster.sources} />
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </Section>
        ) : null}

        {handled.length > 0 ? (
          <Section title="Already handled" count={handled.length}>
            <div className="space-y-3">
              {handled.map((change) => (
                <SurfaceCard key={change.id} className="opacity-90">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold break-words">{change.title}</p>
                    <ReviewStatusBadge status={change.status} />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {change.detectedLabel}
                  </p>
                </SurfaceCard>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </AppShell>
  );
}
