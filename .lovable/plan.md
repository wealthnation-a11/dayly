# Dayly — Connecting the Real Services (API Integration Plan + Cursor Prompt)

## What this covers

Wiring every external service behind the frontend that already exists. The screens do not change. Every screen already reads through a small set of service files, so each service below is swapped in behind those same function signatures.

Existing swap-in points (contract stays identical):

```text
src/lib/dayly/auth.tsx      -> sign in / sign up / session / profile
src/lib/dayly/service.ts    -> tasks, events, reminders, memory, files, notifications
src/services/inbox.ts       -> Family Inbox list + detail
src/services/ai.ts          -> proposals, review decisions, Ask Dayly, What Changed
src/services/memory.ts      -> memory search
src/services/calendar.ts    -> calendar read/write
src/services/notifications.ts -> notification list + push
src/services/store.ts       -> local decision cache (becomes an optimistic cache)
```

## Rule that shapes every integration

AI proposes, humans approve. No external service may create a task, event, reminder, or memory directly. Every AI/OCR/transcription/email result is written as a **proposal** with its source evidence attached, and only an explicit user decision promotes it into real data. All AI calls run server-side; no provider key ever reaches the browser.

## Service-by-service mapping

| Service | Where it plugs in | What it does |
| --- | --- | --- |
| Supabase Auth | `auth.tsx` | register, login, logout, session refresh, email verification, password reset |
| Supabase Postgres | `service.ts`, `inbox.ts`, `notifications.ts` | households, members, tasks, events, reminders, memories, inbox items, proposals, sources, changes, notifications, settings, audit events |
| Supabase Storage | capture + inbox attachments | private buckets for images, PDFs, audio, documents; signed URLs only |
| Edge Functions | all AI/external calls | the only place secret keys live: `ai-understand`, `ocr-image`, `transcribe-audio`, `ask-dayly`, `embed-content`, `inbound-email`, `send-email`, `push-send` |
| OpenAI | `ai-understand`, `ask-dayly` | extraction, classification, summarization, conflict reasoning, grounded answers |
| Google Cloud Vision | `ocr-image` | text from photos, scans, receipts, screenshots |
| Whisper | `transcribe-audio` | voice notes to text |
| pgvector | `embed-content`, `ask-dayly`, `memory.ts` | embeddings + semantic search that grounds every answer |
| Resend | `send-email`, `inbound-email` | invitations and notifications out; forwarded family email in |
| FCM | `push-send` | push to Android/iOS, respecting per-user notification settings |
| Native calendar | `calendar.ts` | create/read events and reminders after approval only |
| PostHog | app shell | screen + action events only, no message content, no attachment names |
| Sentry | app shell + edge functions | crashes and failures, PII scrubbed |

## Processing pipeline (capture → memory)

```text
capture / inbound email / upload
  -> file to Storage, row in inbox_items (status: processing)
  -> ocr-image or transcribe-audio (if image/audio)
  -> ai-understand: extract fields + confidence + source spans
  -> write proposals + source_refs (nothing else)
  -> embed-content: store embeddings for search
  -> UI shows the item with proposals and evidence
  -> user approves / edits / rejects  <-- the only path to real data
  -> approved: insert task/event/reminder/memory, write audit event,
     optional calendar write, optional push/email notification
```

## Privacy and access

Every table is scoped by `household_id` plus a `visibility` of `private` or `shared`. Row-level security: a member reads shared rows in their household and their own private rows; only an owner/admin manages members and invitations. Private items are never embedded into a shared search index.

## Build order

1. **Foundations** — schema, RLS, buckets, audit table, typed client.
2. **Auth** — replace the session shim; route guards; verification and reset flows.
3. **Core data** — tasks, events, reminders, memory, notifications, settings, household.
4. **Capture + Storage** — uploads, inbox rows, processing states.
5. **AI layer** — OCR, Whisper, understanding, proposals with evidence, review decisions.
6. **Search + Ask Dayly** — embeddings, semantic retrieval, grounded answers with citations.
7. **Email** — Resend outbound, inbound forwarding address per household.
8. **Notifications** — FCM tokens, delivery rules, quiet hours.
9. **Calendar** — post-approval sync.
10. **Observability** — PostHog, Sentry, rate limits, cost guards.

Subscriptions/Stripe stay as previously planned and are layered after step 3, gating capture volume and AI usage.

## Failure and cost handling

