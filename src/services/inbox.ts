/**
 * Family Inbox service (mock).
 *
 * No network calls happen here: incoming email/document ingestion is not
 * connected yet. Swap the bodies for real API/Supabase calls later — the
 * signatures are the contract the UI depends on.
 */

import { inboxItems } from "./data/initial-data";
import { patchState, readState } from "./store";
import type { InboxCategory, InboxItem, InboxItemDetail, ReviewStatus } from "./types";

const LATENCY = 320;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function hydrate(item: InboxItemDetail): InboxItemDetail {
  const state = readState();
  const reviewStatus = state.inboxReview[item.id] ?? item.reviewStatus;
  const archived = state.inboxArchived[item.id] ?? item.archived;
  const important = state.inboxImportant[item.id] ?? item.important;
  const categories = new Set<InboxCategory>(item.categories);
  if (important) categories.add("important");
  else categories.delete("important");
  return {
    ...item,
    reviewStatus,
    archived,
    important,
    categories: [...categories],
    proposals: item.proposals.map((p) => ({
      ...p,
      status: state.proposalReview[p.id] ?? (reviewStatus === "needs_review" ? p.status : reviewStatus),
    })),
  };
}

function toListItem(item: InboxItemDetail): InboxItem {
  const { content: _c, proposals: _p, sources: _s, ...rest } = item;
  return rest;
}

export type InboxFilter =
  | "all"
  | "unreviewed"
  | "needs_action"
  | "events"
  | "tasks"
  | "documents"
  | "emails"
  | "important"
  | "changed"
  | "archived";

export type InboxSort = "newest" | "oldest" | "actions" | "source";

export interface InboxQuery {
  search?: string;
  filter?: InboxFilter;
  sort?: InboxSort;
}

export function matchesFilter(item: InboxItem, filter: InboxFilter): boolean {
  if (filter === "archived") return item.archived;
  if (item.archived) return false;
  switch (filter) {
    case "all":
      return true;
    case "unreviewed":
      return item.reviewStatus === "needs_review";
    case "needs_action":
      return item.aiStatus === "needs_action" && item.reviewStatus === "needs_review";
    case "important":
      return item.important;
    default:
      return item.categories.includes(filter as InboxCategory);
  }
}

export const inboxService = {
  async getInboxItems(query: InboxQuery = {}): Promise<InboxItem[]> {
    const { search = "", filter = "all", sort = "newest" } = query;
    const q = search.trim().toLowerCase();
    const items = inboxItems
      .map(hydrate)
      .map(toListItem)
      .filter((item) => matchesFilter(item, filter))
      .filter((item) =>
        q
          ? [item.title, item.preview, item.sourceName, item.person]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      );

    items.sort((a, b) => {
      if (sort === "oldest") return a.receivedAt.localeCompare(b.receivedAt);
      if (sort === "actions") return b.actionsDetected - a.actionsDetected;
      if (sort === "source") return a.sourceName.localeCompare(b.sourceName);
      return b.receivedAt.localeCompare(a.receivedAt);
    });

    return delay(items);
  },

  async getInboxItem(id: string): Promise<InboxItemDetail | null> {
    const found = inboxItems.find((i) => i.id === id);
    return delay(found ? hydrate(found) : null);
  },

  async getInboxCounts(): Promise<{ needsAttention: number; needsReview: number; unreviewed: number }> {
    const items = inboxItems.map(hydrate).filter((i) => !i.archived);
    return delay(
      {
        needsAttention: items.filter((i) => i.reviewStatus === "needs_review").length,
        needsReview: items.reduce(
          (sum, i) => sum + i.proposals.filter((p) => p.status === "needs_review").length,
          0,
        ),
        unreviewed: items.filter((i) => i.reviewStatus === "needs_review").length,
      },
      120,
    );
  },

  async setReviewStatus(id: string, status: ReviewStatus): Promise<void> {
    patchState((s) => ({ ...s, inboxReview: { ...s.inboxReview, [id]: status } }));
    await delay(undefined, 180);
  },

  async setArchived(id: string, archived: boolean): Promise<void> {
    patchState((s) => ({ ...s, inboxArchived: { ...s.inboxArchived, [id]: archived } }));
    await delay(undefined, 180);
  },

  async setImportant(id: string, important: boolean): Promise<void> {
    patchState((s) => ({ ...s, inboxImportant: { ...s.inboxImportant, [id]: important } }));
    await delay(undefined, 180);
  },

  async markAllReviewed(): Promise<number> {
    const ids = inboxItems
      .map(hydrate)
      .filter((i) => !i.archived && i.reviewStatus === "needs_review")
      .map((i) => i.id);
    patchState((s) => ({
      ...s,
      inboxReview: { ...s.inboxReview, ...Object.fromEntries(ids.map((id) => [id, "approved" as ReviewStatus])) },
    }));
    return delay(ids.length, 240);
  },
};

export const inboxKeys = {
  list: (query: InboxQuery) => ["inbox", "list", query.filter ?? "all", query.sort ?? "newest", query.search ?? ""] as const,
  item: (id: string) => ["inbox", "item", id] as const,
  counts: ["inbox", "counts"] as const,
};
