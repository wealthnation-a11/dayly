# Dayly Frontend Foundation

Build the complete FRONTEND of an application called DAYLY.

IMPORTANT:

This is the frontend implementation of the existing Dayly PRD. Treat the PRD as the source of truth. Do not invent new product functionality, workflows, screens, pricing, integrations, or business rules that are not specified in the PRD.

For this phase, build ONLY the frontend/UI/UX.

Do NOT build the production backend, database, Supabase schema, AI processing backend, email ingestion backend, payment processing, or external API integrations yet.

Use realistic local/mock data so every screen and interaction can be previewed and tested visually.

The application must be structured so the backend can be connected later without redesigning the frontend.

==================================================

1. PRODUCT

==================================================

Product name: Dayly

Core product concept:

Dayly is a mobile-first AI assistant for individuals and households that turns everyday information into trusted actions, reminders, events, and searchable memory.

The fundamental product loop is:

CAPTURE

→ UNDERSTAND

→ REVIEW

→ CONFIRM

→ ACT

→ REMEMBER

Dayly allows users to capture information through:

- Photo

- PDF/document

- Pasted text

- Voice

- Email forwarding in the appropriate release

The system proposes structured actions from captured information.

The user remains in control.

Core principle:

"AI proposes. Humans approve."

Never design the UI as if AI silently creates important actions without user confirmation.

Source evidence must be visible wherever the AI proposes an action.

==================================================

2. DESIGN DIRECTION

==================================================

Create a polished, premium, modern, calm, trustworthy mobile-first product.

The interface should feel like:

- A personal life organization assistant

- Simple enough for everyday users

- Intelligent without feeling complicated

- Calm rather than overly futuristic

- Highly trustworthy

- Clean and uncluttered

- Friendly but professional

Avoid:

- Excessive gradients

- Excessive glassmorphism

- Neon cyberpunk styling

- Overly decorative dashboards

- Complex enterprise UI

- Excessive animations

- Dense tables

- Chatbot-style interfaces

- Generic AI-dashboard aesthetics

Use:

- Clean white/light surfaces

- Soft neutral backgrounds

- Strong visual hierarchy

- Rounded cards

- Clear typography

- Subtle borders

- Comfortable spacing

- Clear primary actions

- Accessible contrast

- Small purposeful icons

- Consistent component styling

Use a restrained Dayly visual identity with a warm sun/daylight motif combined with a refined purple primary action color.

Do not make the application look childish.

The interface should feel suitable for adults managing personal and household information.

==================================================

3. RESPONSIVE REQUIREMENTS

==================================================

This is a MOBILE-FIRST application.

Design the primary experience for approximately:

- 360px

- 390px

- 412px

- 430px

Then make it responsive for:

- Tablet

- Desktop

Mobile is the priority.

On mobile:

- Use bottom navigation where appropriate.

- Keep primary actions thumb-friendly.

- Use full-width content.

- Avoid tiny text.

- Use bottom sheets/modals for secondary actions where appropriate.

- Keep navigation simple.

On desktop:

- Preserve the mobile information hierarchy.

- Expand content intelligently.

- Do not simply stretch mobile screens across the desktop.

- Use centered content areas and appropriate maximum widths.

==================================================

4. GLOBAL NAVIGATION

==================================================

The primary product areas are:

1. Today

2. Capture

3. Memory

4. Household

5. Settings

Use a consistent mobile bottom navigation system.

Recommended navigation labels:

Today

Capture

Memory

Household

Settings

Use clear icons and active/inactive states.

The navigation must remain consistent across authenticated screens.

Authentication/onboarding screens should not show the authenticated bottom navigation.

==================================================

5. FRONTEND SCREEN INVENTORY

==================================================

Build ALL 32 screens/states below.

Do not skip any.

Do not add extra primary screens.

The IDs and names must remain exactly as follows.

--------------------------------------------------

S-01 — Splash / Launch

--------------------------------------------------

Purpose:

Brand loading and session restoration.

Design:

- Dayly logo

- Dayly name

- Simple daylight/sun visual

- Minimal loading indicator

- Clean branded background

Behavior:

- Show briefly on application launch.

- Mock session restoration.

- Route to Welcome/authentication when logged out.

- Route to Today when logged in.

--------------------------------------------------

S-02 — Welcome

--------------------------------------------------

Purpose:

