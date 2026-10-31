# Gatherly Phase 0 UI Flows and Low-Fidelity Layouts

Prepared: October 31, 2026

Status: Phase 0 interaction baseline; no application UI is implemented in this phase

## Experience principles

- Mobile-first forms and lists; desktop adds density and side-by-side context without changing permissions or business rules.
- The event time zone and currency are visible wherever date/time or money is edited.
- Server authorization decides access. Hidden controls and navigation guards are convenience only.
- Every asynchronous region has a named loading state; every form has field-level and summary errors; focus moves to the first invalid field or conflict notice.
- Destructive actions require confirmation. Permanent delete is visually separated from archive and explains irreversibility.
- A viewer gets an explicit read-only presentation for an accessible event. A user without event access receives a resource-not-found presentation rather than confirmation that the event exists.
- RSVP pages are private, `noindex`, `no-store`, and free of third-party analytics. Token-bearing URLs are not echoed in visible diagnostics.

## Navigation model

### Desktop workspace shell

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Gatherly     Event switcher ▾                   Help   Profile ▾     │
├───────────────┬──────────────────────────────────────────────────────┤
│ All events    │ Event title · PLANNING · Asia/Manila · PHP          │
│               │                                                      │
│ Overview      │ Page heading                              Actions    │
│ Tasks         │                                                      │
│ Budget        │ Page content                                         │
│ Guests        │                                                      │
│ Schedule      │                                                      │
│ Settings      │                                                      │
└───────────────┴──────────────────────────────────────────────────────┘
```

### Mobile workspace shell

```text
┌──────────────────────────────┐
│ ☰  Event title        Profile│
│ PLANNING · Asia/Manila · PHP │
├──────────────────────────────┤
│ Page heading        + Action │
│ Page content                 │
├──────────────────────────────┤
│ Overview Tasks Budget Guests │
│ Schedule and Settings via ☰  │
└──────────────────────────────┘
```

The bottom bar may show the four most-used destinations. The menu always exposes all destinations with text labels. The selected destination has more than color as its indicator.

## End-to-end screen flow

```text
Landing
  → Sign in / recover account
  → Event list
      → Create event
          → Details → Date/time/time zone → Currency/capacity/budget
          → Review → Create draft
      → Event dashboard
          → Tasks
          → Budget
          → Guests → Send invitation → Delivery state
          → Schedule
          → Settings → Collaborators / lifecycle / deletion

Private guest email
  → RSVP token page
      → Read invitation
      → Accept + party size + optional dietary notes, or decline
      → Review/submit
      → Confirmation
      → Reopen same link and replace response until deadline

Collaborator email
  → Sign in with verified matching email
  → Accept once
  → Shared event with editor or viewer presentation
```

The core Phase 0 walkthrough is: sign in → create draft → add tasks and budget items → move to planning → add guest party → queue invitation → guest accepts → dashboard totals update after refresh. Implementation arrives in later phases.

## 1. Event list — `/events`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Events                                           [Create event]      │
│ [Active] [Archived]     Search…      Owner/shared ▾   Date ▾         │
├──────────────────────────────────────────────────────────────────────┤
│ Company Anniversary     PLANNING   Feb 20, 2027   Owner   [Open]    │
│ Wedding Reception       DRAFT      Apr 03, 2027   Editor  [Open]    │
│ Community Dinner        CANCELLED  May 12, 2027   Viewer  [Open]    │
├──────────────────────────────────────────────────────────────────────┤
│ Load more                                                         │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Events              [+ New]  │
│ Search events…               │
│ [Active ▾] [Filters]         │
├──────────────────────────────┤
│ Company Anniversary          │
│ PLANNING · Owner             │
│ Feb 20, 2027 · Asia/Manila  >│
├──────────────────────────────┤
│ Wedding Reception            │
│ DRAFT · Editor              >│
└──────────────────────────────┘
```

Primary flow: open existing event or start the creation wizard. Creation ends in `draft`; only the owner can activate planning later.

