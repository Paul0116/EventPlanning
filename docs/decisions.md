# Gatherly Phase 0 Decision Log

Prepared: October 31, 2026

Phase: 0 — Preparation and product decisions

Status: implementation baseline, except for the privacy/retention proposal explicitly marked as awaiting user approval

## Decision labels

- **Decided:** the Phase 0 implementation default. A later change requires a recorded decision update.
- **Assumption:** a reversible planning value selected so implementation and testing can proceed.
- **Proposal — approval required:** not represented as user-approved and must be confirmed before the stated implementation gate.

## P0 decision summary

| Work item | Outcome | Status | Evidence |
|---|---|---|---|
| P0-01 | First-release modules and deferred scope are fixed below. | Decided | “First-release scope” |
| P0-02 | Responsive flows, layouts, and all common states are specified. | Decided | [`ui-flows.md`](./ui-flows.md) |
| P0-03 | Clerk, Resend, Vercel Pro, Neon, Upstash, and Vercel Cron are the provider defaults. | Decided | ADR-003 and [`provider-setup.md`](./provider-setup.md) |
| P0-04 | Initial scale, traffic, invitation limits, and staging volumes are specified. | Assumption | ADR-004 |
| P0-05 | A 90-day guest-data minimization policy and access rules are fully specified. | Proposal — approval required | ADR-008 |
| P0-06 | Owner-only event transitions and restoration behavior are fixed. | Decided | ADR-005 |
| P0-07 | Token, resend, retry, response-change, correction, and currency policies are fixed. | Decided | ADR-006 and ADR-007 |

## ADR-001: Canonical repository and documentation location

**Status:** Decided

**Decision:** `/Users/paulchristianargao/EventPlanning` is the application repository because it is the Git worktree root. Canonical project documents live in `docs/`. The supplied `gatherly/` folder remains unchanged as source material. There was no application code, previous handoff, `AGENTS.md`, or prior decision record at the start of Phase 0.

## ADR-002: First-release scope

**Status:** Decided

### Included

| Module | First-release capability |
|---|---|
| Accounts | Managed sign-in/sign-out, verified email, sessions, recovery, and local profile mapping |
| Events | Create, read, update, owner-only lifecycle changes, archive/restore, and owner-only permanent deletion |
| Dashboard | Derived task, budget, RSVP, and upcoming-task summaries |
| Tasks | CRUD, priority, status, due date, filters, and assignment to authorized event members |
| Budget | Categories, exact two-decimal estimates/actuals, paid state, target limit, totals, and overspend warnings |
| Guests | Invitation parties, party limits, search/filter, response state, and optional dietary notes |
| Invitations and RSVP | Durable email delivery, private token links, response changes, deadline/capacity enforcement, rotation/revocation, and organizer corrections |
| Collaboration | Owner-managed editor/viewer invitations and immediate revocation |
| Schedule | Ordered event-window activities with overlap allowed |
| Platform safety | Event-scoped authorization, optimistic versions, audit records, rate limits, private caching, token redaction, and synthetic test data |

### Explicitly deferred

Vendor discovery/booking, payment collection, seating plans, public event pages, reusable templates, file attachments, calendar integrations, advanced reporting, real-time editing/updates, ownership transfer, exchange-rate conversion, database row-level security, and native/mobile applications are not part of the first release.

No deferred item may be added merely because a selected provider offers it.

## ADR-003: Provider and deployment defaults

**Status:** Decided for implementation; accounts and credentials are not yet available.