Introduce Dayly and provide sign-in choices.

Content:

- Dayly logo

- Short value proposition

- Primary "Create account" CTA

- "Sign in" secondary action

- Supported identity-provider options where represented by the PRD

Core messaging should communicate:

Capture everyday information.

Dayly turns it into trusted actions, reminders, and searchable memory.

Do not overpopulate this screen.

--------------------------------------------------

S-03 — Create Account

--------------------------------------------------

Purpose:

New-user registration.

Include:

- Full name

- Email

- Password

- Password visibility control

- Terms/privacy acknowledgement

- Create account CTA

- Sign-in link

- Supported identity-provider options where appropriate

Include validation/error states visually.

Do not implement real authentication yet.

Use mock interaction.

--------------------------------------------------

S-04 — Sign In

--------------------------------------------------

Purpose:

Existing-user authentication.

Include:

- Email

- Password

- Password visibility control

- Forgot password

- Sign in

- Alternative supported sign-in options

- Link to create account

Include validation and error states.

--------------------------------------------------

S-05 — Consent & Privacy

--------------------------------------------------

Purpose:

Required notices and user privacy choices.

Communicate that:

- Dayly stores user information securely.

- User information is not shared without appropriate authorization.

- User remains in control.

- User can export or delete data.

Include:

- Privacy explanation

- Consent controls

- Continue CTA

- Privacy information link

Keep this screen calm and understandable.

--------------------------------------------------

S-06 — Onboarding Goals

--------------------------------------------------

Purpose:

Choose the user's initial Dayly context.

Support the PRD's:

- Personal use

- Household use

Do not introduce additional goal categories that are not in the PRD.

Use selectable cards/radio-style controls.

Continue CTA.

--------------------------------------------------

S-07 — Notification Permission Primer

--------------------------------------------------

Purpose:

Explain why notifications are useful before requesting OS-level notification permission.

Communicate:

Dayly can remind the user about important tasks and events at the right time.

Actions:

- Enable notifications

- Not now

This is a primer screen, not the actual operating-system permission dialog.

--------------------------------------------------

S-08 — Create Household

--------------------------------------------------

Purpose:

Create the user's household.

Include:

- Household name

- Default timezone

- Create household CTA

The user must be able to skip/change household setup where appropriate according to the onboarding flow.

Do not invent additional household configuration options.

--------------------------------------------------

S-09 — Today — Empty

--------------------------------------------------

Purpose:

Empty state when the user has no current information/tasks/events.

Show:

- Friendly greeting

- Clear explanation of what Dayly does

- Empty-state illustration/icon

- Primary "Capture something" CTA

The empty state should encourage the user to provide information to Dayly.

Do not make this look like a blank calendar.

--------------------------------------------------

S-10 — Today — Active

--------------------------------------------------

Purpose:

Primary Dayly dashboard.

This is one of the most important screens.

Prioritize:

1. Items needing review

2. Overdue items

3. Today's events/tasks

4. Near-term upcoming items

Use sections/cards such as:

Needs Review

Overdue

Today's Events

Tasks

Upcoming

Each item should clearly communicate:

- What it is

- Date/time when applicable

- Status

- Priority when applicable

- Relevant action

Include a prominent Capture action.

The screen should immediately answer:

"What needs my attention?"

--------------------------------------------------

S-11 — Capture Menu

--------------------------------------------------

Purpose:

Choose what the user wants to capture.

Options:

- Take a photo

- Upload document

- Paste text

- Record voice

- Email forwarding should be represented only where appropriate to the release; do not create an additional primary screen for it.

Make Capture feel like one of Dayly's central actions.

--------------------------------------------------

S-12 — Camera Capture

--------------------------------------------------

Purpose:

Capture one or more document pages/photos.

UI:

- Camera preview

- Capture button

- Flash/control where appropriate

- Page/document guidance

- Cancel

- Review captured image(s)

Design it like a real document-capture experience.

--------------------------------------------------

S-13 — Document Upload

--------------------------------------------------

Purpose:

Select a PDF or supported image.

Include:

- File picker-style interface

- Recent files/mock files

- PDF/image indicators

- Browse/upload action

- File selection state

Use realistic mock files.

Do not implement real storage yet.

--------------------------------------------------

S-14 — Paste Text

--------------------------------------------------

Purpose:

Paste copied information.

