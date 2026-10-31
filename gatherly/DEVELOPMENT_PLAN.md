# Gatherly — AI Agent Development Plan

Prepared: October 31, 2026 · Status: planned; implementation has not started

Companion document: [Product documentation and architecture](./PROJECT_DOCUMENTATION.md).

## Delivery approach

Build Gatherly with Next.js App Router, TypeScript, PostgreSQL, and Prisma. Deliver complete user workflows in small increments: database migration, authorized service, UI, HTTP contract, and relevant verification together. Server Actions and Route Handlers share the same business services.

Run one implementation agent per phase, sequentially, against the same repository. Each agent inherits the verified code and written handoff from the previous phase. The user coordinates the agents; this document does not start agents or authorize production deployment.

| Phase | Agent responsibility | Copy-ready prompt | Prerequisite |
|---|---|---|---|
| 0. Preparation | Product and architecture agent | [Phase 0 prompt](./prompts/PHASE_0.md) | Architecture document |
| 1. Foundation | Application foundation agent | [Phase 1 prompt](./prompts/PHASE_1.md) | Phase 0 complete |
| 2. Core planning | Event planning agent | [Phase 2 prompt](./prompts/PHASE_2.md) | Phase 1 complete |
| 3. Guests and invitations | Invitation and RSVP agent | [Phase 3 prompt](./prompts/PHASE_3.md) | Phase 2 complete |
| 4. Collaboration and schedule | Collaboration agent | [Phase 4 prompt](./prompts/PHASE_4.md) | Phase 3 complete |
| 5. Launch preparation | Release and reliability agent | [Phase 5 prompt](./prompts/PHASE_5.md) | Phase 4 complete |

AI execution time is not estimated from human developer days. Track verified tasks, integration availability, and remaining work instead. Provider setup, database access, and product decisions can still require user involvement.

### How to use the prompts

1. Put this plan and `PROJECT_DOCUMENTATION.md` in the application repository under `docs/`. Keep `prompts/` beside them. If starting in this folder, the first agent may copy these files into the chosen repository and record that location.
2. Open an agent chat with access to that repository and paste the complete matching prompt file. Start with Phase 0.
3. Let the agent inspect existing work and execute only its assigned phase. A phase can take multiple turns; resume the same phase until its checks pass.
4. Review the phase handoff and actual verification results. Start the next phase only after prerequisite checks pass. A written claim of completion alone is insufficient.
5. Keep all agents on the same evolving application. Do not initialize a separate application or replace previous work for each phase.

### Shared agent execution rules

- Read applicable repository instructions, architecture, this plan, decision records, and the previous handoff before editing. Inspect repository status and preserve unrelated user changes.
- Implement the assigned phase, including its database, service, UI, API, and verification work. Avoid adding deferred features or rewriting working modules without a concrete need.
- Follow existing decisions. Resolve routine reversible choices independently and record assumptions. Ask concise questions only when missing information materially blocks correct work; continue independent tasks in the meantime.
- Use the repository's package manager and lockfile. Consult official documentation when choosing or integrating dependencies; record versions actually installed.
- Keep PostgreSQL as the integration-test database. Mocks are useful at external service boundaries but do not prove identity, email, database, or deployment integration works.
- Never fabricate credentials, successful checks, deployments, or completed tasks. Report failed and unrun checks separately. Do not weaken tests to hide failures.
- Use synthetic data and test recipients. Do not send real guest invitations, make purchases, modify production data, or deploy publicly without explicit user authorization for that action. Prepare all reviewable release work first.
- Update task checkboxes only with supporting evidence. If blocked, document the exact blocker and completed independent work; do not pass an incomplete prerequisite to the next phase.

### Required handoff from every agent

Write `docs/handoffs/phase-N.md` and update `docs/DEVELOPMENT_PLAN.md`. If documentation has not yet moved into the repository, establish that structure first and record the source location.

Each handoff must include:

- Phase number and status: Complete, Partial, or Blocked; task IDs completed and remaining.
- Repository/branch and exact commit if committed; otherwise explicitly state uncommitted changes and relevant files. Do not commit or push unless the user's workflow authorizes it.
- User-visible behavior delivered, major implementation decisions, changed files, migrations, and configuration keys without values.
- Actual verification commands and pass/fail results, plus checks not run and why. Include browser evidence where available.
- Setup/run instructions, known issues, prerequisites for the next phase, and any remaining user actions.

Phase 5 reports **Ready for deployment** if production execution is not authorized or available. It reports **Released** only after an actual authorized deployment and smoke test. Do not confuse readiness with a live release.

Do not start a dependent phase until its entry requirements are met. Testing and accessibility work happen throughout development; Phase 5 verifies the whole release.

## Phase 0 — Preparation and product decisions

**Goal:** Remove uncertainty that would cause rework in implementation.

### Tasks

- [ ] P0-01 Confirm first-release scope: accounts, events, tasks, budgets, guests, RSVPs, collaborators, and schedule. Keep vendor booking, payments, seating plans, and real-time editing outside this release.
- [ ] P0-02 Sketch mobile and desktop screens for the event list, dashboard, task list, budget, guests, RSVP, schedule, and settings. Include empty, loading, error, and permission-denied states.
- [ ] P0-03 Select identity, email, hosting, managed PostgreSQL, shared rate limiting, and scheduled worker services. Record choices and configuration ownership in an architecture decision log.
- [ ] P0-04 Define initial load assumptions: events per organizer, guests per event, concurrent RSVP submissions, invitation send limits, and data volume for staging tests.
- [ ] P0-05 Finalize privacy decisions: dietary-note visibility, retention period, organizer notice, and deletion behavior. The architecture proposes 90 days after event end; treat this as a proposal until agreed.
- [ ] P0-06 Write the event transition matrix. Define draft visibility/RSVP behavior, allowed reopening transitions, and archive restoration. Preserve owner-only status changes and the architecture's closed-state restrictions.
- [ ] P0-07 Define invitation lifetime, resend cooldown, retry limits, and whether attendees may change responses until the deadline. Confirm only supported two-decimal currencies are offered in this release.

### Deliverables

Screen sketches, decision log, finalized event-state rules, acceptance checklist, provider configuration checklist, and prioritized backlog with the IDs in this plan.

### Completion criteria

The core flows can be walked through from sign-in to event planning and guest response. No unresolved provider choice blocks Phase 1. Credentials are supplied securely when needed; the decision log records names and configuration keys, never secret values.

## Phase 1 — Foundation and isolated workspace

**Entry:** Phase 0 decisions and identity/database development access are available.

**Goal:** Establish a working application with authentication and reliable event access boundaries.

### Tasks

- [ ] P1-01 Initialize Next.js, TypeScript, styling, accessible UI primitives, formatting, linting, and a dependency lockfile. Use compatible supported versions selected during setup.
- [ ] P1-02 Establish feature folders and shared server-only database, session, permission, validation, error, and logging modules.
- [ ] P1-03 Configure development and test PostgreSQL databases. Add Prisma and initial migrations for users, events, memberships, default budget categories, and audit records, including constraints and indexes.
- [ ] P1-04 Integrate sign-in, sign-out, verified identity, local user mapping, and profile display. Verify identity webhooks and make repeated deliveries safe.
- [ ] P1-05 Implement a minimal event create/list/detail workflow. Create the event and its default budget categories in one transaction.
- [ ] P1-06 Enforce owner/member access in services. Define reusable role checks for later editor/viewer workflows; do not depend on navigation guards for security.
- [ ] P1-07 Add request IDs, consistent error responses, server-side validation, pagination conventions, mutation origin protection, and version-based update helpers.
- [ ] P1-08 Build the responsive workspace shell, event navigation, and shared form/table/dialog patterns with keyboard and focus behavior.
- [ ] P1-09 Add CI checks for lint, types, tests, and production build. Provide a safe environment-variable example and synthetic development seed data.

