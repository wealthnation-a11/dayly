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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { daylyService, queryKeys } from "@/lib/dayly/service";
import type { Visibility } from "@/lib/dayly/types";

export const Route = createFileRoute("/event")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({
    meta: [
      { title: "Event — Dayly" },
      {
        name: "description",
        content: "Create or edit a Dayly event with date, time, location, notes and a reminder.",
      },
      { property: "og:title", content: "Event — Dayly" },
      { property: "og:description", content: "Create or edit an event in Dayly." },
    ],
  }),
  component: EventForm,
});

function EventForm() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const eventsQ = useQuery({ queryKey: queryKeys.events, queryFn: daylyService.getEvents });
  const existing = eventsQ.data?.find((e) => e.id === id);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("household");
  const [touched, setTouched] = useState(false);

  const effectiveTitle = title || existing?.title || "";
  const invalid = touched && effectiveTitle.trim().length === 0;

  return (
    <AppShell>
      <PageHeader
        title={existing ? "Edit event" : "New event"}
        description="Events show on Today and can carry their own reminder."
      />

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (effectiveTitle.trim().length === 0) return;
          toast.success("Event saved");
          void navigate({ to: "/today" });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={effectiveTitle}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={invalid}
            placeholder="e.g. School excursion"
          />
          {invalid ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              A title is required.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
          <Label htmlFor="allday" className="font-semibold">
            All day
          </Label>
          <Switch id="allday" checked={allDay} onCheckedChange={setAllDay} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date || existing?.date || ""}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start">Starts</Label>
            <Input
              id="start"
              type="time"
              disabled={allDay}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">Ends</Label>
            <Input
              id="end"
              type="time"
              disabled={allDay}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location || existing?.location || ""}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. School main gate"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes || existing?.notes || ""}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder">Reminder</Label>
            <Input
              id="reminder"
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private — only me</SelectItem>
                <SelectItem value="household">Household — shared with adults</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save event</Button>
          <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/today" })}>
            Cancel
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
