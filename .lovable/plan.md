# Dayly Backend Plan — Auth, Data, API Calls, Subscription

Every screen already reads through a small set of service files, so this is a swap-in job: no screen, layout or style needs to change. Below is the full inventory of what the app currently shows, and what the backend must supply for each part.

## Screens the backend must serve

| Screen | Needs from the backend |
|---|---|
| Splash `/` | Restore an existing session, then route to Today or Sign in |
| Sign in `/signin` | Email + password sign-in, error states |
| Sign up `/signup` | Account + profile (name, email, phone, timezone), household creation, terms acceptance |
| Today `/today` | Today's tasks, events, reminders, pending AI proposals, inbox counts, what-changed count |
| Capture `/capture` | Photo / document / text / voice upload, creates an inbox item in "processing" |
| AI Review `/review` | All pending proposals with fields, confidence, interpretations and sources; approve / edit / dismiss |
| Task `/task`, Event `/event`, Reminder `/reminder` | Create and edit, due date/time, priority, assignee, reminder, private vs household |
| Memory `/memory`, `/memory/:id` | Stored captures with summary, notes, linked tasks/events, related items, natural-language search with sources |
| Family Inbox `/inbox`, `/inbox/:id` | Inbox list with search, 10 filters, 4 sorts; detail with original content, extracted understanding, proposals, connected information; star, archive, mark reviewed, mark all reviewed |
| What changed `/changes` | Detected new/changed/removed/conflict items with before-and-after and sources; accept or dismiss |
| Ask Dayly `/ask` | Natural-language answers grounded only in the household's own stored information, always with sources |
| Household `/household` | Members, roles (Owner / Adult), invite one additional adult by email, pending invites, remove member, assignments |
| Notifications `/notifications` | Reminder / review / assignment / update notifications, unread count, mark read |
| Settings `/settings` | Profile save, push + email + per-category notification toggles, quiet hours, data retention, export my data, delete account, plan and billing |

## Plan

### 1. Accounts and sign-in
Real email/password accounts; session persisted and restored on launch; sign-out; protected app screens with `/`, `/signin`, `/signup` public. Sign-up creates the profile and the household and makes the creator the Owner.

### 2. Household and privacy
Members table plus a separate roles table. Two rules run through every query:
- **Private vs household** — tasks, events, reminders and memory items are visible only to their owner, or to the whole household.
- **Roles** — only the Owner invites or removes members. The product allows one additional adult, so invites are capped.

Invites by email create a pending member that becomes active on acceptance.

### 3. Data storage
Tables for: profiles, households, household members, invites, roles, tasks, events, reminders, memory items, stored files, notifications, notification preferences, inbox items, AI proposals, source references, detected changes, source clusters, ask history, subscriptions.

### 4. API calls
Replace each service method body with a real call, keeping names and return shapes identical. Add the writes the screens already trigger: task create/edit/complete, event create/edit, reminder create/edit, proposal approve/edit/dismiss (single and batch), change accept/dismiss, inbox star/archive/mark-reviewed/mark-all, notification mark-read, invite/remove member, assign a task to a member, profile and notification settings save, data retention, data export, delete account.

### 5. Capture and files
Photo, document and voice captures upload to file storage scoped per household, and create an inbox item marked "processing". Extraction itself is a later phase; the UI already renders the processing state.

### 6. AI: extraction, review, changes, Ask Dayly
Server-side AI reads the household's own content only, and must return the source excerpt behind every field it proposes. Nothing is ever applied without an explicit approval action — that principle is the product, so it is enforced server-side, not just in the UI.

### 7. Subscription (Stripe)
- Secret key stored as a project secret, read only inside server handlers — never in the repo or browser.
- Server functions: start checkout, open the billing portal (manage/cancel), read the household's current plan.
- Webhook at `/api/public/stripe-webhook` verifies Stripe's signature over the raw body before recording anything.
- A subscriptions row per household (plan, status, renewal date) with member-only read access. Plan gates are checked server-side, never from browser storage. This fills the Settings "Plan" card, which is currently a placeholder.

## Technical notes

- Supabase for Auth, Postgres, Storage; the existing DTO types were designed for it.
- Every public-schema table gets grants **and** row-level-security policies in the same migration, or requests fail.
- Roles live in `user_roles` with a `SECURITY DEFINER has_role()` function — never a role column on profiles.
- Server logic in TanStack Start `createServerFn` (`src/lib/*.functions.ts`); webhooks and inbound email in `src/routes/api/public/*` with signature verification.
- Secrets read via `process.env['NAME']` inside handlers only.
- Keep the existing query-key objects (`queryKeys`, `inboxKeys`, `aiKeys`, `memoryKeys`, `notificationKeys`, `calendarKeys`) so caching keeps working.
- `src/services/store.ts` (browser-side approve/star/archive state) is deleted once decisions persist server-side.
- No seed data: empty tables must keep the existing empty states on screen.

## Prompt to paste into Cursor

