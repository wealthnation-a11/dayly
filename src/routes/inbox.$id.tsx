import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Archive, ArrowLeft, Link2, MapPin, Sparkles, Star, Users } from "lucide-react";
import { toast } from "sonner";

import { AIReviewCard } from "@/components/dayly/ai-review-card";
import { AppShell } from "@/components/dayly/app-shell";
import { AiStatusBadge, ReviewStatusBadge, SourceKindIcon, StatusBadge } from "@/components/dayly/badges";
import { SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { SourceEvidenceList, SourcesTrigger } from "@/components/dayly/sources";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { aiKeys, aiService } from "@/services/ai";
import { inboxKeys, inboxService } from "@/services/inbox";
import type { ReviewStatus } from "@/services/types";

export const Route = createFileRoute("/inbox/$id")({
  head: () => ({
    meta: [
      { title: "Inbox item — Dayly" },
      {
        name: "description",
        content:
          "The original message, what Dayly understood from it, and the actions waiting for your approval.",
      },
      { property: "og:title", content: "Inbox item — Dayly" },
      {
        property: "og:description",
        content: "Review what Dayly found in this message before anything is created.",
      },
    ],
  }),
  component: InboxDetailScreen,
});

function InboxDetailScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const itemQ = useQuery({
    queryKey: inboxKeys.item(id),
    queryFn: () => inboxService.getInboxItem(id),
  });
  const clustersQ = useQuery({ queryKey: aiKeys.clusters, queryFn: aiService.getClusters });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["inbox"] });
    void queryClient.invalidateQueries({ queryKey: ["ai"] });
  };

  const decide = useMutation({
    mutationFn: ({ proposalId, decision }: { proposalId: string; decision: ReviewStatus }) =>
      aiService.processAIReview(proposalId, decision),
    onSuccess: ({ decision }) => {
      toast.success(
        decision === "approved"
          ? "Approved and added"
          : decision === "dismissed"
            ? "Dismissed — nothing was created"
            : "Saved your changes",
      );
      invalidate();
    },
  });

  const setImportant = useMutation({
    mutationFn: (important: boolean) => inboxService.setImportant(id, important),
    onSuccess: invalidate,
  });

  const archive = useMutation({
    mutationFn: () => inboxService.setArchived(id, true),
    onSuccess: () => {
      toast.success("Moved to archive");
      invalidate();
      void navigate({ to: "/inbox" });
    },
  });

  const item = itemQ.data;
  const related = (clustersQ.data ?? []).filter((c) =>
    c.sources.some((s) => s.id === id || s.memoryId === id),
  );

  return (
    <AppShell>
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/inbox">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Family Inbox
        </Link>
      </Button>

      {itemQ.isPending ? (
        <div className="mt-4">
          <LoadingCards count={3} />
        </div>
      ) : itemQ.isError ? (
        <div className="mt-4">
          <ErrorState onRetry={() => void itemQ.refetch()} />
        </div>
      ) : !item ? (
        <div className="mt-4">
          <EmptyState
            title="This item is no longer available"
            description="It may have been archived or removed from your household inbox."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/inbox">Back to inbox</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <PageHeader className="mt-3" title={item.title} description={item.summary} />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SourceKindIcon kind={item.sourceKind} className="size-8" />
            <span className="text-xs font-semibold text-muted-foreground">
              {item.sourceName} · {item.receivedLabel} · from {item.person}
            </span>
            <AiStatusBadge status={item.aiStatus} />
            <ReviewStatusBadge status={item.reviewStatus} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportant.mutate(!item.important)}
            >
              <Star
                className={cn("size-4", item.important && "fill-sun text-sun")}
                aria-hidden="true"
              />
              {item.important ? "Important" : "Mark important"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={archive.isPending}
              onClick={() => archive.mutate()}
            >
              <Archive className="size-4" aria-hidden="true" />
              Archive
            </Button>
          </div>

          <div className="mt-6 space-y-8">
            <Section
              title="Waiting for your approval"
              count={item.proposals.length}
              action={<SourcesTrigger sources={item.sources} />}
            >
              {item.proposals.length === 0 ? (
                <EmptyState
                  icon={<Sparkles className="size-6" aria-hidden="true" />}
                  title="No actions detected"
                  description="Dayly didn't find anything here that needs a calendar entry, task or reminder."
                />
              ) : (
                <div className="space-y-3">
                  {item.proposals.map((proposal) => (
                    <AIReviewCard
                      key={proposal.id}
                      proposal={proposal}
                      onDecision={(decision) =>
                        decide.mutateAsync({ proposalId: proposal.id, decision })
                      }
                    />
                  ))}
                </div>
              )}
            </Section>

            {item.importantInfo.length > 0 ||
            item.deadlines.length > 0 ||
            item.people.length > 0 ||
            item.locations.length > 0 ? (
              <Section title="What Dayly understood">
                <SurfaceCard>
                  {item.importantInfo.length > 0 ? (
                    <ul className="space-y-1.5 text-sm">
                      {item.importantInfo.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span aria-hidden="true" className="text-primary">
                            •
                          </span>
                          <span className="min-w-0 break-words">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.deadlines.length > 0 ? (
                    <dl className="mt-4 space-y-2">
                      {item.deadlines.map((d) => (
                        <div
                          key={d.label}
                          className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 text-sm"
                        >
                          <dt className="font-semibold text-muted-foreground">{d.label}</dt>
                          <dd className="font-medium break-words">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {item.people.length > 0 ? (
                    <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <Users className="size-4 text-muted-foreground" aria-hidden="true" />
                      {item.people.map((p) => (
                        <StatusBadge key={p} tone="neutral">
                          {p}
                        </StatusBadge>
                      ))}
                    </p>
                  ) : null}

                  {item.locations.length > 0 ? (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                      {item.locations.map((l) => (
                        <StatusBadge key={l} tone="neutral">
                          {l}
                        </StatusBadge>
                      ))}
                    </p>
                  ) : null}
                </SurfaceCard>
              </Section>
            ) : null}

            {related.length > 0 ? (
              <Section title="Connected information" count={related.length}>
                <div className="space-y-3">
                  {related.map((cluster) => (
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
                      <p className="mt-2 text-sm text-muted-foreground">{cluster.insight}</p>
                      <div className="mt-3">
                        <SourcesTrigger sources={cluster.sources} />
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              </Section>
            ) : null}

            <Section title="Original content">
              <SurfaceCard>
                <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
                  {item.content}
                </pre>
              </SurfaceCard>
            </Section>

            <Section title="Sources" count={item.sources.length}>
              <SourceEvidenceList sources={item.sources} />
            </Section>
          </div>
        </>
      )}
    </AppShell>
  );
}