### Verification

- [ ] A signed-out visitor cannot access workspace data or protected mutations.
- [ ] Organizer A cannot read Organizer B's event through a page, action, or HTTP route, including by changing IDs.
- [ ] Event/category creation rolls back together on failure; migrations apply to an empty test database.
- [ ] Sign-in, event creation, event list, and event detail work in a browser test.
- [ ] No credentials or private data appear in browser bundles or logs.

### Completion criteria

A new user can sign in, create an event, and return to it after signing in again. The foundation builds successfully and isolation tests pass against PostgreSQL.

**Milestone:** Protected application foundation ready.

## Phase 2 — Core event planning

**Entry:** Foundation and event isolation checks pass.

**Goal:** An organizer can manage a usable event plan before guest invitations are enabled.

### Tasks

- [ ] P2-01 Complete event details, venue text, time zone, dates, currency, capacity, budget limit, and RSVP deadline forms. Implement the agreed lifecycle transitions, archive/restore, and owner-only permanent deletion.
- [ ] P2-02 Add task migrations, services, actions/routes, and screens. Support status, priority, due date, filtering, and assignment to the owner; collaborator selection arrives in Phase 4.
- [ ] P2-03 Add budget item persistence and category management. Enforce composite category/event references and nonnegative decimal amounts. Reject deletion of nonempty categories.
- [ ] P2-04 Display estimated total, actual total, remaining target budget, paid/unpaid entries, and overspend warnings. Keep currency immutable once cost entries exist.
- [ ] P2-05 Build the dashboard with task progress, upcoming tasks, and budget totals. Reserve a clear empty state for guest metrics until Phase 3.
- [ ] P2-06 Complete the event/task/budget HTTP endpoints in the architecture. Ensure page actions and HTTP routes share validation and authorization.
- [ ] P2-07 Apply optimistic version checks to mutable records and show a useful refresh/retry message for conflicting edits. Refresh affected dashboard data after successful writes.
- [ ] P2-08 Add audit events for important planning changes using safe metadata. Verify lifecycle restrictions consistently across modules.

### Verification

- [ ] Exact budget totals remain correct with decimal inputs and large lists; totals are not limited to a paginated page.
- [ ] Cross-event task and budget mutations fail; mismatched event/category foreign keys fail at database level.
- [ ] Invalid dates, unsupported currencies, negative amounts, and stale versions produce clear errors.
- [ ] Completed/cancelled/archived events reject planning changes; permitted owner lifecycle actions still work.
- [ ] A browser flow creates an event, adds/completes tasks, records costs, and confirms updated dashboard values.
- [ ] Archive, restore, and permanent deletion behave as documented.

### Completion criteria

An organizer can maintain event details, a checklist, and an accurate budget on mobile and desktop. Required endpoints are implemented and core planning tests pass.

**Milestone:** Organizer planning alpha ready.

## Phase 3 — Guests, email invitations, and RSVP

**Entry:** Core planning is stable; email provider and worker environment are available.

**Goal:** Organizers can invite guests and receive reliable responses without guest accounts.

### Tasks

- [ ] P3-01 Add guest-party records, invitation records, constraints, indexes, and guest list CRUD screens. Support party limits, response filters, and optional dietary notes.
- [ ] P3-02 Implement token generation, hashing, expiry, rotation, and revocation. Use composite event/guest references and at most one active token per party.
- [ ] P3-03 Add an encrypted transactional email outbox. Insert invitation and delivery job together; implement deduplication, send throttling, and visible queued/failed delivery states.
- [ ] P3-04 Build the scheduled worker with database leases, expired-lease recovery, retry/backoff, terminal failure handling, invitation activity checks, and payload removal after processing.
- [ ] P3-05 Build the private RSVP page and token-authorized read/update API. Include event details, accepted/declined response, party size, optional dietary notes, and confirmation.
- [ ] P3-06 Implement one transactional attendance service used by guest RSVP, organizer response corrections, guest deletion/party-size changes, and event capacity edits. Serialize capacity-affecting changes with the same event-row lock.
- [ ] P3-07 Check status, deadline, token validity, party size, available capacity, and record version inside the response transaction. Return a clear conflict when places are unavailable.
- [ ] P3-08 Apply shared rate limits, private cache rules, search-engine exclusion, referrer restrictions, and token redaction across app/hosting logs. Prevent external analytics on invitation pages.
- [ ] P3-09 Add dashboard totals for invitation parties, pending/declined parties, and accepted people. Provide invitation previews that do not submit or modify a response.

