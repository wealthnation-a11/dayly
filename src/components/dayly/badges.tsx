import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Lock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Priority, TaskStatus, Visibility } from "@/lib/dayly/types";

const tones = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-accent-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-destructive-soft text-destructive",
  info: "bg-info-soft text-info",
  sun: "bg-sun-soft text-sun-foreground",
} as const;

export type BadgeTone = keyof typeof tones;

export function StatusBadge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  if (status === "overdue")
    return (
      <StatusBadge tone="danger" icon={<AlertTriangle className="size-3" aria-hidden="true" />}>
        Overdue
      </StatusBadge>
    );
  if (status === "done") return <StatusBadge tone="success">Done</StatusBadge>;
  return <StatusBadge tone="neutral">Open</StatusBadge>;
}

const priorityMeta: Record<Priority, { tone: BadgeTone; label: string; Icon: typeof ArrowUp }> = {
  high: { tone: "danger", label: "High", Icon: ArrowUp },
  medium: { tone: "warning", label: "Medium", Icon: ArrowRight },
  low: { tone: "info", label: "Low", Icon: ArrowDown },
};

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const { tone, label, Icon } = priorityMeta[priority];
  return (
    <StatusBadge tone={tone} icon={<Icon className="size-3" aria-hidden="true" />}>
      {label}
    </StatusBadge>
  );
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return visibility === "private" ? (
    <StatusBadge tone="neutral" icon={<Lock className="size-3" aria-hidden="true" />}>
      Private
    </StatusBadge>
  ) : (
    <StatusBadge tone="primary" icon={<Users className="size-3" aria-hidden="true" />}>
      Household
    </StatusBadge>
  );
}
