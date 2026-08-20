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
import { Textarea } from "@/components/ui/textarea";
import { daylyService, queryKeys } from "@/lib/dayly/service";
import type { Priority, Visibility } from "@/lib/dayly/types";

export const Route = createFileRoute("/task")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({
    meta: [
      { title: "Task — Dayly" },
      {
        name: "description",
        content: "Create or edit a Dayly task with a due date, assignee, priority and reminder.",
      },
      { property: "og:title", content: "Task — Dayly" },
      { property: "og:description", content: "Create or edit a task in Dayly." },
    ],
  }),
  component: TaskForm,
});

function TaskForm() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const tasksQ = useQuery({ queryKey: queryKeys.tasks, queryFn: daylyService.getTasks });
  const membersQ = useQuery({ queryKey: queryKeys.members, queryFn: daylyService.getMembers });
  const existing = tasksQ.data?.find((t) => t.id === id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("u_owner");
  const [priority, setPriority] = useState<Priority>("medium");
  const [visibility, setVisibility] = useState<Visibility>("household");
  const [reminder, setReminder] = useState("");
  const [touched, setTouched] = useState(false);

  const effectiveTitle = title || existing?.title || "";
  const invalid = touched && effectiveTitle.trim().length === 0;

  return (
    <AppShell>
      <PageHeader
        title={existing ? "Edit task" : "New task"}
        description="Only you and the people you share with can see this."
      />

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (effectiveTitle.trim().length === 0) return;
          toast.success("Task saved");
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
            placeholder="e.g. Submit permission slip"
          />
          {invalid ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              A title is required.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={description || existing?.description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="due">Due date</Label>
            <Input
              id="due"
              type="date"
              value={dueDate || existing?.dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
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
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger id="assignee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {membersQ.data?.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                    {m.isCurrentUser ? " (You)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
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
          <Button type="submit">Save task</Button>
          <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/today" })}>
            Cancel
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