```text
You are working on Dayly, a finished TanStack Start + React 19 + Tailwind v4
mobile-first app. The frontend is complete and must NOT be redesigned. Your job
is the backend: auth, database, storage, real API calls, and Stripe billing.

Read these first and treat them as the API contract:
- src/lib/dayly/types.ts, src/services/types.ts        (all DTO shapes)
- src/lib/dayly/service.ts                             (13 read methods)
- src/lib/dayly/auth.tsx                               (AuthValue interface)
- src/lib/dayly/data.ts, src/services/data/initial-data.ts (empty collections)
- src/services/inbox.ts, ai.ts, memory.ts, calendar.ts, notifications.ts
- src/services/store.ts                                (browser decision state)
- src/routes/*  (screens: index, signin, signup, today, capture, review, task,
  event, reminder, memory.index, memory.$id, inbox.index, inbox.$id, changes,
  ask, household, notifications, settings)

Hard rules:
1. Do not change components, routes, copy or styling. Only replace service and
   auth internals and add server-side code. Keep every exported function name,
   argument list, return type and query-key object exactly as-is.
2. Supabase for Auth, Postgres, Storage. Write SQL migrations.
3. For every public-schema table, in the same migration: CREATE TABLE, then
   GRANT (authenticated + service_role), then ENABLE ROW LEVEL SECURITY, then
   CREATE POLICY. A migration without grants is wrong.
4. Roles go in user_roles (app_role enum) with a SECURITY DEFINER
   has_role(uuid, app_role). Never a role column on profiles.
5. RLS enforces the product's two privacy rules: private items are readable
   only by their owner; household items are readable by active members of that
   household. Only the Owner role may invite or remove members, and a household
   accepts at most one additional adult.
6. "AI proposes, humans approve" is enforced server-side: no proposal, change
   or extracted item is ever written to tasks/events/reminders/memory without
   an explicit approve call from the signed-in user. Every proposed field must
   carry its SourceRef (source name, type, date, excerpt, relation).
7. Server logic uses createServerFn from @tanstack/react-start in
   *.functions.ts files. Webhooks and inbound email use file routes under
   src/routes/api/public/* and must verify a signature before doing anything.
   Read secrets with process.env['NAME'] inside handlers only, never at module
   scope. Never import a *.server.ts file from a route or component. Never
   import the service-role client at module scope of a *.functions.ts file, and
   never use it for ordinary reads.
8. No seed, demo or placeholder data anywhere. Empty tables must leave the
   existing empty states rendering.

Deliver in these steps, stopping after each for review:

A. MIGRATIONS: profiles, households, household_members, household_invites,
   user_roles + has_role, tasks, events, reminders, memory_items,
   memory_links, stored_files, notifications, notification_preferences,
   inbox_items, ai_proposals, proposal_fields, source_refs, change_items,
   source_clusters, cluster_sources, ask_history, subscriptions. Include
   indexes on household_id, owner_id and created_at, and enum types matching
   the TypeScript unions (Priority, TaskStatus, Visibility, CaptureKind,
   ItemType, SourceKind, ReviewStatus, InboxCategory, AiStatus, ChangeKind,
   NotificationCategory).

B. AUTH: real sign-up (creates auth user + profile with name/email/phone/
   timezone + household + Owner role + default notification preferences),
   sign-in, sign-out, session restore, and a route guard so app screens require
   a session while / /signin /signup stay public. Keep the AuthValue interface
   (session, signIn, signUp, signOut, restore) exactly as it is.

C. READ APIS: replace every body in src/lib/dayly/service.ts (getProfile,
   getTasks, getEvents, getReminders, getMemory, getMemoryItem, getProposals,
   getMembers, getNotifications, getFiles, getSuggestedSearches, search) and in
   the src/services/* facades (inbox list with search/filter/sort, inbox
   detail, inbox counts, pending proposals, proposals for item, changes,
   clusters, sources, calendar events, unread notification count) with real
   queries returning the existing DTO shapes. Remove the artificial delays.

D. WRITE APIS: task create/edit/complete/assign, event create/edit, reminder
   create/edit, proposal approve/edit/dismiss plus batch, change accept/
   dismiss, inbox star/archive/mark-reviewed/mark-all-reviewed, notification
   mark-read, member invite/accept/remove, profile save, notification
   preference + quiet-hours save, data retention setting, export my data,
   delete account. Persist what src/services/store.ts keeps in the browser,
   then delete that file.

E. CAPTURE UPLOAD: photo, document, text and voice captures go to a Storage
   bucket with per-household path scoping and RLS, and create an inbox item
   with aiStatus "processing" plus a memory item where the UI expects one. Do
   not build the extraction model yet.

F. AI: a server function for Ask Dayly that answers ONLY from the signed-in
   user's household data and always returns SourceRef entries (empty answer
   when nothing matches — keep the existing copy). Extraction pipeline turns a
   processing inbox item into AiProposals with fields, confidence
   (clear/uncertain), interpretations for uncertain reads, and sources; plus
   cross-source clusters and detected ChangeItems (new/changed/removed/
   conflict) with previous and next values.

G. STRIPE SUBSCRIPTION:
   - Never hardcode or commit the Stripe secret key. Read
     process.env['STRIPE_SECRET_KEY'] inside server handlers only.
   - subscriptions table (household_id, plan, status, current_period_end,
     stripe_customer_id, stripe_subscription_id) with grants and RLS so only
     that household's active members can read it.
   - Server functions: createCheckoutSession, createBillingPortalSession,
     getSubscription. Wire them to the existing Settings "Plan" card (Manage
     subscription, Restore purchase) without changing its layout.
   - Webhook at src/routes/api/public/stripe-webhook.ts verifying the Stripe
     signature over the RAW body with the webhook secret before processing,
     then upserting the subscription on checkout.session.completed,
     customer.subscription.updated and customer.subscription.deleted.
   - Plan gates are checked server-side from the subscriptions row. Never trust
     plan status from client code or browser storage.

After each step, run a typecheck and report anything broken.
```
