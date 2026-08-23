/**
 * AI service (mock).
 *
 * Everything is simulated locally — no AI provider is called. The AI →
 * Review → Action workflow always ends with an explicit user decision, so
 * these functions only ever record decisions the user already made.
 */

import { mockAnswers, mockAskSuggestions, mockChanges, mockClusters, mockInboxItems } from "./mock/intelligence-data";
import { patchState, readState } from "./store";
import type { AiProposal, AskAnswer, ChangeItem, ReviewStatus, SourceCluster, SourceRef } from "./types";

const LATENCY = 340;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function hydrateProposal(p: AiProposal): AiProposal {
  const state = readState();
  return { ...p, status: state.proposalReview[p.id] ?? p.status };
}

function hydrateChange(c: ChangeItem): ChangeItem {
  const state = readState();
  return { ...c, status: state.changeReview[c.id] ?? c.status };
}

export const aiService = {
  /** All proposals awaiting review across every source. */
  async getPendingProposals(): Promise<AiProposal[]> {
    const all = mockInboxItems.flatMap((i) => i.proposals).map(hydrateProposal);
    return delay(all.filter((p) => p.status === "needs_review"));
  },

  async getProposalsForItem(itemId: string): Promise<AiProposal[]> {
    const item = mockInboxItems.find((i) => i.id === itemId);
    return delay((item?.proposals ?? []).map(hydrateProposal));
  },

  /** Records a human decision on a proposal. Nothing is created without this. */
  async processAIReview(proposalId: string, decision: ReviewStatus): Promise<{ proposalId: string; decision: ReviewStatus }> {
    patchState((s) => ({ ...s, proposalReview: { ...s.proposalReview, [proposalId]: decision } }));
    return delay({ proposalId, decision }, 220);
  },

  async processAIReviewBatch(
    proposalIds: string[],
    decision: ReviewStatus,
  ): Promise<{ count: number; decision: ReviewStatus }> {
    patchState((s) => ({
      ...s,
      proposalReview: {
        ...s.proposalReview,
        ...Object.fromEntries(proposalIds.map((id) => [id, decision])),
      },
    }));
    return delay({ count: proposalIds.length, decision }, 300);
  },

  async getChanges(): Promise<ChangeItem[]> {
    return delay(mockChanges.map(hydrateChange));
  },

  async resolveChange(changeId: string, decision: ReviewStatus): Promise<void> {
    patchState((s) => ({ ...s, changeReview: { ...s.changeReview, [changeId]: decision } }));
    await delay(undefined, 200);
  },

  async getClusters(): Promise<SourceCluster[]> {
    return delay(mockClusters);
  },

  async getSources(clusterOrProposalId: string): Promise<SourceRef[]> {
    const cluster = mockClusters.find((c) => c.id === clusterOrProposalId);
    if (cluster) return delay(cluster.sources, 160);
    const proposal = mockInboxItems.flatMap((i) => i.proposals).find((p) => p.id === clusterOrProposalId);
    return delay(proposal?.sources ?? [], 160);
  },

  getAskSuggestions(): string[] {
    return mockAskSuggestions;
  },

  /** Simulated natural-language answer over the family's stored information. */
  async askDayly(question: string): Promise<AskAnswer> {
    const q = question.trim().toLowerCase();
    const words = q.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
    let best: (typeof mockAnswers)[number] | undefined;
    let bestScore = 0;
    for (const candidate of mockAnswers) {
      const hay = candidate.question.toLowerCase();
      const score = words.reduce((sum, w) => (hay.includes(w) ? sum + 1 : sum), 0);
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    const id = `ans-${Date.now()}`;
    if (!best || bestScore === 0) {
      return delay(
        {
          id,
          question,
          answer:
            "I couldn't find anything in your family's stored information that answers that yet. Try asking about school, soccer, appointments or documents — or capture the information first so I can learn it.",
          bullets: [],
          sources: [],
        },
        700,
      );
    }
    return delay({ ...best, id, question }, 800);
  },
};

export const aiKeys = {
  proposals: ["ai", "proposals"] as const,
  proposalsFor: (id: string) => ["ai", "proposals", id] as const,
  changes: ["ai", "changes"] as const,
  clusters: ["ai", "clusters"] as const,
};
