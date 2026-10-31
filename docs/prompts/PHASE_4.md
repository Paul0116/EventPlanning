As Senior Software Engineer, act as the Gatherly Collaboration and Schedule agent for Phase 4.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For later phases, read `docs/handoffs/phase-3.md`, inspect the actual code and working-tree changes, and verify the prerequisite phase's completion evidence before dependent work. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P4-01 through P4-08 on the verified invitation system.

Implement collaborator invitations using the existing email outbox, verified matching-email acceptance, editor/viewer membership management, immediate revocation, and shared-event navigation. Accept invitations and create membership atomically; tokens are expiring and single use. Owner authority derives from event ownership.

Enable task assignment to current authorized members. Coordinate removal and assignment transactionally so removal clears assignments and concurrent writes cannot reintroduce a removed assignee.

Implement schedule persistence, services, actions/routes, and a responsive chronological agenda. Validate schedule items inside the event window, permit overlaps, and reject event time edits that would leave existing items outside the new window. Display the event time zone clearly.

Finish API documentation and verify dietary-note visibility follows the recorded decision. Run the owner/editor/viewer permission matrix across all pages, actions, and routes; test expired/revoked/wrong-email invitations, duplicate acceptance, revocation races, stale edits, and relevant daylight-saving transitions.

Completion: owner invites an editor and viewer; editor updates an assigned task and schedule; viewer remains read-only; revocation removes access and clears assignments atomically. All first-release functionality is present and verified.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-4.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