### Verification

- [ ] Guest email → private link → response → organizer dashboard works end to end.
- [ ] GET requests, email previews, and link scanners cannot submit responses.
- [ ] Repeated responses update one party without double-counting; expired/revoked tokens cannot reveal guest data.
- [ ] Concurrent responses for the last place cannot exceed capacity. Organizer corrections and capacity reductions follow the same rule.
- [ ] Deadline and event closure reject submissions even when a form was opened earlier.
- [ ] Worker retries transient failures, recovers crashed leases, and handles duplicate delivery safely.
- [ ] Terminal delivery failures are visible; resend rotates/reuses tokens only according to the chosen policy.

### Completion criteria

Invitations and RSVP work in staging using the real email integration. Capacity and worker recovery tests pass against PostgreSQL. Guest links expose only their own party's invitation data.

**Milestone:** Guest invitation beta ready.

## Phase 4 — Collaboration and event-day schedule

**Entry:** Durable invitation delivery and core planning are working.

**Goal:** Owners can share planning safely and publish an internal event-day agenda.

### Tasks

- [ ] P4-01 Add collaborator invitation persistence and owner-only invite/revoke controls, reusing the email outbox.
- [ ] P4-02 Implement single-use invitation acceptance for a signed-in user with a verified matching email. Consume the invitation and create membership in one transaction.
- [ ] P4-03 Add editor/viewer role management, membership lists, and immediate access revocation. Owner privileges continue to come from event ownership.
- [ ] P4-04 Enable task assignment to authorized members. Serialize membership removal and assignment validation so a removed member cannot retain a task through a race.
- [ ] P4-05 Add schedule migrations, CRUD services/routes, and a chronological agenda with optional manual ordering for equal-time items.
- [ ] P4-06 Validate schedule dates within the event window; permit overlapping activities. Reject event date edits that would strand schedule items outside the new window and explain how to resolve them.
- [ ] P4-07 Complete dashboard/navigation behavior for shared events and verify private-data visibility matches the finalized dietary-note policy.
- [ ] P4-08 Finish the API inventory and documentation for memberships, invitation acceptance, and schedule operations.

### Verification

- [ ] Owner invites editor and viewer; both can access the event with their assigned permissions.
- [ ] Viewer cannot write; editor cannot change roles, invite members, delete the event, or change owner-only event status.
- [ ] Wrong email, revoked invitation, duplicate acceptance, and expired invitation fail safely.
- [ ] Removing a member immediately denies access and unassigns tasks atomically, including under concurrent assignment attempts.
- [ ] Schedule times remain correct across event time zones and daylight-saving boundaries where relevant.
- [ ] Concurrent editor changes yield useful version conflicts instead of silent data loss.

### Completion criteria

The owner/editor/viewer permission matrix passes for every implemented module and entry point. A collaborator can accept an invitation, update an assigned task, and edit the agenda while a viewer remains read-only.

**Milestone:** First-release functionality complete.

## Phase 5 — Launch preparation and release

**Entry:** First-release features and integration checks pass in staging.

**Goal:** Release a verified application with a recoverable deployment and clear operating procedures.

### Tasks

