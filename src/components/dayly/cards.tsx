import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Mail,
  Mic,
  Quote,
  Repeat,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { PriorityIndicator, StatusBadge, TaskStatusBadge, VisibilityBadge } from "./badges";
import { cn } from "@/lib/utils";
import type {
  DaylyEvent,
  DaylyNotification,
  HouseholdMember,
  MemoryItem,
  MockFile,
  Reminder,
  SourceEvidence,
  Task,
} from "@/lib/dayly/types";

export function SurfaceCard({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  as?: "div" | "li" | "article";
}) {
  return (
    <As className={cn("rounded-2xl border bg-card p-4 shadow-card", className)}>{children}</As>
  );
}

export function TaskCard({
  task,
  assigneeName,
  className,
}: {
  task: Task;
  assigneeName?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <SurfaceCard as="article" className={className}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
          <ClipboardList className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{task.title}</h3>
          {task.dueLabel ? (
            <p
              className={cn(
                "mt-0.5 text-sm",
                task.status === "overdue" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {task.dueLabel}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <TaskStatusBadge status={task.status} />
            <PriorityIndicator priority={task.priority} />
            <VisibilityBadge visibility={task.visibility} />
            {assigneeName ? (
              <StatusBadge tone="neutral" icon={<UserRound className="size-3" aria-hidden="true" />}>
                {assigneeName}
              </StatusBadge>
            ) : null}
          </div>
        </div>
        <Link
          to="/task"
          search={{ id: task.id }}
          aria-label={`Edit ${task.title}`}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
        >
          <ChevronRight className="size-4.5" aria-hidden="true" />
        </Link>
      </div>
    </SurfaceCard>
  );
}

export function EventCard({ event, className }: { event: DaylyEvent; className?: string }) {
  const time = event.allDay
    ? "All day"
    : [event.startTime, event.endTime].filter(Boolean).join(" – ");
  return (
    <SurfaceCard as="article" className={className}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-sun-soft text-sun-foreground">
          <CalendarDays className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{event.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {time}
            {event.location ? ` · ${event.location}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <VisibilityBadge visibility={event.visibility} />
            {event.reminderAt ? (
              <StatusBadge tone="info" icon={<Bell className="size-3" aria-hidden="true" />}>
                {event.reminderAt}
              </StatusBadge>
            ) : null}
          </div>
        </div>
        <Link
          to="/event"
          search={{ id: event.id }}
          aria-label={`Edit ${event.title}`}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
        >
          <ChevronRight className="size-4.5" aria-hidden="true" />
        </Link>
      </div>
    </SurfaceCard>
  );
}

export function ReminderCard({ reminder }: { reminder: Reminder }) {
  return (
    <SurfaceCard as="article">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-info-soft text-info">
          <Bell className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{reminder.relatedItemTitle}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {reminder.date} at {reminder.time}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge tone="neutral">{reminder.relatedItemType}</StatusBadge>
            {reminder.repeat !== "none" ? (
              <StatusBadge tone="info" icon={<Repeat className="size-3" aria-hidden="true" />}>
                {reminder.repeat}
              </StatusBadge>
            ) : null}
          </div>
        </div>
        <Link
          to="/reminder"
          search={{ id: reminder.id }}
          aria-label={`Edit reminder for ${reminder.relatedItemTitle}`}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
        >
          <ChevronRight className="size-4.5" aria-hidden="true" />
        </Link>
      </div>
    </SurfaceCard>
  );
}

export function EvidenceCard({
  evidence,
  className,
}: {
  evidence: SourceEvidence;
  className?: string | undefined;
}) {
  return (
    <figure className={cn("rounded-xl border bg-muted/60 p-3", className)}>
      <figcaption className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Quote className="size-3.5" aria-hidden="true" />
        Evidence from {evidence.sourceTitle}
        {evidence.locator ? ` · ${evidence.locator}` : ""}
      </figcaption>
      <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed italic">
        “{evidence.quote}”
      </blockquote>
      <Link
        to="/memory/$id"
        params={{ id: evidence.sourceId }}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        View source
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </Link>
    </figure>
  );
}

const kindIcon = {
  document: FileText,
  photo: ImageIcon,
  text: ClipboardList,
  voice: Mic,
  email: Mail,
} as const;

export function MemoryCard({ item }: { item: MemoryItem }) {
  const Icon = kindIcon[item.kind];
  return (
    <Link to="/memory/$id" params={{ id: item.id }} className="block">
      <SurfaceCard className="transition-shadow hover:shadow-raised">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{item.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {item.capturedAt}
              {item.pages ? ` · ${item.pages} page${item.pages > 1 ? "s" : ""}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <VisibilityBadge visibility={item.visibility} />
              {item.linkedTaskIds.length + item.linkedEventIds.length > 0 ? (
                <StatusBadge tone="primary">
                  {item.linkedTaskIds.length + item.linkedEventIds.length} linked action
                  {item.linkedTaskIds.length + item.linkedEventIds.length > 1 ? "s" : ""}
                </StatusBadge>
              ) : null}
            </div>
          </div>
          <ChevronRight className="mt-2 size-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </div>
      </SurfaceCard>
    </Link>
  );
}

export function FileCard({
  file,
  selected,
  onSelect,
}: {
  file: MockFile;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = file.kind === "pdf" ? FileText : ImageIcon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-colors",
        selected ? "border-primary bg-primary-soft" : "hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          file.kind === "pdf"
            ? "bg-destructive-soft text-destructive"
            : "bg-info-soft text-info",
        )}
      >
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold">{file.name}</span>
        <span className="block truncate text-sm text-muted-foreground">{file.meta}</span>
      </span>
      {selected ? (
        <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
      ) : (
        <span className="size-5 shrink-0 rounded-full border" aria-hidden="true" />
      )}
    </button>
  );
}

const notificationMeta = {
  reminder: { tone: "info", label: "Reminder", Icon: Bell },
  review: { tone: "sun", label: "Review request", Icon: ClipboardList },
  assignment: { tone: "primary", label: "Assignment", Icon: UserRound },
  update: { tone: "neutral", label: "Dayly update", Icon: CalendarDays },
} as const;

export function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: DaylyNotification;
  onMarkRead: () => void;
}) {
  const meta = notificationMeta[notification.category];
  return (
    <SurfaceCard as="article" className={cn(!notification.read && "border-primary/30")}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
          <meta.Icon className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{notification.title}</h3>
            {!notification.read ? <StatusBadge tone="primary">Unread</StatusBadge> : null}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
            <span className="text-xs text-muted-foreground">{notification.timeLabel}</span>
          </div>
        </div>
        {!notification.read ? (
          <button
            type="button"
            onClick={onMarkRead}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-muted"
          >
            Mark read
          </button>
        ) : null}
      </div>
    </SurfaceCard>
  );
}

export function MemberCard({
  member,
  action,
}: {
  member: HouseholdMember;
  action?: ReactNode | undefined;
}) {
  return (
    <SurfaceCard as="article">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-accent-foreground">
          {member.initials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">
            {member.name}
            {member.isCurrentUser ? " (You)" : ""}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{member.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge tone="neutral">{member.role}</StatusBadge>
            {member.status === "pending" ? (
              <StatusBadge tone="warning">Invitation pending</StatusBadge>
            ) : (
              <StatusBadge tone="success">Accepted</StatusBadge>
            )}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </SurfaceCard>
  );
}
