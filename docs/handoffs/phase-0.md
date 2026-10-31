# Gatherly Phase 0 Handoff

Prepared: October 31, 2026

## Phase and status

- **Phase:** 0 — Preparation and product decisions
- **Status:** Complete
- **Completed task IDs:** P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07
- **Remaining Phase 0 task IDs:** None
- **Important qualification:** P0-05 is complete as a fully specified, reviewable privacy proposal because the Phase 0 request explicitly required unconfirmed privacy choices to remain proposals. User approval remains required before Phase 3 dietary-note access and Phase 5 retention automation.

All seven tasks have reviewable outputs, and no unresolved technical/provider decision prevents Phase 1 foundation implementation. Missing external access is recorded as a prerequisite rather than claimed available.

## Repository state

- **Repository:** `/Users/paulchristianargao/EventPlanning`
- **Branch:** `main`, tracking `origin/main`
- **HEAD at handoff preparation:** `8f471d4` (`new`)
- **Commit created:** None. The user did not request a commit or push.
- **Working tree:** Uncommitted `docs/` additions. The supplied `gatherly/` originals and unrelated tracked files were not modified.
- **Starting state:** No application source, package manifest, lockfile, migration, previous handoff, `AGENTS.md`, or prior decision record existed.

The repository root was selected as the application repository because it is the Git worktree root. The supplied `gatherly/` folder was treated as documentation source material, not as a separate application.

## Delivered behavior and review artifacts

Phase 0 delivers no runnable application behavior by design. It delivers the product/architecture baseline needed to build and verify later behavior:

- Confirmed first-release scope and explicit deferred scope.
- Detailed desktop/mobile layouts and state behavior for event list, dashboard, tasks, budget, guests, RSVP, schedule, and settings.
- Provider defaults and configuration ownership: Clerk, Resend, Vercel Pro, Neon Postgres, Upstash Redis, and one-minute Vercel Cron over the PostgreSQL outbox worker.
- Load/test assumptions, invitation throttles, representative staging data, and concurrency targets.
- Owner-only event transition matrix, including draft RSVP closure and restoration of every closed state to planning.
- Guest and collaborator token lifetimes, rotation/resend/cooldown rules, six-attempt delivery retry policy, guest response changes, and organizer correction rules.
- Two-decimal currency allowlist: `AUD`, `CAD`, `EUR`, `GBP`, `HKD`, `INR`, `MYR`, `NZD`, `PHP`, `SGD`, `THB`, `USD`.
- Proposed privacy/access/retention policy clearly marked as awaiting user approval.
- First-release acceptance gates and a prioritized backlog retaining the development-plan IDs.

## Major decisions

1. The first release remains a Next.js App Router/TypeScript modular monolith with PostgreSQL/Prisma, shared server-only services, a transactional email outbox, and no deferred vendor/payment/seating/real-time features.
2. Draft events allow authenticated planning but cannot send invitations or disclose/accept guest RSVP data.
3. Only owners change lifecycle state. Completed, cancelled, and archived events may be explicitly reopened/restored to planning; reopening never bypasses deadline, capacity, token, schedule-window, or version rules.
4. Guest tokens expire seven days after event end. A manual resend rotates the token because the raw value is irrecoverable after encrypted outbox payload erasure; automatic retries keep the same token/job.
5. Guests may replace responses through the server-evaluated deadline. Owners/editors may correct responses after that deadline while the event is planning, but never bypass capacity/party/version constraints.
6. Vercel Pro is the default hosting plan because its one-minute Cron capability meets the worker-start target; Hobby's once-daily Cron does not.
7. The proposed privacy default lets owners/editors—but not viewers—access optional dietary notes and minimizes guest personal fields 90 days after event end with 30-day and 7-day owner notices. This is not user-approved yet.

Full rationale and official provider references are in [`../decisions.md`](../decisions.md) and [`../provider-setup.md`](../provider-setup.md).

## Changed files

Canonical copies established without deleting originals:

- `docs/PROJECT_DOCUMENTATION.md`
- `docs/DEVELOPMENT_PLAN.md` — only P0-01 through P0-07 are checked
- `docs/prompts/PHASE_0.md`
- `docs/prompts/PHASE_1.md`
- `docs/prompts/PHASE_2.md`
- `docs/prompts/PHASE_3.md`
- `docs/prompts/PHASE_4.md`
- `docs/prompts/PHASE_5.md`

New Phase 0 artifacts:

- `docs/decisions.md`
- `docs/ui-flows.md`
- `docs/acceptance-checklist.md`
- `docs/provider-setup.md`
- `docs/backlog.md`
- `docs/handoffs/phase-0.md`

## Migrations, dependencies, and configuration

- **Database migrations:** None; no application/schema exists yet.
- **Dependencies or versions installed:** None; no package manager or lockfile exists yet.
- **Provider resources created:** None.
- **Secrets or credentials added:** None.
- **Deployment/production actions:** None.

Configuration names documented without values:

