/**
 * Dayly domain types.
 * Shared by the local data layer and every screen, so a real backend can be
 * swapped in later without touching UI components.
 */

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "open" | "done" | "overdue";
export type Visibility = "private" | "household";
export type CaptureKind = "photo" | "document" | "text" | "voice" | "email";
export type ItemType = "task" | "event" | "reminder";

export interface SourceEvidence {
  /** Human readable source label, e.g. "School_Notice.pdf" */
  sourceId: string;
  sourceTitle: string;
  sourceKind: CaptureKind;
  capturedAt: string;
  /** Verbatim quote from the source that supports the proposal. */
  quote: string;
  /** e.g. "Page 1" */
  locator?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueLabel?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  assignedById?: string;
  reminderAt?: string;
  visibility: Visibility;
  sourceId?: string;
}

export interface DaylyEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  notes?: string;
  reminderAt?: string;
  visibility: Visibility;
  sourceId?: string;
}

export interface Reminder {
  id: string;
  relatedItemId: string;
  relatedItemTitle: string;
  relatedItemType: ItemType;
  date: string;
  time: string;
  repeat: "none" | "daily" | "weekly" | "monthly";
  visibility: Visibility;
}

export interface MemoryItem {
  id: string;
  title: string;
  kind: CaptureKind;
  capturedAt: string;
  pages?: number;
  fileSize?: string;
  summary: string;
  notes?: string;
  visibility: Visibility;
  linkedTaskIds: string[];
  linkedEventIds: string[];
  relatedTitles: string[];
}

export type ProposalConfidence = "clear" | "uncertain";

export interface ProposedItem {
  id: string;
  type: ItemType;
  title: string;
  confidence: ProposalConfidence;
  /** Shown when confidence is "uncertain" */
  question?: string;
  interpretations?: string[];
  fields: { label: string; value: string }[];
  evidence: SourceEvidence;
  visibility: Visibility;
}

export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Adult";
  status: "active" | "pending";
  initials: string;
  isCurrentUser?: boolean;
}

export type NotificationCategory =
  | "reminder"
  | "review"
  | "assignment"
  | "update";

export interface DaylyNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timeLabel: string;
  read: boolean;
}

export interface StoredFile {
  id: string;
  name: string;
  kind: "pdf" | "image";
  meta: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  timezone: string;
  householdName?: string;
}
