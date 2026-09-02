/**
 * Local data layer for the Dayly frontend.
 *
 * Every screen reads through `src/lib/dayly/service.ts`, so connecting a real
 * API/database later means changing only the service module. Collections start
 * empty: the app ships with no seeded content, so each screen renders its real
 * empty state until the account has data.
 */

import type {
  DaylyEvent,
  DaylyNotification,
  HouseholdMember,
  MemoryItem,
  ProposedItem,
  Reminder,
  StoredFile,
  Task,
  UserProfile,
} from "./types";

/** Selectable timezones — product configuration, not content. */
export const timezones = [
  "(UTC+01:00) West Africa Time",
  "(UTC+00:00) Greenwich Mean Time",
  "(UTC+02:00) Central European Time",
  "(UTC-05:00) Eastern Time",
  "(UTC-08:00) Pacific Time",
];

export const householdMembers: HouseholdMember[] = [];
export const tasks: Task[] = [];
export const events: DaylyEvent[] = [];
export const reminders: Reminder[] = [];
export const memoryItems: MemoryItem[] = [];
export const storedFiles: StoredFile[] = [];
export const proposals: ProposedItem[] = [];
export const notifications: DaylyNotification[] = [];

/** Search prompts shown as starting points; not answers. */
export const suggestedSearches: string[] = [];

export interface SearchAnswer {
  query: string;
  answer: string | null;
  evidence?: { sourceId: string; sourceTitle: string; quote: string; locator: string };
  related: string[];
}

export const searchAnswers: SearchAnswer[] = [];

const emptyProfile: UserProfile = {
  id: "",
  name: "",
  email: "",
  initials: "",
  timezone: timezones[0] ?? "",
};

/**
 * The signed-in account. Sourced from the session the auth layer persists, so
 * profile screens show the real account instead of placeholder details.
 */
export function readProfile(): UserProfile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = window.localStorage.getItem("dayly.session");
    if (!raw) return emptyProfile;
    const s = JSON.parse(raw) as {
      name?: string;
      email?: string;
      householdName?: string;
      timezone?: string;
    };
    const name = s.name ?? "";
    return {
      id: s.email ?? "",
      name,
      email: s.email ?? "",
      initials:
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("") || "",
      timezone: s.timezone ?? emptyProfile.timezone,
      ...(s.householdName ? { householdName: s.householdName } : {}),
    };
  } catch {
    return emptyProfile;
  }
}