Include:

- Large text input

- Helpful placeholder

- Analyze text CTA

- Character/input feedback where useful

The experience should clearly communicate that pasted information will be analyzed by Dayly.

--------------------------------------------------

S-15 — Voice Capture

--------------------------------------------------

Purpose:

Record and transcribe a voice note.

Include:

- Large recording control

- Waveform visualization

- Recording timer

- Pause/stop controls

- Cancel

- Transcription/editing state

The user should be able to edit the transcript before it is processed.

Do not implement actual audio processing yet.

--------------------------------------------------

S-16 — Processing

--------------------------------------------------

Purpose:

Show Dayly processing captured information.

Show stages such as:

- Uploading securely

- Reading content

- Finding key details

- Preparing suggestions

Use an elegant processing animation.

Communicate that the system is analyzing information rather than pretending the result is instant.

Include loading/error/retry states.

--------------------------------------------------

S-17 — AI Review

--------------------------------------------------

Purpose:

The central trust screen.

This screen must clearly demonstrate:

AI PROPOSES.

USER CONFIRMS.

Show proposed extracted items as review cards.

Each proposal should contain:

- Item title

- Type

- Date/time if available

- Relevant fields

- Source evidence

- Confirm

- Edit

- Dismiss

Example:

Task

Submit permission slip

Due Wednesday, September 2

Evidence:

"Permission slips must be submitted by Wednesday..."

Another candidate may be:

Event

School excursion

Friday, September 4

Every candidate must remain traceable to its source.

Do NOT design automatic confirmation.

Allow multiple candidate items to be reviewed.

Include uncertainty states when information is ambiguous.

--------------------------------------------------

S-18 — Create/Edit Task

--------------------------------------------------

Purpose:

Create or edit a task.

Fields:

- Title

- Description

- Due date

- Assignee

- Reminder

Use clean form controls.

Primary CTA:

Save task

Secondary actions:

Cancel/discard where appropriate.

--------------------------------------------------

S-19 — Create/Edit Event

--------------------------------------------------

Purpose:

Create or edit an event.

Fields:

- Title

- Date

- Start/end time or all-day

- Location

- Notes

- Reminder

Primary CTA:

Save event

--------------------------------------------------

S-20 — Create/Edit Reminder

--------------------------------------------------

Purpose:

Edit reminder timing.

Include:

- Related item

- Reminder date

- Reminder time

- Repeat/recurrence where applicable

- Save reminder

Do not invent advanced reminder features outside the PRD.

--------------------------------------------------

S-21 — Memory Item Detail

--------------------------------------------------

Purpose:

View a stored source and its linked actions.

Show:

- Source/document title

- Source preview/metadata

- Linked tasks

- Linked events

- Related information

- Notes where appropriate

- View/open source action

The user should understand the connection between the original information and actions created from it.

--------------------------------------------------

S-22 — Search

--------------------------------------------------

Purpose:

Search the user's Dayly memory.

Support:

- Keyword search

- Natural-language query interface

Examples:

"When is the next school event?"

"What documents do I need?"

"When does the insurance expire?"

Include suggested searches.

Keep this as a search/memory interface, not a generic AI chatbot.

--------------------------------------------------

S-23 — Search Results

--------------------------------------------------

Purpose:

Display answers with source evidence.

Results should include:

- Answer

- Supporting source

- Relevant evidence

- Related records

- View source action

If there is insufficient evidence, show a clear "couldn't find a reliable answer" state instead of fabricating information.

--------------------------------------------------

S-24 — Household Members

--------------------------------------------------

Purpose:

View household members, roles and invitation status.

For the MVP, respect the PRD's household model:

- Household owner

- One additional adult

Do NOT display an arbitrary list of multiple household members.

Show:

- Current owner

- Additional adult if invited/accepted

- Role

- Invitation status

- Relevant management action

--------------------------------------------------

S-25 — Invite Member

--------------------------------------------------

Purpose:

Invite one additional adult.

Include:

- Email

- Role

- Permission/access explanation

- Send invitation CTA

The invitee must accept before gaining access to shared household information.

Do not add child accounts.

--------------------------------------------------

S-26 — Assignments

--------------------------------------------------

Purpose:

View assigned/shared work.

Show:

- Assigned to me

- Assigned by me

- Task title

- Due date

- Priority/status

- Assignee

