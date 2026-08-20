import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { PageHeader } from "@/components/dayly/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/reminder")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({
    meta: [
      { title: "Reminder — Dayly" },
      {
        name: "description",
        content: "Set when Dayly should remind you about a task or event, and whether it repeats.",
      },
      { property: "og:title", content: "Reminder — Dayly" },
      { property: "og:description", content: "Adjust reminder timing in Dayly." },
    ],
  }),
  component: ReminderForm,
});

function ReminderForm() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const remindersQ = useQuery({
    queryKey: queryKeys.reminders,
    queryFn: daylyService.getReminders,
  });
  const existing = remindersQ.data?.find((r) => r.id === id);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");

  return (
    <AppShell>
      <PageHeader
        title="Reminder"
        description="Choose when Dayly should nudge you. Reminders never change the item itself."
      />

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Reminder saved");
          void navigate({ to: "/today" });
        }}
      >
        <div className="rounded-2xl border bg-card p-4 shadow-card">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Related item
          </p>
          <p className="mt-1 font-semibold">
            {existing?.relatedItemTitle ?? "Submit permission slip"}
          </p>
          <p className="text-sm text-muted-foreground">{existing?.relatedItemType ?? "task"}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Reminder date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Reminder time</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="repeat">Repeat</Label>
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger id="repeat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save reminder</Button>
          <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/today" })}>
            Cancel
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
