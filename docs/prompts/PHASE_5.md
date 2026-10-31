As Senior Software Engineer, act as the Gatherly Release and Reliability agent for Phase 5.

Read applicable repository instructions first. Locate `PROJECT_DOCUMENTATION.md` and `DEVELOPMENT_PLAN.md` in `docs/` or the supplied documentation folder. Read both and all relevant decision records. These documents contain the full feature, data, API, permission, and acceptance requirements; this prompt supplements them.

If this is the first phase, establish a canonical `docs/` folder in the chosen application repository and copy the supplied documents and prompts there without deleting their originals. If the application repository cannot be determined, ask for its location while reviewing the available documents. For later phases, read `docs/handoffs/phase-4.md`, inspect the actual code and working-tree changes, and verify the prerequisite phase's completion evidence before dependent work. Reuse the same application and preserve unrelated changes.

Follow the Shared agent execution rules and Required handoff sections in the development plan. Implement the assigned work; do not stop at a proposed plan. Keep Next.js, TypeScript, PostgreSQL, and Prisma, and use existing decisions and conventions. Consult official documentation when dependency/API details need verification. Do not add deferred features or start the next phase.

Resolve routine reversible choices independently and record assumptions. If credentials or a material product decision are missing, explain the exact blocker, continue independent work, and report incomplete checks honestly. Never invent secrets or substitute a mock integration for verified provider behavior. Do not purchase services, send real guest invitations, push changes, or execute production actions without applicable user authorization.

## Assigned phase

Execute P5-01 through P5-10, observing the production execution boundary below.

Review the integrated application against the architecture and all earlier handoffs. Run the full acceptance suite for owners, editors, viewers, and guests; fix release-blocking defects. Review mobile and keyboard usability, target browsers, permission isolation, webhook validation, CSRF protection, token/cache/log handling, rate limits, and accidental secret exposure.

Implement the agreed retention job and organizer notice; test personal-data deletion and pending-mail cancellation. Validate performance with the recorded representative data and concurrency assumptions. Report measured results separately from targets.

Prepare production configuration instructions, pooling/worker setup, backup/monitoring configuration, migration rehearsal, isolated restore drill, and a compatible rollback/recovery procedure. Produce `docs/release-checklist.md`, `docs/operations-runbook.md`, and `docs/release-report.md`, plus updated user/setup/API documentation.

Complete all locally and in authorized staging environments before requesting production action. This prompt authorizes release preparation, not purchases, public deployment, production migrations, real guest mail, or destructive production changes. If the user has explicitly authorized a concrete production action in the session, carry it out within that scope; otherwise leave an exact reviewable release procedure and list only the required remaining actions.

After an authorized deployment, run controlled smoke tests with test recipients, remove synthetic data, and record actual deployment and operational results. Never mark checks run if infrastructure was unavailable.

Completion states: Ready for deployment when preparation checks pass but production execution is pending; Released only after authorized deployment and production smoke tests pass. If any mandatory readiness criterion is unresolved, report Partial or Blocked and list it. Production tasks remain unchecked until actually executed.

Before finishing:
1. Run the phase's required verification and fix failures within scope. Record actual commands/results and unrun checks with reasons.
2. Update only genuinely completed task and verification checkboxes in `docs/DEVELOPMENT_PLAN.md`.
3. Write `docs/handoffs/phase-5.md` using the plan's required handoff format, including repository state, changed files, migrations/configuration, decisions, results, blockers, and next-phase prerequisites.
4. Give a concise final report of delivered behavior, verification, status, and exact remaining user actions. Do not claim completion if mandatory checks are missing.
