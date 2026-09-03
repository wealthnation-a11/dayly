import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Archive, ChevronRight, Inbox, MessageCircleQuestion, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiStatusBadge, ReviewStatusBadge, SourceKindIcon } from "@/components/dayly/badges";
import { AppShell } from "@/components/dayly/app-shell";
import { SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { inboxKeys, inboxService, type InboxFilter, type InboxSort } from "@/services/inbox";

export const Route = createFileRoute("/inbox/")({
  head: () => ({
    meta: [
      { title: "Family Inbox — Dayly" },
      {
        name: "description",
        content:
          "Every email, document, photo and voice note your household forwards to Dayly, with the actions Dayly detected in each one.",
      },
      { property: "og:title", content: "Family Inbox — Dayly" },
      {
        property: "og:description",
        content: "One place for the emails, documents and notes your family needs to act on.",
      },
    ],
  }),
  component: InboxScreen,
});

const filters: { value: InboxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unreviewed", label: "Unreviewed" },
  { value: "needs_action", label: "Needs action" },
  { value: "changed", label: "Changed" },
  { value: "events", label: "Events" },
  { value: "tasks", label: "Tasks" },
  { value: "documents", label: "Documents" },
  { value: "emails", label: "Emails" },
  { value: "important", label: "Important" },
  { value: "archived", label: "Archived" },
];

function InboxScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [sort, setSort] = useState<InboxSort>("newest");

  const query = { search, filter, sort };
  const itemsQ = useQuery({
    queryKey: inboxKeys.list(query),
    queryFn: () => inboxService.getInboxItems(query),
  });
  const countsQ = useQuery({ queryKey: inboxKeys.counts, queryFn: inboxService.getInboxCounts });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["inbox"] });
  };

  const markAll = useMutation({
    mutationFn: () => inboxService.markAllReviewed(),
    onSuccess: (count) => {
      toast.success(
        count > 0 ? `${count} item${count === 1 ? "" : "s"} marked reviewed` : "Nothing left to review",
      );
      invalidate();
    },
  });

  const setImportant = useMutation({
    mutationFn: ({ id, important }: { id: string; important: boolean }) =>
      inboxService.setImportant(id, important),
    onSuccess: invalidate,
  });

  const setArchived = useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      inboxService.setArchived(id, archived),
    onSuccess: (_d, vars) => {
      toast.success(vars.archived ? "Moved to archive" : "Restored to inbox");
      invalidate();
    },
  });

  const items = itemsQ.data ?? [];
  const needsAttention = countsQ.data?.needsAttention ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="Family Inbox"
        description="Forwarded emails, documents, photos and voice notes — all in one place."
        action={
          <Button asChild size="sm" variant="outline">
            <Link to="/ask">
              <MessageCircleQuestion className="size-4" aria-hidden="true" />
              Ask Dayly
            </Link>
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        {needsAttention > 0 ? (
          <SurfaceCard className="border-primary/30 bg-primary-soft">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-card text-primary">
                <Sparkles className="size-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-bold">
                  {needsAttention} item{needsAttention === 1 ? "" : "s"} waiting for you
                </h2>
                <p className="mt-0.5 text-sm text-accent-foreground">
                  Dayly proposes — nothing is added to your calendar or tasks until you approve it.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={markAll.isPending}
                  onClick={() => markAll.mutate()}
                >
                  Mark all reviewed
                </Button>
              </div>
            </div>
          </SurfaceCard>
        ) : null}

        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inbox by subject, sender or person"
            aria-label="Search inbox"
          />
          <div className="flex items-center gap-2">
            <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    filter === f.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as InboxSort)}>
              <SelectTrigger className="w-32 shrink-0" aria-label="Sort inbox">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="actions">Most actions</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Section title={filter === "archived" ? "Archived" : "Inbox"} count={items.length}>
          {itemsQ.isPending ? (
            <LoadingCards count={4} />
          ) : itemsQ.isError ? (
            <ErrorState onRetry={() => void itemsQ.refetch()} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Inbox className="size-6" aria-hidden="true" />}
              title={search || filter !== "all" ? "Nothing matches this view" : "Your inbox is empty"}
              description={
                search || filter !== "all"
                  ? "Try a different filter or clear your search."
                  : "Forward an email or capture a document and it will appear here with the actions Dayly detected."
              }
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/capture">Capture something</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <SurfaceCard className="p-0">
                    <Link
                      to="/inbox/$id"
                      params={{ id: item.id }}
                      className="block rounded-2xl p-4 hover:bg-muted/50"
                    >
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <SourceKindIcon type={item.sourceKind} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{item.title}</p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-muted-foreground">
                            {item.sourceName} · {item.receivedLabel}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {item.preview}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <AiStatusBadge status={item.aiStatus} />
                            <ReviewStatusBadge status={item.reviewStatus} />
                            {item.detected.map((d) => (
                              <span
                                key={d.label}
                                className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                              >
                                {d.count ? `${d.count} ` : ""}
                                {d.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight
                          className="mt-1 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                    <div className="flex gap-1 border-t px-2 py-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setImportant.mutate({ id: item.id, important: !item.important })
                        }
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
                        onClick={() =>
                          setArchived.mutate({ id: item.id, archived: !item.archived })
                        }
                      >
                        <Archive className="size-4" aria-hidden="true" />
                        {item.archived ? "Restore" : "Archive"}
                      </Button>
                    </div>
                  </SurfaceCard>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
