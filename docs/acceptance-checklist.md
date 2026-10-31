# Gatherly Acceptance Checklist

Prepared: October 31, 2026

Status: Phase 0 preparation acceptance is recorded here; application acceptance remains unchecked until implemented and verified

Checkboxes are evidence gates, not aspirations. A checked Phase 0 item means the reviewable rule/artifact exists, not that later application behavior has been built.

## Phase 0 preparation acceptance

- [x] P0-01 first-release accounts, events, tasks, budgets, guests, RSVPs, collaborators, and schedule are included; vendor booking, payments, seating, and real-time editing are explicitly deferred.
- [x] P0-02 mobile and desktop layouts exist for event list, dashboard, tasks, budget, guests, RSVP, schedule, and settings.
- [x] P0-02 empty, loading, recoverable-error, conflict, read-only, and permission-denied/not-found behavior is specified.
- [x] P0-03 identity, email, hosting, PostgreSQL, shared rate limiting, and worker-trigger providers have concrete defaults, official references, ownership, configuration, and cost implications.
- [x] P0-04 initial organizer/event data sizes, concurrent RSVP load, invitation limits, and a synthetic staging fixture are documented as assumptions rather than measured capacity.
- [x] P0-05 dietary access, notices, minimization, deletion behavior, and provider-retention caveats are specified as an explicit proposal awaiting user approval.
- [x] P0-06 all event states, owner-only transitions, draft RSVP behavior, closed-state reopening, and archive restoration are specified.
- [x] P0-07 guest/member token lifetime, resend/rotation, cooldown, worker retry, response-change, organizer-correction, and supported currency policies are specified.
- [x] Canonical documents and prompts exist under `docs/`; supplied originals under `gatherly/` remain present.
- [x] The prioritized backlog uses development-plan IDs and does not start Phase 1 work.
- [x] No unresolved provider or technical decision prevents Phase 1 foundation implementation.
- [x] Missing credentials, paid plans, and privacy confirmation are reported without claiming availability or approval.

## Phase 0 core-flow review

These are document walk-through checks, not browser results:

- [x] Sign-in leads to the authorized event list and event creation.
- [x] Event creation ends in `draft`, where organizers may plan but cannot send invitations or accept RSVP responses.
- [x] The owner moves an event to `planning`; role-based tasks, budget, guests, schedule, and settings flows are defined.
- [x] A guest invitation is durably queued, the private link reads only one party, and `GET`/preview never writes a response.
- [x] A valid guest may accept/decline and replace the response until the deadline; party size, capacity, token, version, and event state are all server rules.
- [x] Owners/editors may correct responses without bypassing capacity or closed-state rules; viewers may not.
- [x] Closing states reject planning and RSVP writes; owner-only restoration goes to `planning` without bypassing other restrictions.
- [x] Dashboard metrics distinguish accepted people from invitation-party response counts.

## First-release application acceptance — future evidence required

### Accounts and isolation

- [ ] Signed-out visitors cannot read workspace data or invoke protected mutations.
- [ ] Sessions are verified through Clerk and mapped by immutable subject; verified email is used only where the workflow requires it.
- [ ] User A cannot read or mutate User B's event or child records by changing page, action, or API identifiers.
- [ ] Inaccessible event resources return a generic not-found response; role insufficiency inside an accessible event returns the documented forbidden/read-only behavior.
- [ ] Identity webhooks have valid-signature, replay, duplicate, out-of-order, and invalid-signature evidence.

### Permissions

- [ ] Owner/editor/viewer behavior matches the documented matrix at UI, Server Action, Route Handler, and service boundaries.
- [ ] Viewers cannot write; editors cannot manage collaborators, permanently delete the event, or change lifecycle state.
- [ ] Revoked membership fails immediately, and member removal/unassignment is atomic under concurrency.
- [ ] Dietary notes are not implemented until the proposed access policy is approved or replaced; afterward, guest/owner/editor/viewer access matches that decision everywhere.

### Events and lifecycle

- [ ] Event end is after start; RSVP deadline is no later than start; IANA time zone is stored separately from timestamps.
- [ ] Draft events cannot send invitations or serve guest details through RSVP tokens.
- [ ] Only owner transitions in the allowed matrix succeed; all other edges fail.
- [ ] Completed/cancelled/archived events reject planning and RSVP mutations.
- [ ] Reopen/restore returns to planning, increments version, audits safely, and does not bypass deadline/token/capacity rules.
- [ ] Permanent deletion requires deliberate owner confirmation and removes event-owned guest/delivery data transactionally.

### Tasks and concurrency

- [ ] Authorized task create/update/delete, filtering, priority, status, due date, and assignment work on mobile and desktop.
- [ ] Cross-event task references and unauthorized assignments fail.
- [ ] A stale task or event version returns `409`, preserves the newer value, and presents a useful review/retry flow.

### Budget