- [ ] P5-01 Run the full acceptance checklist across owner, editor, viewer, and guest flows. Resolve release-blocking defects and document any accepted minor limitations.
- [ ] P5-02 Review mobile layouts, keyboard navigation, focus management, labels, errors, contrast, and empty/loading states. Check target browsers.
- [ ] P5-03 Review isolation, token handling, webhook verification, CSRF protection, rate limits, cache behavior, and log redaction. Check repository and built assets for accidental secrets.
- [ ] P5-04 Implement the agreed guest-data retention job and organizer notice. Verify guest/event deletion removes sensitive records and cancels pending mail where possible.
- [ ] P5-05 Exercise representative data volumes and concurrent RSVP traffic. Measure the architecture's page/API/worker targets, investigate failures, and tune indexes or queries based on evidence.
- [ ] P5-06 Configure production secrets, connection pooling, verified sending domain, worker schedule, backups, and monitoring. Verify alert destinations and avoid putting sensitive guest data in alerts.
- [ ] P5-07 Rehearse migrations on a staging copy and restore a backup into an isolated database. Document recovery steps and schema compatibility constraints for rollback.
- [ ] P5-08 Prepare setup instructions, deployment runbook, environment-variable reference, API examples, troubleshooting, retention procedures, and a short organizer guide.
- [ ] P5-09 Prepare deployment artifacts and an exact release procedure. When explicitly authorized, deploy reviewed migrations, application, and worker; run controlled production smoke tests using test recipients and remove synthetic data afterward. Otherwise mark production execution pending.
- [ ] P5-10 Monitor errors, latency, queue age, delivery failures, and database health during the initial operating period. Triage issues by user impact.

### Release completion criteria

- [ ] All mandatory architecture acceptance criteria have recorded evidence.
- [ ] No unresolved release-blocking authorization, data-loss, capacity, or delivery defects remain.
- [ ] Production smoke test covers sign-in, event creation, task/budget update, invitation, RSVP, and collaborator access.
- [ ] Backup restoration and worker recovery have been demonstrated.
- [ ] Monitoring, incident ownership, deployment/rollback instructions, and privacy behavior are documented.

**Milestone:** Ready for deployment; first release live and operationally verified only after authorized production execution.

## Work-item completion standard

A feature is complete when its required UI and HTTP contract work through the same authorized service, migrations and constraints are included, meaningful verification passes, and user-facing errors/loading/empty states are handled. Include keyboard/mobile checks where relevant and update documentation when behavior changes.

Each work item should record its responsible phase agent, status, dependency IDs, and evidence link in the plan or chosen tracker. Suggested statuses: Not started → In progress → Review → Verified → Done. Blocked items record the missing decision or dependency; do not count them as complete.

## Critical dependencies and risk responses

| Risk/dependency | Resolve by | Response |
|---|---|---|
| Identity/provider setup delays | Phase 0–1 | Use isolated development configuration; do not count mocked sign-in as integrated completion |
| Email domain verification and sending limits | Before Phase 3 staging acceptance | Configure early; use test recipients until sending is ready |
| Capacity races across different write paths | Phase 3 | Centralize attendance mutations and test competing transactions |
| Collaborator removal/assignment races | Phase 4 | Use a consistent transaction/locking strategy for both operations |
| Scope grows to vendor bookings or payments | Any phase | Track separately; revise estimates and architecture before inclusion |
| Large guest lists or invitation bursts | Phase 3 and 5 | Paginate, queue delivery, apply shared limits, test agreed peak load |
| Database migration or deployment failure | Phase 5 | Rehearse migrations, verify backup recovery, preserve rollback compatibility |

## Deferred roadmap

After launch, use observed demand to prioritize event templates, calendar integration, seating plans, attachments, vendor discovery, or payments. Give each addition its own requirements, data model changes, verification plan, and estimate before starting it. Do not include these in the first-release completion gate.

## Recommended starting sequence

Start with P0-01 through P0-07, then implement P1-01 through P1-05 as the first runnable milestone: sign in, create an event, and view it securely. Finish the remaining Phase 1 checks before building the planning modules.