Make it easy to understand who needs to do what.

--------------------------------------------------

S-27 — Notifications Center

--------------------------------------------------

Purpose:

View recent notifications and alerts.

Include notification categories such as:

- Reminders

- Review requests

- Assignments

- Important Dayly events

Include:

- Read/unread states

- Timestamp

- Mark as read/clear where appropriate

Do not expose sensitive information unnecessarily.

--------------------------------------------------

S-28 — Profile

--------------------------------------------------

Purpose:

Manage personal profile information.

Include ONLY the relevant profile functionality supported by the PRD:

- Personal details

- Timezone

Keep this screen simple.

Do not add unrelated account-management features just to fill space.

--------------------------------------------------

S-29 — Notification Settings

--------------------------------------------------

Purpose:

Configure notifications.

Include:

Channels:

- Push notifications

- Email notifications

Categories:

- Reminders

- Review requests

- Assignments

- Dayly updates

Also include:

- Quiet hours

Do not label this screen "Navigation Settings."

It must be clearly called:

Notification Settings

--------------------------------------------------

S-30 — Privacy & Data

--------------------------------------------------

Purpose:

Give the user control over their information.

Include:

- Export data

- Data retention

- Delete account

- Privacy information

Deletion should be visually treated as a destructive action.

Do not make deletion too easy to trigger accidentally.

--------------------------------------------------

S-31 — Help & Feedback

--------------------------------------------------

Purpose:

Support and feedback.

Include:

- Frequently asked questions

- Report an issue

- Send feedback

- Contact support

Keep the interface simple and useful.

--------------------------------------------------

S-32 — Subscription

--------------------------------------------------

Purpose:

Plan and entitlement information IF subscription is enabled.

IMPORTANT:

The PRD does NOT specify:

- A subscription price

- A Premium price

- A specific plan name

- Specific premium feature packaging

Therefore DO NOT invent pricing or subscription benefits.

Design this as a neutral subscription/entitlement screen.

It may show:

- Current plan/entitlement state

- Available plan information placeholder

- Subscription status

- Restore/manage subscription action if applicable

Clearly make this screen conditional on subscription being enabled.

==================================================

6. CORE COMPONENT SYSTEM

==================================================

Create reusable frontend components rather than building every screen independently.

Create components for:

- App shell

- Bottom navigation

- Top app bar

- Page headers

- Buttons

- Primary CTA

- Secondary CTA

- Icon buttons

- Input fields

- Select controls

- Date/time controls

- Toggle controls

- Cards

- Task cards

- Event cards

- Reminder cards

- Review cards

- Source/evidence cards

- Search result cards

- Notification cards

- Household member cards

- Assignment cards

- Empty states

- Loading states

- Error states

- Confirmation dialogs

- Bottom sheets

- Modals

- Toasts

- Status badges

- Priority indicators

- File cards

- Audio/voice controls

Maintain consistent spacing, typography, radius, borders, icons and interaction behavior throughout.

==================================================

7. IMPORTANT UI STATES

==================================================

Do not build only the "happy path."

Every relevant screen should account for:

- Empty state

- Loading state

- Success state

- Error state

- Disabled state

- Validation state

- Permission state

- Confirmation state

- Destructive-action confirmation

The PRD specifically expects complete flows rather than only ideal states.

==================================================

8. MOCK DATA

==================================================

Use realistic mock data for the frontend.

Use examples such as:

- School notices

- Appointments

- Family tasks

- Household events

- Documents

- Reminders

However, clearly treat them as sample/mock content.

Do not hard-code the product around one family, school or person.

Create a mock data layer so the backend can later replace it.

==================================================

9. AI REVIEW UX

==================================================

This is critical.

The AI review experience must communicate confidence and evidence.

Never show an AI-generated action without its source context when source evidence exists.

For uncertain information, use language such as:

"I'm not sure which date you mean."

Then provide possible interpretations.

Do not expose technical confidence numbers unless explicitly useful.

Do not make unsupported assumptions.

Never make the interface imply that AI is always correct.

==================================================

10. MEMORY UX

==================================================

Memory should feel like a trusted personal information archive.

A user should be able to:

Capture information

→ have it stored

→ retrieve it later

→ see the answer

→ inspect the source.

Search results should prioritize source-grounded information.

If information cannot be reliably found, communicate that clearly.

==================================================

