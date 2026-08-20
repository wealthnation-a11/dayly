import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, HelpCircle, Pencil, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { StatusBadge, VisibilityBadge } from "@/components/dayly/badges";
import { EvidenceCard, SurfaceCard } from "@/components/dayly/cards";
import { PageHeader } from "@/components/dayly/section";
import { EmptyState, ErrorState, LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { daylyService, queryKeys } from "@/lib/dayly/service";
import type { ProposedItem } from "@/lib/dayly/types";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review proposals — Dayly" },
      {
        name: "description",
        content:
          "Dayly proposes tasks, events and reminders from what you captured, each with its source evidence. You approve or dismiss.",
      },
      { property: "og:title", content: "Review proposals — Dayly" },
      {
        property: "og:description",
        content: "AI proposes, you confirm — every proposal shows its source.",
      },
    ],
  }),
  component: ReviewScreen,
});

function ReviewScreen() {
  const proposalsQ = useQuery({
    queryKey: queryKeys.proposals,
    queryFn: daylyService.getProposals,
  });
  const [handled, setHandled] = useState<Record<string, "confirmed" | "dismissed">>({});

  const pending = (proposalsQ.data ?? []).filter((p) => !handled[p.id]);

  return (
    <AppShell>
      <PageHeader
        title="Needs your review"
        description="Dayly never adds anything on its own. Check the evidence, then decide."
      />

      <SurfaceCard className="mt-5 border-primary/30 bg-primary-soft">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-accent-foreground">
            Dayly proposes. You confirm. Every proposal below is traceable to the exact words in
            your source.
          </p>
        </div>
      </SurfaceCard>

      <div className="mt-6 space-y-4">
        {proposalsQ.isPending ? (
          <LoadingCards count={2} />
        ) : proposalsQ.isError ? (
          <ErrorState onRetry={() => void proposalsQ.refetch()} />
        ) : pending.length === 0 ? (
          <EmptyState
            icon={<Check className="size-6" aria-hidden="true" />}
            title="Nothing left to review"
            description="Capture something new and Dayly will bring proposals back here."
          />
        ) : (
          pending.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onConfirm={() => {
                setHandled((h) => ({ ...h, [proposal.id]: "confirmed" }));
                toast.success(`${proposal.title} added`, {
                  description: "You can edit or remove it any time.",
                });
              }}
              onDismiss={() => {
                setHandled((h) => ({ ...h, [proposal.id]: "dismissed" }));
                toast("Proposal dismissed", { description: "Nothing was added to your day." });
              }}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}

function ProposalCard({
  proposal,
  onConfirm,
  onDismiss,
}: {
  proposal: ProposedItem;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const uncertain = proposal.confidence === "uncertain";

  return (
    <SurfaceCard as="article">
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge tone="primary">{proposal.type}</StatusBadge>
        <VisibilityBadge visibility={proposal.visibility} />
        {uncertain ? (
          <StatusBadge tone="warning" icon={<HelpCircle className="size-3" aria-hidden="true" />}>
            Needs a decision
          </StatusBadge>
        ) : (
          <StatusBadge tone="success">Clear</StatusBadge>
        )}
      </div>

      <h2 className="mt-3 text-lg font-bold leading-snug">{proposal.title}</h2>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {proposal.fields.map((field) => (
          <div key={field.label} className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {field.label}
            </dt>
            <dd className="text-sm font-medium">{field.value}</dd>
          </div>
        ))}
      </dl>

      {uncertain && proposal.question ? (
        <div className="mt-3 rounded-xl border border-warning/40 bg-warning-soft p-3">
          <p className="text-sm font-semibold text-warning">{proposal.question}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {proposal.interpretations?.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={choice === option ? "default" : "outline"}
                onClick={() => setChoice(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <EvidenceCard evidence={proposal.evidence} className="mt-3" />

      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <Button onClick={onConfirm} disabled={uncertain && !choice}>
          <Check className="size-4" aria-hidden="true" />
          Confirm
        </Button>
        <Button variant="outline" onClick={onConfirm}>
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          <X className="size-4" aria-hidden="true" />
          Dismiss
        </Button>
      </div>
      {uncertain && !choice ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Pick an interpretation above before confirming.
        </p>
      ) : null}
    </SurfaceCard>
  );
}
