/**
 * Local data for the Dayly intelligence layer (Family Inbox, changes,
 * connected information, Ask Dayly).
 *
 * Collections start empty — the app ships with no seeded content. Once inbox
 * ingestion and AI extraction are connected, these are replaced by real
 * backend reads without any UI changes.
 */

import type {
  AskAnswer,
  CalendarEventDto,
  ChangeItem,
  InboxItemDetail,
  SourceCluster,
} from "../types";

export const inboxItems: InboxItemDetail[] = [];
export const changeItems: ChangeItem[] = [];
export const sourceClusters: SourceCluster[] = [];
export const calendarEvents: CalendarEventDto[] = [];

/** Example prompts offered in Ask Dayly; answers always come from real data. */
export const askSuggestions: string[] = [];

export const askAnswers: Omit<AskAnswer, "id">[] = [];
