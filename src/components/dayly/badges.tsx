import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Brain,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Lock,
  Mail,
  Mic,
  PencilLine,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Priority, TaskStatus, Visibility } from "@/lib/dayly/types";
import type { AiStatus, ChangeKind, ReviewStatus, SourceKind } from "@/services/types";

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

/* ── Intelligence layer badges ─────────────────────────────────────────── */

const reviewMeta: Record<
  ReviewStatus,
  { tone: BadgeTone; label: string; Icon: typeof ArrowUp }
> = {
  needs_review: { tone: "warning", label: "Needs review", Icon: Sparkles },
  approved: { tone: "success", label: "Approved", Icon: Check },
  edited: { tone: "info", label: "Edited", Icon: PencilLine },
  dismissed: { tone: "neutral", label: "Dismissed", Icon: X },
};

export function ReviewStatusBadge({
  status,
  className,
}: {
  status: ReviewStatus;
  className?: string;
}) {
  const { tone, label, Icon } = reviewMeta[status];
  return (
    <StatusBadge tone={tone} className={className} icon={<Icon className="size-3" aria-hidden="true" />}>
      {label}
    </StatusBadge>
  );
}

const changeMeta: Record<ChangeKind, { tone: BadgeTone; label: string }> = {
  new: { tone: "info", label: "New" },
  changed: { tone: "warning", label: "Changed" },
  removed: { tone: "neutral", label: "Removed" },
  conflict: { tone: "danger", label: "Conflict" },
};

export function ChangeKindBadge({ kind }: { kind: ChangeKind }) {
  const { tone, label } = changeMeta[kind];
  return (
    <StatusBadge tone={tone} icon={kind === "conflict" ? <AlertTriangle className="size-3" aria-hidden="true" /> : undefined}>
      {label}
    </StatusBadge>
  );
}

const aiStatusMeta: Record<AiStatus, { tone: BadgeTone; label: string }> = {
  processing: { tone: "info", label: "Processing" },
  understood: { tone: "primary", label: "AI understood" },
  needs_action: { tone: "warning", label: "Needs action" },
  failed: { tone: "danger", label: "Couldn't read" },
};

export function AiStatusBadge({ status }: { status: AiStatus }) {
  const { tone, label } = aiStatusMeta[status];
  return (
    <StatusBadge tone={tone} icon={<Sparkles className="size-3" aria-hidden="true" />}>
      {label}
    </StatusBadge>
  );
}

export const sourceKindMeta: Record<
  SourceKind,
  { Icon: typeof Mail; label: string }
> = {
  email: { Icon: Mail, label: "Email" },
  pdf: { Icon: FileText, label: "PDF" },
  document: { Icon: FileText, label: "Document" },
  image: { Icon: ImageIcon, label: "Photo" },
  voice: { Icon: Mic, label: "Voice note" },
  capture: { Icon: Camera, label: "Capture" },
  calendar: { Icon: CalendarDays, label: "Calendar" },
  task: { Icon: ClipboardList, label: "Task" },
  memory: { Icon: Brain, label: "Dayly Memory" },
};

export function SourceKindIcon({
  kind,
  className,
}: {
  kind: SourceKind;
  className?: string;
}) {
  const { Icon, label } = sourceKindMeta[kind];
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground", className)}>
      <Icon className="size-4.5" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
