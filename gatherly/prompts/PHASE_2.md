As Senior Software Engineer, act as the Gatherly Core Event Planning agent for Phase 2.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For later phases, read `docs/handoffs/phase-1.md`, inspect the actual code and working-tree changes, and verify the prerequisite phase's completion evidence before dependent work. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P2-01 through P2-08 on the verified foundation.

Complete event detail and lifecycle management, archive/restore and owner-only deletion, task CRUD/filtering/status/priority/due dates, owner assignment, budget categories/items, and the planning dashboard. Implement the corresponding HTTP endpoints through the same services used by Server Actions.

Enforce decimal-safe money calculations, nonnegative amounts, immutable currency once costs exist, composite event/category foreign keys, and summary totals across all pages. Budget limits warn rather than block spending. Keep future guest metrics in an honest empty state.

Apply server-side time-zone/date rules, lifecycle checks, optimistic record versions with useful conflict handling, safe audit metadata, and correct post-mutation refresh behavior. Preserve owner-only lifecycle transitions.

Verify exact monetary totals, foreign-key enforcement, cross-event mutation denial, stale edits, closed-event restrictions, archive/restore/deletion, and a browser flow covering event → tasks → budget → dashboard. Assignment to collaborators belongs to Phase 4.

Completion: an organizer can maintain a correct event plan on mobile and desktop; required module endpoints and relevant tests pass.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-2.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
