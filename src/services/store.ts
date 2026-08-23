/**
 * Demo persistence layer.
 *
 * Only user *decisions* are persisted (review status, archive, important),
 * never the mock content itself. When a real backend arrives, replace the
 * read/write helpers with API calls — the service modules are the only
 * consumers.
 */

import type { ReviewStatus } from "./types";

const KEY = "dayly.intelligence.v1";

export interface DemoState {
  inboxReview: Record<string, ReviewStatus>;
  inboxArchived: Record<string, boolean>;
  inboxImportant: Record<string, boolean>;
  proposalReview: Record<string, ReviewStatus>;
  changeReview: Record<string, ReviewStatus>;
}

const empty: DemoState = {
  inboxReview: {},
  inboxArchived: {},
  inboxImportant: {},
  proposalReview: {},
  changeReview: {},
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readState(): DemoState {
  if (!isBrowser()) return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Partial<DemoState>) };
  } catch {
    return empty;
  }
}

export function writeState(next: DemoState) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — demo state stays in memory only */
  }
}

export function patchState(patch: (state: DemoState) => DemoState) {
  const next = patch(readState());
  writeState(next);
  return next;
}

export function resetState() {
  if (isBrowser()) window.localStorage.removeItem(KEY);
}
