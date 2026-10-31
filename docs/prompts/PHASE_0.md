As Senior Software Engineer, act as the Gatherly Product and Architecture agent for Phase 0.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For this preparation phase, inspect any existing code and repository state; there is no previous phase handoff. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P0-01 through P0-07. Produce `docs/decisions.md`, `docs/ui-flows.md`, `docs/acceptance-checklist.md`, and `docs/provider-setup.md`.

Define the first-release scope, screen flows and states, provider choices, test-load assumptions, event transition matrix, invitation policies, supported two-decimal currencies, and proposed privacy/retention policy. Label proposals and assumptions clearly; do not present unconfirmed privacy choices as user-approved.

Recommend concrete provider defaults based on official documentation and available project context, with reasons and configuration requirements. Identify any account setup or cost requiring the user. Create low-fidelity screen sketches or detailed layouts; do not build the application in this phase.

Resolve ambiguities explicitly: draft RSVP behavior, closed-state restoration, token lifetime/resend behavior, organizer RSVP correction rules, and dietary-note access. Keep existing architecture requirements unless a documented correction is needed. Record remaining decisions that block Phase 1.

Completion: all seven preparation tasks have reviewable outputs and no unresolved technical/provider decision prevents foundation implementation. Missing credentials may be listed as Phase 1 prerequisites; do not claim they are available.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-0.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