| Concern | Default | Reason and boundary |
|---|---|---|
| Identity | **Clerk** using its supported Next.js App Router SDK | Provides verified email, sessions, recovery, server helpers, and signed Svix-based webhooks. Gatherly keeps application roles in PostgreSQL; Clerk Organizations and Clerk role billing are not used. Clerk currently hosts identity data in the US and does not offer region selection, so residency/legal fit must be reviewed before production. |
| Transactional email | **Resend** with a verified Gatherly sending subdomain | Supported Node SDK, signed delivery webhooks, custom-domain authentication, and provider idempotency keys fit the outbox. Provider idempotency is only an additional duplicate-send control; PostgreSQL remains the delivery source of truth. Marketing email and contacts are not used. |
| Web hosting | **Vercel Pro**, Next.js Node.js runtime, primary Functions region Singapore (`sin1`) | Native Next.js hosting and per-minute cron are operationally simple. A paid Pro plan is required because Hobby cron is limited to once daily, which cannot meet the two-minute job-start target. Keep compute and the database in the same nearby region. |
| PostgreSQL | **Neon Postgres**, AWS Singapore where available | Managed PostgreSQL, pooled connections suitable for serverless Prisma workloads, isolated branches/projects, and recovery features. Runtime uses the pooled URL; reviewed migrations use the migration connection. PostgreSQL remains the only system of record. |
| Shared rate limiting | **Upstash Redis** in the closest available Singapore/Asia region, using `@upstash/ratelimit` | Its HTTP SDK is designed for serverless Next.js/Vercel runtimes. It is used only for shared throttling and short-lived coordination—not event data, authorization, or durable email state. |
| Scheduled worker trigger | **Vercel Cron** every minute, calling a protected Node.js Route Handler | The handler leases due `email_outbox` rows with PostgreSQL `FOR UPDATE SKIP LOCKED`, sends outside the lease transaction, and records outcomes. Cron does not retry failed invocations and can duplicate an invocation; row leases, dedupe keys, and idempotent processing handle both cases. |

### Environment isolation

- Use separate Clerk, Resend, Vercel, Neon, and Upstash development/staging/production configuration where the provider supports it.
- Use a dedicated Neon database or branch for automated integration tests; never run destructive tests against development, staging, or production data.
- Use separate Neon production and non-production projects to reduce credential and deletion blast radius. Development/test branches may share the non-production project.
- Use synthetic addresses and provider test recipients until an explicitly authorized staging integration check. Never use real guest data in development or tests.
- Do not enable third-party analytics on RSVP or collaborator invitation pages.

### Official references reviewed