- [ ] All accepted currencies are in the allowlist and unsupported/zero-/three-decimal codes are rejected.
- [ ] Money uses exact `numeric(14,2)` storage and decimal strings at API boundaries; totals are exact beyond one page.
- [ ] Negative values and cross-event category references fail, including at the database boundary.
- [ ] Currency becomes immutable after a budget entry exists; deleting a non-empty category fails.
- [ ] Target, estimate, actual, paid/unpaid, remaining target, and overspend states are correct, including empty data.

### Guests, invitations, and RSVP

- [ ] Guest invitation records use at least 32 random bytes, retain only token hashes, and enforce one active token per party.
- [ ] Raw links exist only in encrypted outbox payloads and are erased after sent/terminal state.
- [ ] Manual resend observes cooldown/limits, rotates the token, revokes prior links, and warns the organizer.
- [ ] Guest `GET`, preview, link scanners, and repeated delivery cannot submit or duplicate a response.
- [ ] Accepted size is `1..party_limit`; declined/pending size is `0`; repeated submission replaces one response.
- [ ] Deadline is server-enforced; expired/revoked/unknown tokens reveal no guest or event data.
- [ ] Two concurrent responses cannot exceed capacity, including organizer corrections and capacity reductions.
- [ ] Organizer corrections use the same locked attendance service and create safe audit metadata without dietary text.
- [ ] Guest invitations expire seven days after event end; event-date changes do not silently extend existing token expiry.

### Email outbox and worker

- [ ] Invitation/token and encrypted outbox job commit atomically with a unique dedupe key.
- [ ] Due rows are leased with `FOR UPDATE SKIP LOCKED`; expired leases recover after a simulated crash.
- [ ] Worker sends outside the lease transaction, rechecks invitation/event activity, and is safe under duplicate cron invocation.
- [ ] Retryable failures follow the six-attempt backoff policy; terminal failures become visible and sanitized.
- [ ] Provider idempotency reduces duplicates without replacing internal delivery state.
- [ ] Signed Resend webhook replay/duplicate/invalid-signature cases are verified in staging.

### Collaboration and schedule

- [ ] Collaborator tokens expire after seven days, are hashed and single-use, and require a verified matching signed-in email.
- [ ] Acceptance creates membership and consumes the token atomically; duplicate/wrong-email/revoked/expired acceptance fails safely.
- [ ] Schedule items fit the event window, display in the event time zone, and may overlap.
- [ ] Event-window edits that would strand schedule items fail with actionable guidance.
- [ ] Equal-time manual ordering is stable and version conflicts do not silently overwrite another editor.

### Security and privacy

- [ ] RSVP responses are `no-store`, `noindex`, `no-referrer`; private token routes omit third-party analytics.
- [ ] Raw tokens, invitation URLs, emails bodies, and dietary notes are absent from logs, request IDs, audits, alerts, and browser bundles.
- [ ] Cookie-authenticated mutations verify origin and use the selected session framework's CSRF protections.
- [ ] Shared rate limits work across instances and return `429` with a retry time; process-local counters are not the sole control.
- [ ] Request body sizes, allowlisted sort/filter values, pagination limits, and Zod validation are enforced.
- [ ] Approved retention automation gives the documented notices, minimizes the specified fields at day 90, and is idempotent.
- [ ] Manual guest/event deletion removes relevant sensitive data and cancels pending mail where possible.

### UX and accessibility

- [ ] Required screens work at mobile and desktop widths without hidden actions or horizontal mini-tables.
- [ ] Keyboard-only flows cover sign-in, event creation, task/budget mutations, invitation, RSVP, collaborator acceptance, and schedule editing.
- [ ] Focus management, labels, error summaries, status announcements, contrast, and 44-pixel touch targets pass review.
- [ ] Empty/loading/error/conflict/read-only states match [`ui-flows.md`](./ui-flows.md).
- [ ] Event time zone and currency are visible at every relevant input and total.

### Operations and release

- [ ] Lint, formatting, type checks, unit tests, PostgreSQL integration tests, browser tests, and production build pass in CI.
- [ ] Migrations apply to an empty database and are rehearsed against a staging copy.
- [ ] Backup restoration into an isolated database and outbox worker recovery are demonstrated.
- [ ] Representative load is measured against the assumptions; results, bottlenecks, and tuning are recorded rather than inferred.
- [ ] Monitoring covers errors, latency, authorization failures, database connections, queue age, and delivery failures without sensitive payloads.
- [ ] Production smoke testing is reported only after an explicitly authorized deployment using controlled test recipients.

## Phase 0 verification record

The definitive command/output summary is also in [`handoffs/phase-0.md`](./handoffs/phase-0.md). It is populated only with checks actually run.

| Check | Result |
|---|---|
| Canonical copy parity with supplied docs/prompts | Pass: project document and all prompts match; plan differs only by the seven completed P0 checkboxes |
| Required Phase 0 artifact/section/link validation | Pass: required artifacts/sections exist and all local file/heading links resolve |
| Markdown whitespace/link hygiene | Pass: no trailing whitespace; local target/anchor checker passed |
| Application lint/type/unit/integration/browser/build | Not run: no application or dependencies exist in Phase 0 |
| Live Clerk/Neon/Resend/Upstash/Vercel integration | Not run: credentials/accounts are not available and Phase 0 performs no production action |
