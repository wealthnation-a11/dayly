import { Bell, Check, Loader2, PencilLine, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { ReviewStatusBadge } from "./badges";
import { SurfaceCard } from "./cards";
import { SourcesTrigger } from "./sources";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiProposal, ReviewStatus } from "@/services/types";

/**
 * The reusable AI → Review → Action card.
 *
 * Dayly never acts on its own: this card always ends in an explicit human
 * decision (Approve / Edit / Dismiss) and always shows its sources.
 */
export function AIReviewCard({
  proposal,
  onDecision,
  onEdit,
  heading = "Dayly found something important",
  className,
}: {
  proposal: AiProposal;
  onDecision: (decision: ReviewStatus) => Promise<void> | void;
  onEdit?: () => void;
  heading?: string;
  className?: string;
}) {
  const [pending, setPending] = useState<ReviewStatus | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const decided = proposal.status !== "needs_review";
  const needsChoice = proposal.confidence === "uncertain" && !choice && !decided;

  async function decide(decision: ReviewStatus) {
    setPending(decision);
    try {
      await onDecision(decision);
    } finally {
      setPending(null);
    }
  }

  return (
    <SurfaceCard as="article" className={cn(decided && "opacity-90", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {heading}
        </p>
        <ReviewStatusBadge status={proposal.status} />
      </div>

      <p className="mt-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {proposal.kicker}
      </p>
      <h3 className="mt-0.5 text-base font-bold break-words">{proposal.title}</h3>

      <dl className="mt-3 space-y-2">
        {proposal.fields.map((field) => (
          <div key={field.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 text-sm">
            <dt className="font-semibold text-muted-foreground">{field.label}</dt>
            <dd className="font-medium break-words">{field.value}</dd>
          </div>
        ))}
        {proposal.suggestedReminder ? (
          <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 text-sm">
            <dt className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
              <Bell className="size-3.5" aria-hidden="true" />
              Reminder
            </dt>
            <dd className="font-medium break-words">{proposal.suggestedReminder}</dd>
          </div>
        ) : null}
      </dl>

      {proposal.confidence === "uncertain" && !decided ? (
        <div className="mt-3 rounded-xl border border-warning/40 bg-warning-soft p-3">
          <p className="text-sm font-semibold text-warning">
            {proposal.question ?? "Dayly isn't fully sure about this one."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(proposal.interpretations ?? []).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={choice === option}
                onClick={() => setChoice(option)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  choice === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        <SourcesTrigger sources={proposal.sources} />
      </div>

      {decided ? (
        <p className="mt-3 text-xs font-semibold text-muted-foreground">
          You already handled this. Nothing was created without your approval.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1 min-w-28"
            disabled={pending !== null || needsChoice}
            onClick={() => void decide("approved")}
          >
            {pending === "approved" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 min-w-24"
            disabled={pending !== null}
            onClick={() => (onEdit ? onEdit() : void decide("edited"))}
          >
            <PencilLine className="size-4" aria-hidden="true" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 min-w-24"
            disabled={pending !== null}
            onClick={() => void decide("dismissed")}
          >
            {pending === "dismissed" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <X className="size-4" aria-hidden="true" />
            )}
            Dismiss
          </Button>
        </div>
      )}
      {needsChoice ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Pick an interpretation above to enable approval.
        </p>
      ) : null}
    </SurfaceCard>
  );
}