Loading, empty, error, and retry states already exist on every screen. Each edge function returns a typed error the UI surfaces verbatim: rate limited (retry with backoff), quota exhausted (prompt to upgrade), provider failure (retry, item stays in `processing_failed` with a Retry action). Uploads are size- and type-capped, AI calls are per-household rate limited, and OCR/transcription/embedding results are cached by file hash so a re-process costs nothing.

## Cursor prompt

Paste this into Cursor at the repo root.

```text
You are working on Dayly, an existing TanStack Start + React 19 + Tailwind v4 frontend.
The UI is finished. Do not redesign screens, components, navigation, styling, or responsive behavior.
Your job is to replace the local service layer with real backends, behind the existing function signatures.

Non-negotiable product rule: "AI proposes, humans approve."
No AI, OCR, transcription, or email result may create a task, event, reminder, or memory directly.
Each result is stored as a proposal with confidence and source evidence. Only an explicit user
decision in the existing review UI promotes it to real data, and every promotion writes an audit event.

Stack: Supabase (Auth, Postgres, Storage, Edge Functions, pgvector), OpenAI (understanding + Ask Dayly),
Google Cloud Vision (OCR), OpenAI Whisper (voice), Resend (outbound + inbound email), Firebase Cloud
Messaging (push), native calendar, PostHog (analytics), Sentry (errors).

Read these files first and treat their exported types and signatures as the contract:
src/lib/dayly/types.ts, src/lib/dayly/auth.tsx, src/lib/dayly/service.ts, src/lib/dayly/data.ts,
src/services/types.ts, src/services/ai.ts, src/services/inbox.ts, src/services/memory.ts,
src/services/calendar.ts, src/services/notifications.ts, src/services/store.ts.

Work in this order, one step per commit, and stop after each step so I can review:
1. SQL migrations: households, household_members, invitations, tasks, events, reminders, memories,
   inbox_items, attachments, proposals, source_refs, changes, notifications, user_settings, push_tokens,
   audit_events, embeddings (pgvector). Every table has household_id and visibility ('private'|'shared').
   For each new table in the public schema: CREATE TABLE, then GRANT to authenticated and service_role,
   then ENABLE ROW LEVEL SECURITY, then policies. Members read shared rows in their household plus their
   own private rows; owners/admins manage members and invitations. Store roles in a separate
   household_members table and check them via a SECURITY DEFINER function, never client-side.
   Private Storage buckets for images, documents, audio; access via signed URLs only.
2. Auth: implement real registration (with the household created in the same transaction), login, logout,
   session refresh, email verification, and password reset in src/lib/dayly/auth.tsx. Add route guards so
   authenticated screens redirect to /signin. Keep the existing form fields, validation, and copy.
3. Core data: back service.ts with real queries and mutations for tasks, events, reminders, memory,
   notifications, household members, and settings. Keep return shapes identical. Use TanStack Query with
   optimistic updates for the review decisions currently cached in src/services/store.ts.
4. Capture and Storage: upload to the private buckets, create an inbox_items row per capture with a
   processing status, and show the existing processing/error states. Cap file size and MIME types.
5. Edge Functions (all secrets server-side only, never in client code or VITE_ vars):
   ocr-image (Vision), transcribe-audio (Whisper), ai-understand (OpenAI: extract fields with confidence
   and source spans, then insert proposals + source_refs and nothing else), embed-content (embeddings into
   pgvector), ask-dayly (retrieve the asking user's permitted rows only, answer grounded strictly in them,
   return citations and say when it does not know), inbound-email (Resend inbound webhook -> verify the
   signature, resolve the household from the forwarding address, create an inbox item, then run the
   pipeline), send-email (Resend outbound: invitations, notifications), push-send (FCM, respecting each
   user's notification settings and quiet hours).
6. Cross-source intelligence and What Changed: detect conflicts and updates between sources server-side,
   write change rows with before/after values and the sources involved, and feed the existing screens.
7. Calendar: write approved events/reminders to the native calendar; never before approval.
8. Observability: PostHog for screen and action events only (no message bodies, no file names, no
   extracted content) and Sentry for client and edge errors with PII scrubbed. Add per-household rate
   limits on AI calls and cache OCR/transcription/embedding results by file hash.

Constraints: TypeScript strict, no `any`; validate every edge function input with Zod; return typed errors
the existing UI can display (rate_limited, quota_exceeded, provider_error, invalid_input); do not add new
UI libraries or a state manager; do not change existing component props; run typecheck before each commit
and tell me what you changed and what still needs my API keys.
```
