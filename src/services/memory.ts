/**
 * Memory service facade (mock).
 *
 * Wraps the existing Dayly memory data layer so the new intelligence screens
 * depend on one seam instead of importing mock data directly.
 */

import { daylyService } from "@/lib/dayly/service";
import type { MemoryItem } from "@/lib/dayly/types";
import { sourceClusters } from "./data/initial-data";
import type { SourceCluster } from "./types";

export const memoryService = {
  getMemory: (): Promise<MemoryItem[]> => daylyService.getMemory(),
  getMemoryItem: (id: string): Promise<MemoryItem | undefined> => daylyService.getMemoryItem(id),
  /** Cross-source clusters that group related memory, inbox and calendar items. */
  getConnectedInformation: (): Promise<SourceCluster[]> =>
    new Promise((resolve) => setTimeout(() => resolve(sourceClusters), 300)),
};

export const memoryKeys = { connected: ["memory", "connected"] as const };
