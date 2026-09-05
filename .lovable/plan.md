# Dayly Backend: Auth, Database, API Calls

The frontend is already built so that every screen reads its data through two service files. Nothing on screen talks to storage directly. That means the backend work is a swap-in job, not a redesign.

## What exists today

- `src/lib/dayly/service.ts` — one object (`daylyService`) with 13 read methods: profile, tasks, events, reminders, memory, proposals, household members, notifications, files, suggested searches, search.
- `src/services/inbox.ts`, `src/services/ai.ts`, `src/services/memory.ts`, `src/services/calendar.ts`, `src/services/notifications.ts` — Family Inbox, AI Review, What Changed, Connected Information, Ask Dayly.
- `src/lib/dayly/auth.tsx` — sign in / sign up / sign out / restore, currently saving a session object to the browser.
- `src/services/store.ts` — browser-side record of approve/dismiss/star/archive decisions.
- All data collections are empty (`src/services/data/initial-data.ts`, `src/lib/dayly/data.ts`), so screens show their empty states.

Every domain shape is already typed in `src/lib/dayly/types.ts` and `src/services/types.ts`. Those types are the API contract — the backend should return exactly those shapes.

## Plan

### 1. Accounts and sign-in
Real email/password accounts, session persisted and restored on app start, sign-out, and route protection so the app screens require a signed-in user. A person's profile (name, phone, timezone) and their household are created at sign-up, with the creator as Owner. Household invites by email create pending members that become active on acceptance.

### 2. Data storage
Tables for: profiles, households, household members and invites, tasks, events, reminders, memory items, stored files, notifications, inbox items, AI proposals, source references, detected changes, source clusters, ask answers.

Two access rules run through everything, matching the UI:
- **Private vs household** — each task, event, reminder and memory item is either visible only to its owner or to the whole household.
- **Roles** — Owner can invite and remove members; Adults cannot. Roles live in their own table, never on the profile.

### 3. API calls
Replace the body of every service method with a real call, keeping the signature and return shape identical. Add the write operations the screens already trigger: create/edit/complete task, create/edit event, create/edit reminder, approve/edit/dismiss a proposal, accept/dismiss a change, star/archive/mark-reviewed an inbox item, mark notifications read, invite/remove a member, update settings, delete account.

### 4. Capture and file upload
Photo, document and voice captures upload to file storage and create an inbox item marked "processing". AI extraction itself is a later phase — the item stays in "processing" until it runs, which the UI already renders.

### 5. Ask Dayly and AI review
`askDayly` and the extraction pipeline call a server-side AI endpoint that only ever answers from the household's own stored items and must return source references. No proposal is applied without an explicit approval action.

### 6. Subscriptions (Stripe)
- The Stripe **secret key never appears in the codebase** — it is stored as a project secret and read inside server handlers only.
- Server functions for: creating a checkout session, opening the customer portal (manage/cancel billing), and reading the household's current plan.
- A webhook endpoint at `/api/public/stripe-webhook` verifies Stripe's signature over the raw request body before doing anything, then records subscription status and plan on the household.
- A `subscriptions` table (household id, plan, status, renews-at) with RLS so members read only their own household's row; premium gates check it server-side, never from browser storage.

## Technical notes

- Auth and database: Supabase (Postgres + Auth + Storage + row-level security), which the frontend types were designed against.
- Every table in the public schema needs both row-level-security policies and explicit grants, or requests fail.
- Server-side logic (AI calls, extraction, invites) goes in TanStack Start server functions (`createServerFn`) under `src/lib/*.functions.ts`; webhooks and inbound email go under `src/routes/api/public/*` with signature verification.
- Secrets are read inside handlers via `process.env['NAME']`, never at module scope.
- Keep query keys as they are (`queryKeys`, `inboxKeys`, `aiKeys`) so caching and invalidation keep working.
- Delete `src/services/store.ts` only after decisions are persisted server-side.

## Prompt to paste into Cursor