- Application: `APP_URL`, `NEXT_PUBLIC_APP_URL`
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET`, Clerk route/redirect keys
- PostgreSQL: `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `TEST_DATABASE_URL`
- Resend/outbox: `RESEND_API_KEY`, `RESEND_WEBHOOK_SIGNING_SECRET`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `OUTBOX_ENCRYPTION_KEY`
- Worker: `CRON_SECRET`, `WORKER_BATCH_SIZE`, `WORKER_LEASE_SECONDS`
- Upstash: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_NAMESPACE`
- Logging: `LOG_TOKEN_HASH_KEY`

## Verification results

All commands ran from `/Users/paulchristianargao/EventPlanning`.

### Passed

1. Canonical-copy, checkbox-scope, artifact, and required-section validation:

   ```sh
   set -euo pipefail
   cmp gatherly/PROJECT_DOCUMENTATION.md docs/PROJECT_DOCUMENTATION.md
   for source in gatherly/prompts/*.md; do cmp "$source" "docs/prompts/${source##*/}"; done
   # Count/check only P0-01..P0-07 as completed, assert required files/sections.
   ```

   Result: project documentation and every prompt match their supplied originals; exactly seven development-plan task boxes are checked and all are Phase 0; all required artifacts/provider/lifecycle/currency/privacy/UI sections are present.

2. Development-plan copy scope and Markdown trailing whitespace:

   ```sh
   cmp gatherly/DEVELOPMENT_PLAN.md \
     <(sed 's/^- \[x\] \(P0-0[1-7] \)/- [ ] \1/' docs/DEVELOPMENT_PLAN.md)
   test -z "$(rg -n '[[:blank:]]+$' docs || true)"
   ```

   Result: canonical plan differs from the supplied plan only by the seven completed P0 checkboxes; no trailing whitespace remains.

3. Local Markdown target and heading-fragment validation:

   ```sh
   ruby -e '<scan docs/**/*.md local links; assert target files and heading anchors exist>'
   ```

   Result: all local Markdown file targets and referenced heading anchors resolve. Preliminary checker-development attempts had Ruby compatibility/syntax errors, then correctly identified this handoff as the only not-yet-created target; the corrected final checker passed after the handoff existed.

4. Repository inspection:

   ```sh
   git status --short --branch
   find docs -maxdepth 3 -type f -print | sort
   ```

   Result at preparation time: branch `main` at `8f471d4`; only the new uncommitted `docs/` tree is reported.

### Not run, with reasons

- Application lint, formatting tool, TypeScript check, unit tests, PostgreSQL integration tests, Playwright/browser checks, and production build: no application, package manifest, dependencies, database schema, or test suite exists in Phase 0.
- Migrations/seed verification: no migrations or seed exist yet.
- Live Clerk, Neon, Resend, Upstash, Vercel, domain, email, webhook, or scheduled-worker smoke checks: accounts/credentials/resources were not supplied, and Phase 0 does not authorize purchases, deployment, production actions, or real invitation sends.
- Performance/load results: Phase 0 defines assumptions only; measurement belongs to the implementation and Phase 5 load exercise.

No check is represented as passing when it was not run.

## Setup and review instructions

There is no application to run yet. Review Phase 0 in this order:

1. [`../decisions.md`](../decisions.md) for scope, providers, loads, lifecycle, invitation/currency policy, and the privacy proposal.
2. [`../ui-flows.md`](../ui-flows.md) for responsive layouts, states, and role behavior.
3. [`../provider-setup.md`](../provider-setup.md) for account ownership, configuration keys, costs, and phase gates.
4. [`../acceptance-checklist.md`](../acceptance-checklist.md) for future evidence gates.
5. [`../backlog.md`](../backlog.md) for the authorized sequence; do not start Phase 2 before Phase 1 evidence passes.

Phase 1 should initialize the application at this Git repository root and preserve `docs/` and the supplied `gatherly/` source folder.

## Known issues and blockers

### Phase 0 blockers

None.

### Known limitations / pending decisions

- Privacy proposal approval is pending. It does not block Phase 1, but dietary access cannot pass Phase 3 acceptance and retention automation cannot be enabled in Phase 5 until approved or replaced.
- Provider pricing/quotas are time-sensitive and must be rechecked before purchase.
- Clerk currently has US-hosted identity data without customer region selection; the user must confirm this is acceptable for the intended audience before production.
- No provider credential or verified integration is available, so Phase 1 integrated identity/database acceptance remains prerequisite-dependent.

## Phase 1 prerequisites and remaining user actions

Required for Phase 1 integrated completion:

1. Create/designate a Clerk development application and securely supply the publishable key, server secret, and webhook signing secret.
2. Create/designate a Neon non-production project with isolated development/test targets and securely supply runtime, migration, and test URLs.
3. Confirm the selected providers' residency/data-processing posture is acceptable for the intended users.

Required later, not before the earliest Phase 1 local work:

4. Confirm or replace the proposed dietary-note and 90-day guest-data policy before its Phase 3/5 gates.
5. Set up Vercel Pro one-minute Cron, Resend account/verified sending subdomain/quota, and Upstash staging resources before Phase 3 staging acceptance.
6. Do not paste secrets into chat or commit them. Use the local/provider secret store and a committed empty `.env.example` in Phase 1.

No purchase, deployment, push, or real guest invitation was performed.
