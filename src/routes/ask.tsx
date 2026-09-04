import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Loader2, MessageCircleQuestion, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/dayly/app-shell";
import { SurfaceCard } from "@/components/dayly/cards";
import { PageHeader } from "@/components/dayly/section";
import { SourcesTrigger } from "@/components/dayly/sources";
import { EmptyState } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/ai";
import type { AskAnswer } from "@/services/types";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask Dayly — Dayly" },
      {
        name: "description",
        content:
          "Ask a question in plain language and get an answer grounded in your household's own emails, documents and notes — with sources.",
      },
      { property: "og:title", content: "Ask Dayly — Dayly" },
      {
        property: "og:description",
        content: "Answers drawn only from your family's stored information, always with sources.",
      },
    ],
  }),
  component: AskScreen,
});

interface Turn {
  question: string;
  answer?: AskAnswer;
}

function AskScreen() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const suggestions = aiService.getAskSuggestions();

  const ask = useMutation({
    mutationFn: (q: string) => aiService.askDayly(q),
    onSuccess: (answer) => {
      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last) next[next.length - 1] = { ...last, answer };
        return next;
      });
    },
  });

  function submit(q: string) {
    const value = q.trim();
    if (!value || ask.isPending) return;
    setTurns((prev) => [...prev, { question: value }]);
    setQuestion("");
    ask.mutate(value);
  }

  return (
    <AppShell className="flex flex-col">
      <PageHeader
        title="Ask Dayly"
        description="Answers come only from what your household has captured — never invented."
      />

      <div className="mt-6 flex-1 space-y-4">
        {turns.length === 0 ? (
          <EmptyState
            icon={<MessageCircleQuestion className="size-6" aria-hidden="true" />}
            title="Ask about anything your family saved"
            description="School dates, appointments, permissions, documents — Dayly answers from your own information and shows where it found it."
            action={
              suggestions.length === 0 ? (
                <Button asChild variant="outline" size="sm">
                  <Link to="/capture">Capture something first</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          turns.map((turn, index) => (
            <div key={`${turn.question}-${index}`} className="space-y-3">
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                  {turn.question}
                </p>
              </div>

              {turn.answer ? (
                <SurfaceCard as="article" className="max-w-[95%]">
                  <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    Dayly
                  </p>
                  <p className="mt-2 text-sm leading-relaxed break-words">{turn.answer.answer}</p>
                  {turn.answer.bullets.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {turn.answer.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span aria-hidden="true" className="text-primary">
                            •
                          </span>
                          <span className="min-w-0 break-words">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SourcesTrigger sources={turn.answer.sources} />
                    {turn.answer.cta ? (
                      <Button asChild size="sm" variant="outline">
                        <Link to={turn.answer.cta.to}>{turn.answer.cta.label}</Link>
                      </Button>
                    ) : null}
                  </div>
                </SurfaceCard>
              ) : (
                <SurfaceCard className="max-w-[95%]">
                  <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Looking through your household information…
                  </p>
                </SurfaceCard>
              )}
            </div>
          ))
        )}

        {suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form
        className="sticky bottom-20 mt-6 flex items-center gap-2 rounded-2xl border bg-surface p-2 shadow-card md:bottom-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit(question);
        }}
      >
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about school, appointments, documents…"
          aria-label="Ask Dayly a question"
          className="border-0 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send question"
          disabled={!question.trim() || ask.isPending}
        >
          {ask.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUp className="size-4" aria-hidden="true" />
          )}
        </Button>
      </form>
    </AppShell>
  );
}
