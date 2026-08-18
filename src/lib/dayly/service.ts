/**
 * Frontend data service.
 *
 * This is the single seam between the UI and the backend. Today every function
 * resolves from the local mock data layer with a small artificial delay so
 * loading states are real. Replacing the bodies with Supabase / API calls later
 * requires no UI changes.
 */

import {
  mockEvents,
  mockFiles,
  mockMemory,
  mockMembers,
  mockNotifications,
  mockProposals,
  mockReminders,
  mockSearchAnswers,
  mockSuggestedSearches,
  mockTasks,
  mockUser,
  type SearchAnswer,
} from "./mock-data";
import type {
  DaylyEvent,
  DaylyNotification,
  HouseholdMember,
  MemoryItem,
  MockFile,
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
  getProfile: (): Promise<UserProfile> => resolve(mockUser),
  getTasks: (): Promise<Task[]> => resolve(mockTasks),
  getEvents: (): Promise<DaylyEvent[]> => resolve(mockEvents),
  getReminders: (): Promise<Reminder[]> => resolve(mockReminders),
  getMemory: (): Promise<MemoryItem[]> => resolve(mockMemory),
  getMemoryItem: (id: string): Promise<MemoryItem | undefined> =>
    resolve(mockMemory.find((m) => m.id === id)),
  getProposals: (): Promise<ProposedItem[]> => resolve(mockProposals),
  getMembers: (): Promise<HouseholdMember[]> => resolve(mockMembers),
  getNotifications: (): Promise<DaylyNotification[]> => resolve(mockNotifications),
  getFiles: (): Promise<MockFile[]> => resolve(mockFiles),
  getSuggestedSearches: (): Promise<string[]> => resolve(mockSuggestedSearches, 0),
  search: (query: string): Promise<SearchAnswer> => {
    const q = query.trim().toLowerCase();
    const hit = mockSearchAnswers.find(
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
