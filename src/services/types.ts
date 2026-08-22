/**
 * Types for the Dayly intelligence layer (Family Inbox, AI Review,
 * cross-source intelligence, What Changed, Ask Dayly).
 *
 * These are transport-shaped DTOs: plain serialisable objects so the mock
 * services in this folder can be replaced by real API/Supabase calls without
 * touching any UI component.
 */

export type SourceKind =
  | "email"
  | "pdf"
  | "image"
  | "document"
  | "voice"
  | "capture"
  | "calendar"
  | "task"
  | "memory";

export type ReviewStatus = "needs_review" | "approved" | "edited" | "dismissed";

export type InboxCategory =
  | "events"
  | "tasks"
  | "documents"
  | "emails"
  | "important"
  | "changed";

export type AiStatus = "processing" | "understood" | "needs_action" | "failed";

export interface SourceRef {
  id: string;
  name: string;
  type: SourceKind;
  date: string;
  /** Relevant excerpt / preview from the source. */
  excerpt: string;
  /** How this source relates to the generated result. */
  relation: string;
  /** Optional link into Dayly Memory. */
  memoryId?: string;
}

export interface DetectedCount {
  label: string;
  count?: number;
}

export interface InboxItem {
  id: string;
  title: string;
  preview: string;
  sourceName: string;
  sourceKind: SourceKind;
  person: string;
  receivedAt: string;
  receivedLabel: string;
  aiStatus: AiStatus;
  /** Human summary lines, e.g. "1 event", "Schedule change detected". */
  detected: DetectedCount[];
  actionsDetected: number;
  reviewStatus: ReviewStatus;
  important: boolean;
  archived: boolean;
  categories: InboxCategory[];
}

export interface ProposedField {
  label: string;
  value: string;
}

/** One reviewable proposal rendered by the reusable AI Review card. */
export interface AiProposal {
  id: string;
  /** e.g. "FIELD TRIP PERMISSION" */
  kicker: string;
  title: string;
  fields: ProposedField[];
  suggestedReminder?: string;
  confidence: "clear" | "uncertain";
  question?: string;
  interpretations?: string[];
  status: ReviewStatus;
  sources: SourceRef[];
}

export interface InboxItemDetail extends InboxItem {
  /** Plain-text preview of the original content. */
  content: string;
  summary: string;
  importantInfo: string[];
  people: string[];
  locations: string[];
  deadlines: ProposedField[];
  proposals: AiProposal[];
  sources: SourceRef[];
}

export type ChangeKind = "new" | "changed" | "removed" | "conflict";

export interface ChangeItem {
  id: string;
  emoji: string;
  category: string;
  title: string;
  kind: ChangeKind;
  previous?: string;
  next?: string;
  detail?: string;
  detectedLabel: string;
  status: ReviewStatus;
  sources: SourceRef[];
}

export interface SourceCluster {
  id: string;
  topic: string;
  emoji: string;
  insight: string;
  conflict: boolean;
  conflictLabel?: string;
  sources: SourceRef[];
}

export interface AskAnswer {
  id: string;
  question: string;
  answer: string;
  bullets: string[];
  sources: SourceRef[];
  cta?: { label: string; to: string };
}

export interface CalendarEventDto {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  location?: string;
  changed?: boolean;
}
