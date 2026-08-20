import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/dayly/app-shell";
import { EvidenceCard, MemoryCard, SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/memory/")({
  head: () => ({
    meta: [
      { title: "Memory — Dayly" },
      {
        name: "description",
        content:
          "Search everything you have given Dayly and get answers backed by the original source.",
      },
      { property: "og:title", content: "Memory — Dayly" },
      { property: "og:description", content: "Ask Dayly and see the source behind every answer." },
    ],
  }),
  component: MemoryScreen,
});

function MemoryScreen() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const memoryQ = useQuery({ queryKey: queryKeys.memory, queryFn: daylyService.getMemory });
  const suggestionsQ = useQuery({
    queryKey: ["suggested-searches"],
    queryFn: daylyService.getSuggestedSearches,
  });
  const searchQ = useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => daylyService.search(query),
    enabled: query.length > 0,
  });

  return (
    <AppShell>
      <PageHeader
        title="Memory"
        description="Everything you captured, searchable — with the source always one tap away."
      />

      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(draft.trim());
        }}
      >
        <Label htmlFor="q" className="sr-only">
          Search your memory
        </Label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Input
            id="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything, e.g. When is the next school event?"
          />
          <Button type="submit" aria-label="Search">
            <Search className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestionsQ.data?.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setDraft(s);
                setQuery(s);
              }}
            >
              {s}
            </Button>
          ))}
        </div>
      </form>

      {query ? (
        <Section title="Answer" className="mt-8">
          {searchQ.isPending ? (
            <LoadingCards count={1} />
          ) : searchQ.isError ? (
            <ErrorState onRetry={() => void searchQ.refetch()} />
          ) : searchQ.data?.answer ? (
            <SurfaceCard>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-semibold leading-relaxed">{searchQ.data.answer}</p>
                  {searchQ.data.evidence ? (
                    <EvidenceCard
                      className="mt-3"
                      evidence={{
                        sourceId: searchQ.data.evidence.sourceId,
                        sourceTitle: searchQ.data.evidence.sourceTitle,
                        sourceKind: "document",
                        capturedAt: searchQ.data.evidence.locator,
                        quote: searchQ.data.evidence.quote,
                        locator: searchQ.data.evidence.locator,
                      }}
                    />
                  ) : null}
                  {searchQ.data.related.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {searchQ.data.related.map((r) => (
                        <li key={r}>· {r}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </SurfaceCard>
          ) : (
            <EmptyState
              title="Couldn't find a reliable answer"
              description="Dayly won't guess. Try different wording, or capture the document that holds this detail."
            />
          )}
        </Section>
      ) : null}

      <Section title="Everything captured" count={memoryQ.data?.length} className="mt-8">
        {memoryQ.isPending ? (
          <LoadingCards />
        ) : memoryQ.isError ? (
          <ErrorState onRetry={() => void memoryQ.refetch()} />
        ) : memoryQ.data && memoryQ.data.length > 0 ? (
          <div className="space-y-3">
            {memoryQ.data.map((item) => (
              <MemoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your memory is empty"
            description="Capture a notice, letter or note and it becomes searchable here."
          />
        )}
      </Section>
    </AppShell>
  );
}
