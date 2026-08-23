import { Link } from "@tanstack/react-router";
import { ChevronRight, Layers } from "lucide-react";
import { useState } from "react";

import { sourceKindMeta } from "./badges";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SourceRef } from "@/services/types";

export function SourceEvidenceList({ sources }: { sources: SourceRef[] }) {
  if (sources.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        No sources are linked to this yet.
      </p>
    );
  }
  return (
    <ol className="space-y-3">
      {sources.map((source, index) => {
        const { Icon, label } = sourceKindMeta[source.type];
        return (
          <li key={source.id} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold break-words">
                  <span className="text-muted-foreground">{index + 1}. </span>
                  {source.name}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                  {label} · {source.date}
                </p>
                <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed italic">
                  “{source.excerpt}”
                </blockquote>
                <p className="mt-2 text-xs text-muted-foreground">{source.relation}</p>
                {source.memoryId ? (
                  <Link
                    to="/memory/$id"
                    params={{ id: source.memoryId }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Open in Memory
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * "Based on N sources" trigger + responsive drawer showing full evidence.
 * Used everywhere Dayly shows AI-generated information.
 */
export function SourcesTrigger({
  sources,
  label,
  className,
}: {
  sources: SourceRef[];
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const count = sources.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={count === 0}
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-accent-foreground disabled:opacity-60",
          className,
        )}
        aria-haspopup="dialog"
      >
        <Layers className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">
          {label ?? `Based on ${count} source${count === 1 ? "" : "s"}`}
        </span>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85svh] overflow-y-auto rounded-t-3xl sm:max-h-svh sm:rounded-none"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Source evidence</SheetTitle>
            <SheetDescription>
              Everything Dayly used to produce this, in the order it was found.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <SourceEvidenceList sources={sources} />
            <Button variant="outline" className="mt-4 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