11. HOUSEHOLD PRIVACY UX

==================================================

Clearly distinguish:

PRIVATE information

from

SHARED HOUSEHOLD information.

The UI should make sharing status understandable.

Do not expose private records to household members through mock navigation.

The frontend should visually respect role/access boundaries even before the backend is connected.

==================================================

12. ACCESSIBILITY

==================================================

Build with accessibility in mind.

Use:

- Accessible color contrast

- Proper labels

- Large enough touch targets

- Keyboard accessibility on desktop

- Screen-reader-friendly semantic structure

- Clear focus states

- Do not rely only on color to communicate status

==================================================

13. ANIMATION

==================================================

Use subtle animation only where it improves understanding.

Good uses:

- Screen transitions

- Loading/processing

- Capture feedback

- Confirmation

- Notification appearance

- Voice waveform

Avoid:

- Excessive motion

- Distracting effects

- Long animations

The application should feel fast.

==================================================

14. FRONTEND ROUTING

==================================================

Implement frontend routes for all 32 screens/states.

Use appropriate protected/public route behavior.

Public:

S-01

S-02

S-03

S-04

S-05

S-06

S-07

S-08

Authenticated:

S-09 through S-32

Where a screen is a modal/bottom-sheet state rather than a full navigation destination, structure it cleanly so it still corresponds to the PRD screen inventory.

==================================================

15. DESIGN SYSTEM

==================================================

Create a centralized Dayly design system.

Define reusable tokens for:

- Typography

- Colors

- Spacing

- Border radius

- Shadows

- Elevation

- Component states

- Icons

Primary action color:

A refined Dayly purple.

Supporting colors:

- Neutral/light surfaces

- Dark readable text

- Muted secondary text

- Green for success

- Amber for warnings

- Red for destructive/error states

- Blue for informational states

Do not overuse these semantic colors.

==================================================

16. DESKTOP EXPERIENCE

==================================================

Although mobile is the priority, the desktop version should look intentional.

Use:

- Centered application workspace

- Appropriate max-width

- Larger content areas

- Optional side navigation where appropriate

- Responsive card layouts

- Better use of horizontal space

Do not simply enlarge mobile screens.

==================================================

17. CODE QUALITY

==================================================

Use a clean component architecture.

Requirements:

- Reusable components

- Reusable form components

- Centralized design tokens

- Centralized mock data

- Clear route structure

- No unnecessary duplication

- No giant monolithic components

- Clear naming conventions

- Easy future Supabase integration

- Easy replacement of mock data with API/database calls

Keep backend calls abstracted so the frontend can later connect to Supabase without rewriting the UI.

==================================================

18. DO NOT BUILD YET

==================================================

For this frontend phase, DO NOT implement:

- Real Supabase database

- Real authentication backend

- Real AI processing

- Real OCR

- Real document extraction

- Real voice transcription

- Real email ingestion

- Real push notification infrastructure

- Real subscription billing

- Real external API integrations

Instead, create realistic mocked states and service interfaces/placeholders.

The frontend must look and behave as if these systems exist, but clearly keep the implementation replaceable.

==================================================

19. FINAL QUALITY BAR

==================================================

Before finishing, verify all 32 screen IDs:

S-01

S-02

S-03

S-04

S-05

S-06

S-07

S-08

S-09

S-10

S-11

S-12

S-13

S-14

S-15

S-16

S-17

S-18

S-19

S-20

S-21

S-22

S-23

S-24

S-25

S-26

S-27

S-28

S-29

S-30

S-31

S-32

There must be exactly 32 primary screens/states corresponding to the Dayly PRD.

Do not add:

- Extra dashboards

- Extra admin screens

- Child accounts

- Shopping

- Banking

- Medical diagnosis

- Travel booking

- Autonomous purchasing

- General-purpose chatbot functionality

- Unspecified subscription pricing

- Unspecified premium features

The final frontend should feel like a real production-quality Dayly application, not a generic template.

Most importantly:

DAYLY SHOULD FEEL LIKE A TRUSTED LIFE-ORGANIZATION TOOL.

The user gives Dayly information.

Dayly helps understand it.

Dayly proposes what matters.

The user remains in control.

Dayly turns approved information into actions and searchable memory.

Build the frontend around that experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/35409ae8-3cf2-447a-88a3-3807ed35db75).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
