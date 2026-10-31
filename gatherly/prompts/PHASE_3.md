As Senior Software Engineer, act as the Gatherly Guest Invitations and RSVP agent for Phase 3.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For later phases, read `docs/handoffs/phase-2.md`, inspect the actual code and working-tree changes, and verify the prerequisite phase's completion evidence before dependent work. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P3-01 through P3-09 on the verified planning application.

Implement guest parties, private invitation tokens, encrypted transactional email outbox, scheduled worker, guest management screens, RSVP page/API, and guest dashboard metrics. Reuse the established architecture and providers.

Generate cryptographically strong tokens, store only hashes in invitation records, enforce expiry/revocation/rotation and one active token per guest, and preserve composite event/guest integrity. Raw links may exist only in the restricted encrypted delivery payload; erase that payload after delivery or terminal failure.

Queue invitation and mail atomically. Implement leased worker jobs, expired-lease recovery, retries/backoff, deduplication, current-invitation checks, shared send limits, and visible terminal failures. Use synthetic/test recipients; real guest sending requires explicit authorization.

Centralize capacity-affecting operations in one transactional attendance service. RSVP, organizer corrections, guest deletion or party-size changes, and event capacity edits must use the same event-row locking strategy. Validate token, deadline, lifecycle, party limits, capacity, and record version within the transaction.

Make GET read-only. Add private caching, noindex, referrer protection, shared rate limits, and token/log redaction. Prevent third-party analytics on private invitations. Show only the token holder's party details.

Verify concurrent last-place requests, repeated responses, guest privacy, expired/revoked tokens, closure/deadline races, and worker crash/retry behavior against real PostgreSQL. Validate the email-to-RSVP flow in staging with the real configured integration.

Completion: reliable private invitations and responses work end to end, accepted people never exceed capacity, and failure/recovery tests pass. Distinguish provider integration not exercised from passing mocked tests.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-3.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