```text
You are working on Dayly, a TanStack Start + React 19 + Tailwind v4 app. The
entire frontend is finished and must not be redesigned. Your job is to add the
backend: authentication, database, storage and real API calls.

Read these files first and treat them as the API contract:
- src/lib/dayly/types.ts and src/services/types.ts  (all DTO shapes)
- src/lib/dayly/service.ts                          (13 read methods)
- src/lib/dayly/auth.tsx                            (session interface)
- src/services/inbox.ts, ai.ts, memory.ts, calendar.ts, notifications.ts
- src/services/store.ts                             (local decision state)

Rules:
1. Do not change any component, route or style. Only replace service/auth
   internals and add server-side code. Keep every exported function name,
   argument list and return type exactly as-is, including the `keys`/
   `queryKeys` objects used for React Query caching.
2. Use Supabase for Auth, Postgres and Storage. Write SQL migrations.
3. For every table created in the public schema, in the same migration:
   CREATE TABLE, then GRANT (authenticated + service_role), then
   ENABLE ROW LEVEL SECURITY, then CREATE POLICY. A migration without grants
   is wrong.
4. Store roles in a separate user_roles table with an app_role enum and a
   SECURITY DEFINER has_role(uuid, app_role) function. Never put a role
   column on profiles.
5. Enforce two access rules in RLS: private items are visible only to their
   owner; household items are visible to active members of that household.
   Only the Owner role can invite or remove members.
6. Server-only logic uses createServerFn from @tanstack/react-start in
   *.functions.ts files. Inbound email/webhooks use file routes under
   src/routes/api/public/* and must verify a signature before doing anything.
   Read secrets with process.env['NAME'] inside the handler, never at module
   scope. Never import a *.server.ts file from a route or component.
7. Never use the service-role key for ordinary reads and never import it at
   module scope of a *.functions.ts file.
8. No seed or demo data anywhere. Empty tables must leave the existing empty
   states on screen.

Deliver in this order, and stop after each step so I can review:
A. SQL migrations: profiles, households, household_members, household_invites,
   user_roles + has_role, tasks, events, reminders, memory_items, stored_files,
   notifications, inbox_items, ai_proposals, source_refs, change_items,
   source_clusters, ask_answers. Include indexes on household_id and owner_id.
B. Auth: real sign-up (creates profile + household + Owner role), sign-in,
   sign-out, session restore, and a route guard so the app screens require a
   session while / /signin /signup stay public. Keep the AuthValue interface.
C. Read APIs: replace every method body in src/lib/dayly/service.ts and the
   src/services/* facades with real queries returning the existing DTO shapes.
   Remove the artificial delays.
D. Write APIs: create/edit/complete task, create/edit event, create/edit
   reminder, approve/edit/dismiss proposal, accept/dismiss change, inbox
   star/archive/mark-reviewed, mark notification read, invite/remove member,
   update profile and settings, delete account. Persist what
   src/services/store.ts currently keeps in the browser, then delete that file.
E. Capture upload: photo/document/voice go to a Storage bucket with per-
   household path scoping and RLS, creating an inbox item with
   aiStatus "processing". Do not build the extraction model yet.
F. Ask Dayly + AI review: a server function that answers only from the
   signed-in user's household data and always returns SourceRef entries. No
   proposal is ever applied without an explicit user approval call.
G. Subscriptions with Stripe:
   - NEVER hardcode the Stripe secret key or put it in the repo. It is read
     with process.env['STRIPE_SECRET_KEY'] inside server handlers only.
   - Add a subscriptions table (household_id, plan, status, current_period_end,
     stripe_customer_id, stripe_subscription_id) with grants and RLS: members
     can read only their own household's row.
   - Server functions: createCheckoutSession (redirect to Stripe Checkout),
     createBillingPortalSession (manage/cancel), getSubscription (current plan
     for the signed-in user's household).
   - A webhook route at src/routes/api/public/stripe-webhook.ts that verifies
     the Stripe signature over the RAW body with the webhook secret before
     processing, then upserts the subscriptions row on
     checkout.session.completed, customer.subscription.updated and
     customer.subscription.deleted.
   - Plan gates are checked server-side from the subscriptions row. Never
     trust plan status from browser storage or client code.

After each step run a typecheck and report anything broken.
```