- [Clerk Next.js App Router quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart), [webhook verification](https://clerk.com/docs/guides/development/webhooks/overview), and [production configuration](https://clerk.com/docs/guides/development/deployment/production)
- [Resend pricing and domain requirements](https://resend.com/pricing), [idempotency keys](https://resend.com/changelog/idempotency-keys), and [webhook verification](https://resend.com/changelog/managing-webhooks-via-api)
- [Vercel Cron usage/precision](https://vercel.com/docs/cron-jobs/usage-and-pricing) and [Cron security/error behavior](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- [Neon pricing/recovery capabilities](https://neon.com/pricing) and [Prisma pooling support](https://neon.com/blog/better-postgres-with-prisma-experience)
- [Upstash TypeScript rate-limit SDK](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) and [required REST configuration](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted)

## ADR-004: Initial load and staging-test assumptions

**Status:** Assumption. These are design/test targets, not contractual quotas or measured capacity.

### Expected and high-water data sizes

| Dimension | Expected ordinary use | First-release design/test high-water mark |
|---|---:|---:|
| Accessible events per organizer | 10 active / 50 lifetime | 100 total owned or shared |
| Collaborators per event | 5 | 50 |
| Guest invitation parties per event | 150 | 1,000 |
| Accepted people per event | 250 | 2,500, subject to event capacity |
| Tasks per event | 100 | 500 |
| Budget items per event | 100 | 500 |
| Schedule items per event | 30 | 250 |
| Audit/outbox records per large event | 2,000 | 10,000 each before retention/cleanup |

All collection APIs remain cursor-paginated with default 25 and maximum 100. Dashboard totals cover the full authorized event, not only one page.

### Traffic and concurrency

- Test 50 simultaneous RSVP submissions against the same event, including at least 20 competing for fewer remaining places.
- Test 200 RSVP mutations per minute across staging and 100 concurrent authenticated reads.
- Keep the architecture performance values as initial targets: usable event pages within 2.5 seconds on a typical mobile connection, p95 internal API reads below 500 ms excluding provider calls, and due invitation jobs normally starting within two minutes.
- These are unmeasured targets until Phase 5. Phase 0 does not claim that any target has been met.

### Product invitation limits

The application limits apply even if a provider permits more:

- At most 100 invitation parties in one bulk action.
- At most 1,000 newly queued guest invitations per event in a rolling 24-hour window.
- At most 2,000 newly queued invitations per organizer in a rolling 24-hour window across events.
- At most 10 invitation actions per organizer per minute; bulk requests consume quota by recipient count where supported.
- One manual resend per party every 5 minutes and no more than 3 manual resends per party in 24 hours.
- Collaborator invitations use the same per-recipient cooldown and a maximum of 100 per event per 24 hours.
- Limits return `429` with a retry time and do not partially enqueue an atomic bulk request.

Provider quotas can be stricter. The UI must surface that account-level provider limit rather than silently dropping jobs.

### Staging performance fixture

Create only synthetic data: 25 organizers, 500 events, 50,000 guest parties overall, and one hot event at every high-water value above. Seed 10,000 due/retry/terminal outbox rows for worker query testing. Use a disposable database branch and remove it after the exercise.

## ADR-005: Event lifecycle and transition matrix

**Status:** Decided

### State semantics

| State | Workspace visibility | Planning mutations | New invitation sends | Guest RSVP reads/writes |
|---|---|---|---|---|
| `draft` | Owner, editor, viewer with event access | Owner/editor | No | No. Return a generic unavailable response without guest/event details. |
| `planning` | Owner, editor, viewer with event access | Owner/editor | Owner/editor for guest invitations; owner only for collaborators | Yes only with a valid active token, before/equal to deadline, and within capacity |
| `completed` | Accessible users; read-only | No | No | No writes; token route returns a generic closed state without unrelated details |
| `cancelled` | Accessible users; read-only with cancellation label | No | No | No writes; token route returns a generic cancelled/closed state |
| `archived` | Hidden from default lists; accessible via archived filter/direct authorized route | No | No | No writes; generic unavailable state |

Draft behavior is explicit: organizers can build the whole plan, but cannot send guest links or accept RSVPs until the owner moves the event to `planning`. Preview is authenticated and non-mutating.

### Owner-only transition matrix

`✓` means allowed with a fresh version and explicit owner action. `—` means rejected.

| From \ To | `draft` | `planning` | `completed` | `cancelled` | `archived` |
|---|---:|---:|---:|---:|---:|
| `draft` | — | ✓ | — | ✓ | ✓ |
| `planning` | — | — | ✓ | ✓ | ✓ |
| `completed` | — | ✓ | — | — | ✓ |
| `cancelled` | — | ✓ | — | — | ✓ |
| `archived` | — | ✓ | — | — | — |

Rules:

- Only the owner changes status. Editors cannot change status even though they may edit planning data.
- No state transitions back to `draft`; `draft` is creation-only.
- Reopening `completed`, `cancelled`, or `archived` always returns to `planning`, requires explicit confirmation, increments the event version, and creates an audit entry.
- Reopening does not bypass the RSVP deadline, capacity, token expiry/revocation, or schedule/event-window checks. A guest link becomes writable again only if every independent rule passes.
- Closing or archiving does not revoke tokens automatically; status enforcement blocks them. Permanent deletion removes invitation records and cancels pending outbox work where possible.
- Archive restoration intentionally follows the architecture requirement and returns to `planning`, even if the event was closed before it was archived.
- Permanent deletion is not a status transition. It is a separate owner-only confirmed transaction with cascades.

## ADR-006: Invitation, RSVP, and delivery policy

**Status:** Decided

### Guest invitation tokens

- Generate at least 32 cryptographically random bytes. Store only a hash in `guest_invitations`.
- A guest link is reusable for reads and response replacement until the earliest of revocation, deletion, or `expires_at`; response writes additionally require `planning` status and an open deadline.
- Set `expires_at` to seven days after the event end. If the owner moves the event end, existing token expiry does not silently extend; the organizer must resend/rotate when a longer lifetime is required.
- Opening/previewing a link never submits a response. `GET` has no mutation side effect.
- A normal organizer resend **rotates** the token, revokes the previous token, and queues one new link. This is required because the raw token exists only in the encrypted outbox payload and is erased after successful or terminal processing; it cannot be reconstructed from its hash.
- Automatic retries for one outbox job reuse the same encrypted link and provider idempotency key. They are retries, not resends, and do not rotate the token.
- UI warns before manual resend that older emails will stop working. Explicit revoke does not send a replacement.

### Collaborator invitation tokens

- Expire seven days after issue, are single-use, require a signed-in user with a verified normalized matching email, and are stored only as hashes.
- Acceptance creates membership and consumes the token in one transaction. Duplicate membership is not created.
- A manual resend rotates/revokes the old pending token and restarts the seven-day lifetime. The same 5-minute/3-per-day recipient cooldown applies.

### Response changes and organizer correction

- Guests may replace accepted/declined responses until the RSVP deadline while the event is `planning` and the token is active. Declined party size is `0`; accepted size is `1..party_limit`.
- The deadline is inclusive through the configured instant. The server, not the browser clock, decides whether it is open.
- Owners and editors may correct `pending`, `accepted`, or `declined` responses in the planning workspace, including after the guest deadline, to record phone/in-person responses. Viewers cannot correct.
- Organizer corrections never bypass event capacity, party limit, event status, or optimistic version checks. They use the same event-row lock and attendance service as guest responses.
- Every correction records actor, prior/new response and party size, timestamp, and a safe reason code. It never copies dietary text into the audit log. A free-text internal correction note is deferred.
- No planning or RSVP mutation is permitted in `completed`, `cancelled`, or `archived`; the owner must explicitly reopen first.

### Worker retry policy

- Six total delivery attempts: initial attempt, then delays of approximately 1 minute, 5 minutes, 15 minutes, 1 hour, and 6 hours, with jitter.
- Retry network failures, timeouts, provider `429`, and provider `5xx`. Honor a valid provider retry time.
- Treat invalid recipient/domain/request errors as terminal. Surface sanitized status to the organizer; do not expose provider payloads or tokens.
- Lease jobs for a bounded interval, recover expired leases, recheck event/invitation activity before every send, and mark terminal after the sixth failed attempt.
- Use the outbox dedupe key as the Resend idempotency key. Provider retention of an idempotency key is not a substitute for internal sent state.
- Erase encrypted raw-link payload after sent or terminal state. Retain only safe delivery metadata according to the operational log policy.

## ADR-007: Supported currencies

**Status:** Decided

Only this allowlist is offered in the first release; every entry uses two decimal minor units:

`AUD`, `CAD`, `EUR`, `GBP`, `HKD`, `INR`, `MYR`, `NZD`, `PHP`, `SGD`, `THB`, `USD`.

Rules:

- API input is an uppercase ISO 4217 code from the allowlist. Unsupported codes fail validation.
- Store amounts in PostgreSQL `numeric(14,2)` and exchange decimal strings at API boundaries. Never use binary floating-point arithmetic for money.
- One event has one currency, displayed on every monetary form and total. No conversion or exchange-rate data is in scope.
- Currency becomes immutable after the first budget entry exists.
- Zero-decimal currencies such as JPY/KRW and three-decimal currencies such as BHD/KWD are deliberately excluded. Adding a currency later requires validation, formatting, test fixtures, and a decision-log update.

## ADR-008: Guest privacy, dietary access, and retention

**Status:** **Proposal — explicit user approval required before Phase 3 dietary access is shipped and before Phase 5 retention automation is enabled.** This is not recorded as user-approved.

### Proposed access policy

- A guest with a valid active token can read and replace dietary notes for only their own invitation party while RSVP writes are open.
- Owners and editors can read/update dietary notes because both roles manage guests and event execution. Viewers cannot access dietary notes in pages, APIs, exports, logs, summaries, or cached payloads.
- UI labels dietary notes as optional, explains that event planners can see them, and asks for food-related needs only. It must not solicit medical diagnoses.
- Audit metadata, request logs, analytics, email subject lines, and alerts never include dietary text. RSVP pages have no third-party analytics.

### Proposed 90-day minimization policy

- Retention age is measured from the event `ends_at` instant.
- Show an in-product notice when an event closes and send owner notices at 60 days and 83 days after event end (30 and 7 days before minimization). Notice delivery failure does not delay the published policy, but remains visible in the product.
- At 90 days, pseudonymize each guest name to a non-identifying placeholder, clear email and dietary notes, delete all guest invitation tokens, cancel pending guest mail where possible, and erase related encrypted outbox payloads. Keep response state and party size only for aggregate historical totals.
- A manually deleted guest is removed immediately with invitation rows and pending mail. Permanent event deletion cascades all event-owned guest and delivery data. Already delivered email cannot be recalled.
- Reopening or moving an event after its guest data has been minimized cannot restore deleted data. The UI must warn before a lifecycle/date action that would cross this condition.
- Provider-side email/event retention is governed by the selected Resend plan and contract and must be disclosed separately; application deletion cannot guarantee recall of provider or recipient copies.

### Approval question

Confirm or replace both of these before their implementation gates: (1) editors may access dietary notes while viewers may not; and (2) guest personal fields are minimized 90 days after event end with 30-day and 7-day owner notices.

This pending approval does not block Phase 1 foundation because Phase 1 stores neither guests nor dietary notes. It does block final Phase 3 access acceptance and Phase 5 retention enablement.

## Phase 1 blockers and prerequisites

### Unresolved decisions that block foundation implementation

None. The technical/provider defaults needed to build the foundation are selected.

### Missing external prerequisites (not claimed available)

- Clerk development application keys and webhook signing secret.
- Neon non-production project with isolated development and test databases/branches and runtime/migration URLs.
- Vercel project/account connection is useful in Phase 1 but can follow local foundation work.
- Resend, Upstash, Vercel Pro cron, verified sending domain, and their credentials are required later as detailed in [`provider-setup.md`](./provider-setup.md); they are not required to create the earliest local foundation.
- The user must review the provider data-processing/residency fit and the privacy proposal before production use.

## Recorded assumptions

- The first audience is compatible with a Singapore application/database region and US-hosted identity/email subprocessors, subject to the user's legal/privacy review.
- The initial load values are intentionally above expected ordinary use but are not public service guarantees.
- Provider prices, quotas, and SDK versions will be rechecked when accounts and dependencies are actually configured; no dependency version is selected in Phase 0.
- No credential, verified domain, paid subscription, provider integration, deployment, or performance result exists merely because it is documented here.

## ADR-009: Phase 1 foundation implementation choices

**Status:** Decided on November 1, 2026

- Use npm because the repository had no package-manager convention and npm 10 was available. Commit the generated lockfile.
- Pin Next.js 16.4, React 19.3, Clerk's compatible Next.js SDK, and stable Prisma ORM 7.10. Prisma ORM 8 was a release candidate and is not used for the foundation.
- Use Prisma's `prisma-client` generator with an explicit generated source path and the PostgreSQL driver adapter. Keep PostgreSQL 17 as the only development/integration database; there is no SQLite mode.
- Keep the application buildable without secrets. Missing Clerk configuration renders setup guidance and denies protected access; missing database configuration points the unopened client at an intentionally invalid local endpoint. No protected data path succeeds without real configuration.
- Reconcile the current Clerk user synchronously from the verified primary email and immutable subject. Signed webhooks provide idempotent eventual synchronization but are not trusted as a prerequisite for the user's first request.
- Run local development and test PostgreSQL on separate Docker ports/databases. Synthetic seed identities use `example.test`; they are not live Clerk accounts unless the operator explicitly supplies an isolated development subject.
- Phase 1 implements only event create/list/detail. Event planning module navigation is visibly unavailable rather than linking to unimplemented Phase 2 routes.
