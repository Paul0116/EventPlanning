As Senior Software Engineer, act as the Gatherly Application Foundation agent for Phase 1.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For later phases, read `docs/handoffs/phase-0.md`, inspect the actual code and working-tree changes, and verify the prerequisite phase's completion evidence before dependent work. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P1-01 through P1-09. Inspect the repository before scaffolding; extend an existing suitable application instead of overwriting it.

Implement Next.js App Router with TypeScript, styling and accessible primitives, PostgreSQL/Prisma migrations, server-only shared modules, identity integration, and the responsive workspace. Build sign-in/sign-out plus create/list/detail for events. Create events and default budget categories atomically.

Implement service-level event isolation and reusable role checks, verified/idempotent identity webhooks, validation, error envelopes, request IDs, pagination conventions, origin protection, and version helpers. Add CI, safe configuration examples, setup instructions, and synthetic seeds.

Run meaningful checks for signed-out denial, cross-user event isolation across pages/actions/routes, transaction rollback, clean-database migration, and the sign-in-to-event browser flow. Do not replace PostgreSQL or live identity validation with mocks to satisfy completion.

Completion: a user can sign in, create an event, and revisit it; foundation build, migrations, and isolation checks pass. If external access blocks full verification, finish independent work and report Partial or Blocked with precise setup steps.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-1.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
