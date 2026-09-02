/**
 * Frontend data service.
 *
 * This is the single seam between the UI and the backend. Today every function
 * resolves from the local local data layer with a small artificial delay so
 * loading states are real. Replacing the bodies with Supabase / API calls later
 * requires no UI changes.
 */

import {
  events,
  storedFiles,
  memoryItems,
  householdMembers,
  notifications,
  proposals,
  reminders,
  searchAnswers,
  suggestedSearches,
  tasks,
  readProfile,
  type SearchAnswer,
} from "./data";
import type {
  DaylyEvent,
  DaylyNotification,
  HouseholdMember,
  MemoryItem,
  StoredFile,
  ProposedItem,
  Reminder,
  Task,
  UserProfile,
} from "./types";

const LATENCY = 380;

function resolve<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

export const daylyService = {
  getProfile: (): Promise<UserProfile> => resolve(readProfile()),
  getTasks: (): Promise<Task[]> => resolve(tasks),
  getEvents: (): Promise<DaylyEvent[]> => resolve(events),
  getReminders: (): Promise<Reminder[]> => resolve(reminders),
  getMemory: (): Promise<MemoryItem[]> => resolve(memoryItems),
  getMemoryItem: (id: string): Promise<MemoryItem | undefined> =>
    resolve(memoryItems.find((m) => m.id === id)),
  getProposals: (): Promise<ProposedItem[]> => resolve(proposals),
  getMembers: (): Promise<HouseholdMember[]> => resolve(householdMembers),
  getNotifications: (): Promise<DaylyNotification[]> => resolve(notifications),
  getFiles: (): Promise<StoredFile[]> => resolve(storedFiles),
  getSuggestedSearches: (): Promise<string[]> => resolve(suggestedSearches, 0),
  search: (query: string): Promise<SearchAnswer> => {
    const q = query.trim().toLowerCase();
    const hit = searchAnswers.find(
      (a) =>
        a.query.toLowerCase() === q ||
        q.split(" ").some((word) => word.length > 4 && a.query.toLowerCase().includes(word)),
    );
    return resolve(
      hit ?? { query, answer: null, related: [] },
      600,
    );
  },
};

export const queryKeys = {
  profile: ["profile"] as const,
  tasks: ["tasks"] as const,
  events: ["events"] as const,
  reminders: ["reminders"] as const,
  memory: ["memory"] as const,
  memoryItem: (id: string) => ["memory", id] as const,
  proposals: ["proposals"] as const,
  members: ["members"] as const,
  notifications: ["notifications"] as const,
  files: ["files"] as const,
  search: (q: string) => ["search", q] as const,
};