## 2. Event dashboard — `/events/[eventId]`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Company Anniversary                         [Preview] [Edit details] │
│ Feb 20, 2027, 6:00 PM–10:00 PM · Asia/Manila · Main Hall           │
├────────────────┬────────────────┬────────────────┬───────────────────┤
│ Tasks          │ Budget         │ RSVP people    │ Parties           │
│ 18 / 30 done   │ PHP 38,250.00  │ 82 accepted    │ 36 yes / 8 no     │
│ [View tasks]   │ of 50,000.00   │ capacity 100   │ 12 pending        │
├────────────────┴────────────────┴────────────────┴───────────────────┤
│ Upcoming tasks                    │ Alerts                           │
│ · Confirm venue · Nov 10          │ Budget estimate over target     │
│ · Finalize menu · Nov 18          │ 2 invitation deliveries failed │
└───────────────────────────────────┴──────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Company Anniversary          │
│ Feb 20 · Asia/Manila         │
│ Main Hall          [Preview] │
├──────────────────────────────┤
│ Tasks 18/30  [View]          │
│ ██████░░░░ 60%               │
├──────────────────────────────┤
│ Budget PHP 38,250 / 50,000   │
│ RSVP 82 people · 12 pending  │
├──────────────────────────────┤
│ Upcoming                     │
│ Confirm venue · Nov 10       │
└──────────────────────────────┘
```

Totals are derived over all records. Before Phase 3, the RSVP card is a deliberate “Guest tracking is not enabled yet” empty state, not a false zero.

## 3. Tasks — `/events/[eventId]/tasks`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Tasks                                                [Add task]     │
│ Status ▾  Priority ▾  Assignee ▾  Due ▾  Search…                    │
├────┬───────────────────────┬──────────┬────────────┬───────────────┤
│ ✓  │ Confirm venue         │ High     │ Alex       │ Nov 10        │
│ ○  │ Finalize menu         │ Medium   │ Jamie      │ Nov 18        │
│ ○  │ Print name cards      │ Low      │ Unassigned │ Feb 10        │
└────┴───────────────────────┴──────────┴────────────┴───────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Tasks               [+ Add]  │
│ Search…   [Filters 2]        │
├──────────────────────────────┤
│ ○ Finalize menu              │
│ MEDIUM · Jamie               │
│ Due Nov 18                  >│
├──────────────────────────────┤
│ ○ Print name cards           │
│ LOW · Unassigned            >│
└──────────────────────────────┘
```

Task edit is a desktop dialog and mobile full-screen sheet. A stale version leaves the user's input visible and offers “Review latest” before retry.

## 4. Budget — `/events/[eventId]/budget`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Budget · PHP                                      [Add cost]        │
│ Target 50,000.00  Estimated 52,500.00 ⚠  Actual 38,250.00          │
│ Paid 30,000.00    Unpaid 8,250.00   Remaining target 11,750.00     │
├──────────────────────────────────────────────────────────────────────┤
│ Venue (2)                                [Rename]                    │
│ Hall rental       25,000.00 est.  25,000.00 actual  PAID           │
│ Security           3,000.00 est.   2,500.00 actual  UNPAID         │
│ Catering (4)                                                     │
│ Dinner            20,000.00 est.  10,750.00 actual  UNPAID         │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Budget · PHP        [+ Cost] │
│ Actual 38,250.00             │
│ Target 50,000.00             │
│ Estimate over target ⚠       │
├──────────────────────────────┤
│ Venue (2)                    │
│ Hall rental                  │
│ 25,000.00 · PAID            >│
├──────────────────────────────┤
│ Catering (4)                >│
└──────────────────────────────┘
```

Amounts are strings in forms and always show the currency. Deleting a non-empty category is disabled with an explanation and server-enforced rejection.

## 5. Guests — `/events/[eventId]/guests`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Guests                              [Add party] [Send invitations]   │
│ 82 accepted people · 8 declined parties · 12 pending parties        │
│ Response ▾  Delivery ▾  Search name/email…                          │
├─────────────────────┬──────────┬──────────┬────────────┬────────────┤
│ Rivera family       │ Accepted │ 4 / 5    │ Delivered  │ [⋯]        │
│ Jordan Lee          │ Pending  │ 0 / 1    │ Failed ⚠  │ [⋯]        │
│ Sam Chen            │ Declined │ 0 / 2    │ Delivered  │ [⋯]        │
└─────────────────────┴──────────┴──────────┴────────────┴────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Guests              [+ Add]  │
│ 82 accepted · 12 pending     │
│ Search… [Filters] [Send]     │
├──────────────────────────────┤
│ Rivera family · ACCEPTED     │
│ 4 of 5 · Delivered          >│
├──────────────────────────────┤
│ Jordan Lee · PENDING         │
│ Failed delivery ⚠           >│
└──────────────────────────────┘
```

