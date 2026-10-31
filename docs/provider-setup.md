# Gatherly Provider Setup and Configuration Checklist

Prepared: October 31, 2026

Status: provider defaults selected; no account, credential, domain, paid plan, or live integration is claimed to exist

This checklist names configuration keys but never secret values. Put secrets in the provider/environment secret store and local ignored environment files. Commit only an `.env.example` with empty placeholders during Phase 1.

## Ownership model

| Responsibility | Owner |
|---|---|
| Create organizations/accounts, accept terms, select paid plans, and own billing | User or designated organization administrator |
| Control domain/DNS and approve sender/identity records | User or designated DNS administrator |
| Generate and place environment-specific secrets | User/deployment administrator; never in chat, source, or screenshots |
| Implement SDKs, webhook verification, outbox, rate limits, and health checks | Phase implementation agent |
| Review privacy, residency, DPA, subprocessors, and legal fit | User/product owner with appropriate legal/privacy advice |
| Verify staging integrations with synthetic recipients | Phase implementation agent after credentials and explicit in-scope access are available |
| Production purchase, deployment, or real-recipient send | User authorization required |

## Recommended environment layout

| Environment | Identity/email/rate-limit resources | Database | Hosting |
|---|---|---|---|
| Local development | Clerk development instance; Resend test mode/recipients; development Upstash database | Neon non-production `development` branch/database or local PostgreSQL | Local Next.js |
| Automated integration | No live external sends; mocked provider boundaries only | Dedicated disposable Neon `test` branch/database or containerized PostgreSQL matching the supported server version | CI runner |
| Staging | Separate Clerk instance/config, verified staging sender where possible, separate Upstash database | Separate Neon staging project | Separate Vercel project whose production deployment represents staging, so cron can run |
| Production | Production provider instances and restricted credentials | Separate Neon production project | Vercel production project, single primary Functions region near database |

Never point a preview deployment at production credentials or production PostgreSQL.

## 1. Clerk identity

**Default:** Clerk with `@clerk/nextjs`; Gatherly application roles stay in PostgreSQL.

### User/account actions

- [ ] Create or designate the Gatherly Clerk organization and development application.
- [ ] Enable email sign-in and require verification. Decide whether password, email code, or email link is the initial sign-in experience; this is a presentation choice and does not change Gatherly authorization.
- [ ] Restrict dashboard membership to the project team and enable provider-account MFA.
- [ ] Create development and staging/production instances according to Clerk's environment model.
- [ ] Configure allowed application URLs and a signed webhook endpoint for user create/update/delete events.
- [ ] Review Clerk's US data hosting, DPA, subprocessors, session policy, and plan fit before production.
- [ ] If social login is enabled later, create production OAuth credentials; shared development OAuth credentials are not production credentials.

### Configuration keys

| Key | Secret | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Browser-safe Clerk application identifier |
| `CLERK_SECRET_KEY` | Yes | Server SDK/API authentication |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Yes | Verify raw webhook payload/signature |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | `/sign-in` route configuration |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Optional sign-up route if separate |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | No | Safe post-sign-in destination, normally `/events` |

Implementation requirements:

- Map Clerk's immutable subject to `users.auth_subject`; never authorize from email or client-supplied role.
- Verify webhook signatures over the raw body and make repeated/out-of-order deliveries safe.
- Create or reconcile the local user synchronously during an authenticated request when necessary; do not make first use depend on webhook timing.
- Protect data again inside every Server Action, Route Handler, and service. Clerk route middleware alone is insufficient.

