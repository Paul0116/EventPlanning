# Gatherly Prioritized Backlog

Prepared: October 31, 2026

Status: Phase 0 complete; later phases not started

The detailed requirement for every ID remains canonical in [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md). Status values follow Not started → In progress → Review → Verified → Done. `Done` below is used only for Phase 0 preparation artifacts with recorded verification; no implementation work from Phase 1 or later has started.

## Completed preparation work

| ID | Status | Dependency | Evidence |
|---|---|---|---|
| P0-01 | Done | Architecture document | [`decisions.md`](./decisions.md#adr-002-first-release-scope) |
| P0-02 | Done | P0-01 | [`ui-flows.md`](./ui-flows.md) |
| P0-03 | Done | Architecture constraints | [`decisions.md`](./decisions.md#adr-003-provider-and-deployment-defaults), [`provider-setup.md`](./provider-setup.md) |
| P0-04 | Done | P0-01 | [`decisions.md`](./decisions.md#adr-004-initial-load-and-staging-test-assumptions) |
| P0-05 | Done (proposal documented; approval pending) | Architecture privacy proposal | [`decisions.md`](./decisions.md#adr-008-guest-privacy-dietary-access-and-retention) |
| P0-06 | Done | Architecture lifecycle restrictions | [`decisions.md`](./decisions.md#adr-005-event-lifecycle-and-transition-matrix) |
| P0-07 | Done | P0-03, P0-04, P0-06 | [`decisions.md`](./decisions.md#adr-006-invitation-rsvp-and-delivery-policy), [`decisions.md`](./decisions.md#adr-007-supported-currencies) |

## Priority 0: Phase 1 external prerequisites

These actions unblock integrated acceptance but are not application work items and are not claimed complete:

1. User supplies Clerk development configuration securely.
2. User supplies Neon development and isolated test database URLs securely.
3. User confirms the selected providers' data-processing/residency posture is acceptable for the intended users.

See [`provider-setup.md`](./provider-setup.md#required-before-phase-1-can-pass-integrated-foundation-acceptance).

## Priority 1: Phase 1 foundation — next authorized phase

| Order | ID | Status | Primary dependency/outcome |
|---:|---|---|---|
| 1 | P1-01 | Not started | Initialize supported Next.js/TypeScript/UI/tooling and lockfile |
| 2 | P1-02 | Not started | Establish server-only modules and feature boundaries; begins with P1-01 |
| 3 | P1-03 | Not started | PostgreSQL/Prisma users/events/members/categories/audit migration; needs Neon access for integration evidence |
| 4 | P1-04 | Not started | Clerk sign-in, verified identity, local mapping, and idempotent webhook; needs Clerk configuration |
| 5 | P1-06 | Not started | Owner/member authorization services and isolation checks; depends on P1-03/P1-04 |
| 6 | P1-07 | Not started | Request IDs, errors, validation, pagination, origin and version helpers |
| 7 | P1-08 | Not started | Responsive accessible workspace shell and shared UI patterns |
| 8 | P1-05 | Not started | Minimal authorized event create/list/detail with transactional default categories |
| 9 | P1-09 | Not started | CI, environment example, synthetic seed, and final Phase 1 verification |

Phase 1 is not complete until its signed-out, cross-user isolation, migration rollback, browser flow, and secret/log checks have evidence.

## Priority 2: Phase 2 core planning

All are **Not started** and depend on verified Phase 1.

| Order | ID | Outcome shorthand |
|---:|---|---|
| 1 | P2-01 | Complete details, dates, allowlisted currency, capacity, deadline, lifecycle, archive/restore/delete |
| 2 | P2-02 | Tasks persistence/service/API/UI |
| 3 | P2-03 | Budget categories/items with exact constraints |
| 4 | P2-04 | Exact aggregates and overspend presentation |
| 5 | P2-06 | Shared-service event/task/budget HTTP contract |
| 6 | P2-07 | Optimistic versions and conflict UX |
| 7 | P2-08 | Safe planning audit events and lifecycle consistency |
| 8 | P2-05 | Integrated dashboard totals/upcoming tasks and guest placeholder |

## Priority 3: Phase 3 guests and invitations

All are **Not started** and depend on verified Phase 2 plus Resend, Upstash, worker/staging, and privacy prerequisites.

| Order | ID | Outcome shorthand |
|---:|---|---|
| 1 | P3-01 | Guest parties and approved dietary-access behavior |
| 2 | P3-02 | Hashed token generation, expiry, rotation, revocation, and composite integrity |
| 3 | P3-06 | Single locked attendance/capacity service for every write path |
| 4 | P3-07 | Transactional status/deadline/token/party/capacity/version enforcement |
| 5 | P3-03 | Encrypted transactional email outbox, dedupe, throttling, visible states |
| 6 | P3-04 | Leased one-minute worker, retry/recovery/terminal handling, payload erasure |
| 7 | P3-05 | Private RSVP page and token-authorized API |
| 8 | P3-08 | Shared rate limits, private cache/index/referrer rules, token redaction |
| 9 | P3-09 | Guest dashboard totals and non-mutating preview |

## Priority 4: Phase 4 collaboration and schedule

All are **Not started** and depend on verified Phase 3.

| Order | ID | Outcome shorthand |
|---:|---|---|
| 1 | P4-01 | Owner-only collaborator invitation/revoke controls on the outbox |
| 2 | P4-02 | Verified-email, single-use, atomic collaborator acceptance |
| 3 | P4-03 | Editor/viewer role management and immediate revocation |
| 4 | P4-04 | Authorized task assignment and race-safe removal cleanup |
| 5 | P4-05 | Schedule persistence/service/API/UI |
| 6 | P4-06 | Event-window validation, overlap policy, and stranded-item prevention |
| 7 | P4-07 | Shared-event navigation/dashboard and approved private-data visibility |
| 8 | P4-08 | Membership/invitation/schedule API documentation |

## Priority 5: Phase 5 launch preparation

All are **Not started** and depend on verified Phase 4. Production execution remains separately authorized.

| Order | ID | Outcome shorthand |
|---:|---|---|
| 1 | P5-01 | Full role/guest acceptance run and release-blocker resolution |
| 2 | P5-02 | Mobile/accessibility/target-browser review |
| 3 | P5-03 | Isolation, token, webhook, CSRF, cache, rate-limit, log, and secret review |
| 4 | P5-04 | Approved retention job and notices |
| 5 | P5-05 | Representative data/concurrency measurement and evidence-based tuning |
| 6 | P5-06 | Production secrets, pooling, sender, worker, backups, monitoring, alerts |
| 7 | P5-07 | Migration rehearsal and isolated restore drill |
| 8 | P5-08 | Setup/runbook/API/troubleshooting/privacy/organizer documentation |
| 9 | P5-09 | Deployment artifacts; deploy/smoke test only when explicitly authorized |
| 10 | P5-10 | Authorized initial operating-period monitoring and impact-based triage |

## Deferred, unprioritized product work

Vendor discovery/booking, payments, seating plans, public pages, templates, attachments, calendar integration, advanced reports, real-time collaboration, ownership transfer, currency conversion, and native apps remain outside all first-release phase gates. They require separate requirements and architecture decisions before entering this backlog.