Party detail contains contact information, party limit, current response, correction controls, invitation history/status, revoke, and resend. Manual resend requires confirmation that older links will stop working. Dietary notes appear only for owner/editor under the unapproved privacy proposal; viewers receive neither the field nor its value.

## 6. Private RSVP — `/rsvp/[token]`

This route does not use the authenticated workspace shell.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│                              Gatherly                               │
│             You’re invited to Company Anniversary                  │
│        Feb 20, 2027 · 6:00 PM · Asia/Manila · Main Hall           │
│        Please respond by Feb 10, 2027, 11:59 PM                    │
├──────────────────────────────────────────────────────────────────────┤
│ Will your party attend?  (•) Yes  ( ) No                           │
│ Party size             [ 2 ▾ ]  Maximum 5                          │
│ Dietary notes          [ Optional text area                    ]    │
│                         Shared with event planners                  │
│                                      [Review response]             │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│           Gatherly           │
│ You’re invited               │
│ Company Anniversary          │
│ Feb 20 · 6:00 PM             │
│ Asia/Manila · Main Hall      │
├──────────────────────────────┤
│ Will your party attend?      │
│ [ Yes ] [ No ]               │
│ Party size [2 ▾] · max 5     │
│ Dietary notes (optional)     │
│ [                         ]  │
│ [Review response]            │
└──────────────────────────────┘
```

After review, submit shows a confirmation with the saved response and “Change response” while still permitted. Capacity conflict refreshes available context without exposing other guests. Expired/revoked/unknown tokens share a generic unavailable view and disclose no guest or event details. Deadline-passed valid links may show that party's existing response read-only; closed-event behavior is generic and non-mutating.

## 7. Schedule — `/events/[eventId]/schedule`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Schedule · Feb 20 · Asia/Manila                   [Add activity]    │
├──────────────┬───────────────────────────────────────────────────────┤
│ 6:00–6:30 PM │ Doors open · Lobby                                  │
│ 6:30–6:45 PM │ Welcome remarks · Main stage                        │
│ 6:30–7:30 PM │ Dinner service · Dining hall   OVERLAPS             │
│ 8:00–9:30 PM │ Program and awards · Main stage                     │
└──────────────┴───────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Schedule           [+ Add]   │
│ Feb 20 · Asia/Manila         │
├──────────────────────────────┤
│ 6:00–6:30 PM                 │
│ Doors open · Lobby          >│
├──────────────────────────────┤
│ 6:30–6:45 PM                 │
│ Welcome remarks             >│
└──────────────────────────────┘
```

Overlaps are allowed and visually indicated, not treated as validation errors. Times outside the event window are rejected with both the event window and offending activity shown.