Official references: [Next.js quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart), [webhooks](https://clerk.com/docs/guides/development/webhooks/overview), [production deployment](https://clerk.com/docs/guides/development/deployment/production), and [pricing](https://clerk.com/pricing).

## 2. Neon managed PostgreSQL

**Default:** Neon Postgres in AWS Singapore where offered, with pooled runtime connections and isolated databases/branches.

### User/account actions

- [ ] Create a non-production Neon project in the region closest to the selected Vercel Functions region.
- [ ] Create isolated `development` and `test` databases/branches. The test target must be disposable and must not contain real people.
- [ ] Provide separate pooled runtime and migration connection strings through the secret store.
- [ ] Before staging, create a separate staging project and set spend/usage alerts.
- [ ] Before production, create a separate production project, review paid-plan recovery/history/backup requirements, restrict team access, and set spend alerts.
- [ ] Document how the team will restore into an isolated target; the actual restore drill is Phase 5.

### Configuration keys

| Key | Secret | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | Pooled runtime PostgreSQL URL for Prisma |
| `MIGRATION_DATABASE_URL` | Yes | Reviewed Prisma migration connection; never exposed to browser/runtime clients |
| `TEST_DATABASE_URL` | Yes | Dedicated integration-test database URL |

The selected Prisma release may allow one pooled URL for migrations, but Gatherly keeps runtime and migration credentials distinct to follow least privilege and the architecture's operational separation.

Implementation requirements:

- Keep Prisma/database code on the Node.js runtime and in server-only modules.
- Size connection pooling for serverless concurrency and configure function/database regions together.
- Run migrations once from controlled CI/release work, not from every application instance at startup.
- Integration tests use real PostgreSQL constraints and transactions. SQLite is not an acceptable substitute.

Official references: [Neon pricing and recovery features](https://neon.com/pricing), [Prisma pooling support](https://neon.com/blog/better-postgres-with-prisma-experience), and [database branching](https://neon.com/branching).

## 3. Vercel hosting and scheduled trigger

**Default:** Vercel Pro, Node.js runtime, Singapore (`sin1`) primary Functions region, and a one-minute production Cron Job.

### User/account actions

- [ ] Create/designate the Vercel team and import this repository when deployment work is authorized.
- [ ] Select Pro before enabling the one-minute worker schedule. Hobby's once-daily minimum is insufficient.
- [ ] Choose the primary Functions region closest to Neon; start with one region for the single-primary transactional database.
- [ ] Configure separate preview/staging/production environment values and protect preview deployments.
- [ ] Set spend notifications/limits and billing ownership.
- [ ] Configure a custom domain before production, if desired. Domain purchase/transfer is not performed by an agent without explicit authorization.
- [ ] Create a separate staging Vercel project if staging needs an automatic cron; Vercel cron invokes only production deployments of a project.

### Configuration keys

| Key | Secret | Purpose |
|---|---:|---|
| `APP_URL` | No | Canonical server-side origin for links and origin validation |
| `NEXT_PUBLIC_APP_URL` | No | Browser-safe canonical origin where needed |
| `CRON_SECRET` | Yes | Authorize the scheduled worker Route Handler; use a high-entropy value |
| `WORKER_BATCH_SIZE` | No | Bounded lease batch; code has a safe default and upper bound |
| `WORKER_LEASE_SECONDS` | No | Bounded lease duration; code has a safe default and validation |

Implementation requirements:

- Add the one-minute schedule only when the outbox handler exists and staging/production execution is intended.
- Validate the cron authorization header/secret; do not trust user-agent alone.
- Vercel does not retry a failed cron invocation and may invoke more than once. PostgreSQL leases/dedupe and idempotent job processing are mandatory.
- Keep each invocation bounded by function duration; leave remaining due rows for the next minute.

Official references: [Cron usage and plan limits](https://vercel.com/docs/cron-jobs/usage-and-pricing), [Cron security/error/concurrency behavior](https://vercel.com/docs/cron-jobs/manage-cron-jobs), and [Vercel pricing](https://vercel.com/pricing).

## 4. Resend transactional email

**Default:** Resend for guest and collaborator transactional messages only.

### User/account and DNS actions

- [ ] Create/designate a Resend team with least-privilege access and provider-account MFA.
- [ ] Add a dedicated sending subdomain such as `updates.example.com` rather than using the organizational root domain.
- [ ] Publish and verify the provider-supplied DKIM/SPF records; add an appropriate DMARC policy through the DNS owner.
- [ ] Configure the From identity and a monitored Reply-To mailbox.
- [ ] Create a restricted sending API key for each environment.
- [ ] Create signed webhooks for delivery, bounce, complaint, and relevant failure events.
- [ ] Use provider test recipients during development. Real guest invitations require later explicit authorization.
- [ ] Review the plan before Phase 3 staging: the current Free plan is limited to 100 emails/day, below the 1,000-event/day product high-water assumption; a paid plan or adjusted verified staging load will be required.

### Configuration keys

| Key | Secret | Purpose |
|---|---:|---|
| `RESEND_API_KEY` | Yes | Restricted server/worker sending key |
| `RESEND_WEBHOOK_SIGNING_SECRET` | Yes | Verify raw webhook signatures |
| `EMAIL_FROM` | No | Verified From display name/address |
| `EMAIL_REPLY_TO` | No | Monitored organizer/support reply address |
| `OUTBOX_ENCRYPTION_KEY` | Yes | Application-managed 32-byte encryption key for temporary raw-link payloads; not a Resend key |

Implementation requirements:

- Insert invitation/token hash and encrypted outbox payload in the same PostgreSQL transaction.
- Use the outbox dedupe key as the Resend idempotency key, while retaining internal sent state.
- Verify webhook signatures over the raw body and make repeated events idempotent.
- Never place a raw invitation token in logs, provider metadata, error text, email subject, or audit records.
- Erase the encrypted raw-link payload after successful delivery or terminal failure.
- Keep open/click tracking disabled for invitation links unless a later privacy decision explicitly authorizes it.

Official references: [Resend pricing and current daily limits](https://resend.com/pricing), [idempotency keys](https://resend.com/changelog/idempotency-keys), [domain verification behavior](https://resend.com/changelog/domain-verification-events), and [webhook verification](https://resend.com/changelog/managing-webhooks-via-api).

## 5. Upstash shared rate limiting

**Default:** Upstash Redis plus `@upstash/ratelimit`, closest Singapore/Asia region available.

### User/account actions

- [ ] Create separate development, staging, and production Redis databases.
- [ ] Select the closest region to the Vercel/Neon deployment and restrict dashboard membership.
- [ ] Add a budget limit/alerts before enabling pay-as-you-go.
- [ ] Review whether production requires the paid high-availability/SLA offering; free development access is not evidence of production resilience.

### Configuration keys

| Key | Secret | Purpose |
|---|---:|---|
| `UPSTASH_REDIS_REST_URL` | No, but keep server-side | HTTP endpoint for the selected Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Authenticate rate-limit commands |
| `RATE_LIMIT_NAMESPACE` | No | Environment-specific key prefix preventing collisions |

Implementation requirements:

- Apply distinct limiters to sign-in-adjacent endpoints, invitation queueing, manual resends, and RSVP reads/writes.
- Key authenticated limits by immutable local user/organizer ID; combine token-hash/IP signals for public RSVP without storing the raw token.
- Do not depend only on process memory. Failures follow a documented endpoint-specific fail-open/fail-closed policy and emit a sanitized operational event.
- Redis is not the authority for capacity, authorization, invitations, or delivery state.

Official references: [TypeScript rate-limit overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview), [environment setup](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted), and [Redis pricing](https://upstash.com/pricing/redis).

## 6. Application-only secrets and safe defaults

| Key | Secret | Owner / generation requirement |
|---|---:|---|
| `OUTBOX_ENCRYPTION_KEY` | Yes | Deployment administrator; cryptographically random 32 bytes, encoded for the chosen library; separate per environment |
| `CRON_SECRET` | Yes | Deployment administrator; at least 16 random characters per Vercel guidance, preferably 32+ bytes |
| `LOG_TOKEN_HASH_KEY` | Yes | Deployment administrator; keyed hashing/redaction of token-shaped identifiers if implementation requires correlation |

Rotation must support a controlled overlap where decryption or verification requires it. Never overwrite the only active outbox encryption key while pending payloads still require it.

## Current cost/account implications

Prices and quotas below were reviewed on October 31, 2026 and must be rechecked before purchase. They exclude taxes and usage overages.

| Provider | Development starting point | Expected user-controlled production/staging decision |
|---|---|---|
| Clerk | Hobby is currently free up to stated retained-user limits | Pro currently starts at USD 20/month billed annually for features such as custom session lifetime/MFA/branding; compliance/SLA needs may require higher tiers |
| Neon | Free plan currently offers limited storage/history and no card requirement | Launch is usage-based; Neon shows an illustrative typical spend around USD 15/month. Choose based on recovery, storage, and compute needs. |
| Vercel | Hobby can support local/preview work | **Pro is required for the one-minute cron** and is currently USD 20/month plus applicable usage |
| Resend | Free currently permits 100 emails/day | Product high-water invitation testing likely needs Pro, currently USD 20/month for 50,000 emails/month, or a deliberately smaller staging test |
| Upstash | Free currently includes 500,000 commands/month | Pay-as-you-go currently begins at USD 0.20 per 100,000 commands; production HA/SLA is a separate cost decision |
| Domain/DNS | Existing controlled domain may be used | A new domain, paid DNS service, or staff time may be required; no purchase is made in Phase 0 |

## Phase gates

### Required before Phase 1 can pass integrated foundation acceptance

- [ ] Clerk development credentials and webhook configuration are securely available.
- [ ] Neon development and isolated test PostgreSQL URLs are securely available.
- [ ] The selected provider residency/data-processing posture is acceptable for the intended first users.

Foundation code may begin without all three, but sign-in/database integration checks must remain reported as unrun until access exists.

### Required before Phase 3 staging acceptance

- [ ] Resend account, verified sending subdomain, restricted API key, signed webhook, and sufficient sending quota.
- [ ] Upstash staging database and REST credentials.
- [ ] Vercel Pro staging project or an equivalent authorized one-minute scheduler configuration.
- [ ] Staging Neon database and a synthetic-recipient test plan.
- [ ] User approval or replacement of the proposed dietary-note access policy.

### Required before Phase 5 production readiness

- [ ] Production accounts/plans, billing owners, spend alerts, least-privilege access, and recovery features are selected.
- [ ] Production domain, DNS, sender authentication, application URLs, and webhook destinations are verified.
- [ ] Privacy/retention policy, notices, provider disclosures, and subprocessors are approved.
- [ ] Backup/restore drill, migrations, monitoring, alert ownership, and worker recovery have evidence.

## Exact remaining user actions after Phase 0

1. Confirm or replace the proposed dietary-note access and 90-day minimization policy in [`decisions.md`](./decisions.md#adr-008-guest-privacy-dietary-access-and-retention).
2. Confirm that Clerk's identity-data residency and the selected providers' data-processing terms are acceptable for the intended audience.
3. Create/designate the Clerk development application and Neon non-production project, then supply their Phase 1 keys/URLs through a secure environment-secret channel—not in repository files or chat.
4. Defer Vercel Pro, Resend paid quota, verified email domain, and Upstash production purchasing until their phase gates unless early account setup is desired. No purchase has been made.