## 8. Settings — `/events/[eventId]/settings`

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Settings                                                            │
│ [Details] [Collaborators] [Lifecycle]                               │
├──────────────────────────────────────────────────────────────────────┤
│ Event details                                                       │
│ Title [Company Anniversary                         ]                │
│ Starts [Feb 20, 2027 6:00 PM] Ends [10:00 PM]                      │
│ Time zone [Asia/Manila ▾] Currency [PHP locked]                    │
│ Capacity [100] RSVP deadline [Feb 10, 11:59 PM]   [Save]           │
├──────────────────────────────────────────────────────────────────────┤
│ Danger zone                                                         │
│ [Archive event]                              [Delete permanently]   │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Settings                     │
│ [Details]                    │
│ [Collaborators]              │
│ [Lifecycle]                  │
├──────────────────────────────┤
│ Status: PLANNING             │
│ [Mark completed]             │
│ [Cancel event]               │
│ [Archive event]              │
│                              │
│ Delete permanently          >│
└──────────────────────────────┘
```

Only the owner sees enabled collaborator, lifecycle, and delete controls. Editors get details they may edit plus an owner-only explanation for restricted sections. Viewers see read-only details. Reopen actions state that capacity, deadlines, and token rules still apply.

## Shared screen-state specification

| Surface | Empty | Loading | Recoverable error | Permission/access state |
|---|---|---|---|---|
| Event list | Illustration, “Create your first event”; shared-only users get “No events shared with you” | Stable card skeletons with heading/filter controls retained | Inline retry with request ID; preserve current filters | Signed out → sign-in; never render cached private rows |
| Dashboard | Individual cards explain what to add; RSVP card says feature not enabled before Phase 3 | Independent card skeletons to avoid blocking whole page | Failed card has retry; page-level failure retains event header | Viewer badge/read-only; inaccessible event → generic not found |
| Tasks | “No tasks yet” or “No tasks match filters”; add CTA only when writable | Row/card skeletons | Retry list; mutation error keeps form values; conflict offers refresh/review | Viewer sees list without mutation controls; inaccessible child ID → not found |
| Budget | Default categories may be empty; explain target vs actual | Summary and category skeletons | Exact decimal input errors at field; aggregate failure never shows guessed totals | Viewer read-only; owner/editor controls only in planning state |
| Guests | Explain one record per invitation party; add CTA when planning | Totals and row skeletons | Delivery failure is a durable row state; list fetch retry separate from send retry | Viewer cannot see dietary notes; inaccessible event → not found |
| RSVP | Not applicable after valid token read; pending response is a valid state | Neutral invitation shell with no leaked details | Validation inline; `409` capacity/version offers refresh; network retry never double-submits | Unknown/expired/revoked/draft/archived token views disclose no invitation details; `410` for expired/revoked API |
| Schedule | Event-window explanation and add CTA | Timeline skeleton preserving time rail | Invalid item shows event window; list retry | Viewer read-only; closed events read-only |
| Settings | Collaborator list empty state and explanation | Section skeleton | Save error keeps entered values; stale version offers review | Owner-only sections disabled/omitted with explanation for accessible editor/viewer |

## Status and mutation behavior

| Event state | Header treatment | Primary controls |
|---|---|---|
| Draft | Neutral `DRAFT` badge and “Invitations are disabled until planning” banner | Owner: Start planning; owner/editor: planning-data edits |
| Planning | Positive `PLANNING` badge | Normal role-based planning and invitation controls |
| Completed | `COMPLETED` badge and read-only banner | Owner: Reopen to planning or archive |
| Cancelled | Warning `CANCELLED` badge with guest-response closure | Owner: Reopen to planning or archive |
| Archived | Muted `ARCHIVED` badge; hidden by default | Owner: Restore to planning; permanent delete remains separate |

## Form and accessibility behavior

- Every input has a persistent visible label; placeholders never substitute for labels.
- Keyboard order follows visual order. Dialog/sheet focus is trapped, initial focus is intentional, and focus returns to the invoker.
- Errors use text and programmatic associations, not color alone. A summary links to invalid fields.
- Loading indicators have accessible names and do not remove the page heading.
- Touch targets are at least 44 by 44 CSS pixels. Dense desktop tables become labeled mobile cards instead of horizontal mini-tables.
- Date/time input always states the event time zone. Task due dates are calendar dates and do not display a time.
- Money input accepts two fractional digits, normalizes only after validation, and keeps the user's exact text on failure.
- Destructive confirmations name the event/record and consequences. Permanent event deletion requires typing the event title or an equivalently deliberate confirmation.

## Route and state inventory

| Route | Owner | Editor | Viewer | Guest token |
|---|---|---|---|---|
| `/events` | Owned/shared list and create | Shared list and create own | Shared list and create own | No access |
| `/events/new` | Create own event | Create own event | Create own event | No access |
| `/events/[eventId]` and planning tabs | Read/write per module | Read/write while planning except owner-only controls | Read-only | No access |
| `/events/[eventId]/settings` | Full | Editable details where allowed; no status/member/delete controls | Read-only details | No access |
| `/rsvp/[token]` | Authenticated preview only through a separate non-token action | Same preview capability | No preview | Own invitation party only |
| `/invitations/[token]` | Matching verified recipient acceptance | Matching verified recipient acceptance | Matching verified recipient acceptance | Not a guest route |

Authenticated organizer preview must use a server-authorized event/guest ID and never expose or recover a raw guest token. Preview cannot submit an RSVP.
