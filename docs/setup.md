# Gatherly Foundation Setup

Updated: November 1, 2026

This repository contains the Phase 1 Next.js application. The setup below uses synthetic local data and PostgreSQL. It does not create provider accounts, purchase services, deploy, or send invitations.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Docker Desktop or another PostgreSQL 17 runtime
- A Clerk development application for live sign-in/webhook verification

Pinned direct dependencies are recorded in `package.json` and the npm lockfile. The foundation intentionally uses stable Prisma ORM 7.10; Prisma ORM 8 was still a release candidate when this phase was implemented.

## Install and configure

1. Install exact locked dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to an ignored `.env.local` and fill only your local values. Never commit the resulting file. Prisma CLI commands load `.env`, so either export database variables in the shell or create a separate ignored `.env` containing only the local database URLs.

3. Start the isolated local databases:

   ```sh
   docker compose up -d postgres postgres-test
   ```

4. Generate the Prisma client and migrate the development database:

   ```sh
   npm run db:generate
   npm run db:migrate:deploy
   ```

5. Optionally add synthetic development data:

   ```sh
   npm run db:seed
   ```

   The seed uses only `example.test` data. Set `SYNTHETIC_OWNER_AUTH_SUBJECT` to the subject of an isolated Clerk development user only if you want that user to see the seeded event.

6. Start the app:

   ```sh
   npm run dev
   ```

   Open `http://localhost:3000`.

## Clerk development setup

The application is fail-closed when Clerk keys are absent: marketing and setup guidance render, while `/events` redirects to `/sign-in` and protected APIs return `401`.

In the Clerk dashboard:

1. Create or select a development application owned by the user/team.
2. Require email verification and enable the chosen sign-in method.
3. Put `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` into the ignored local environment file.
4. Add a webhook endpoint at `/api/webhooks/identity` and subscribe to `user.created`, `user.updated`, and `user.deleted`.
5. Put its signing secret in `CLERK_WEBHOOK_SIGNING_SECRET`.
6. For local webhook delivery, use a user-controlled secure tunnel and register its exact HTTPS endpoint in Clerk. Do not expose unrelated local services.

The handler verifies the raw request through Clerk's supported SDK, deduplicates the delivery ID, and ignores older identity changes. Webhooks are not required for first-request consistency: an authenticated request reconciles the verified primary email and immutable Clerk subject before accessing data.

## Verification

Static and unit checks:

```sh
npm run format
npm run lint
npm run typecheck
npm run test:unit
npm run build
```

PostgreSQL migration and integration checks:

```sh
export DATABASE_URL='postgresql://gatherly_test:gatherly_test_only@127.0.0.1:54330/gatherly_test'
export MIGRATION_DATABASE_URL="$DATABASE_URL"
export TEST_DATABASE_URL="$DATABASE_URL"
npm run db:migrate:deploy
npm run test:integration
```

Signed-out browser denial (does not require Clerk keys):

```sh
npx playwright install chromium
npm run test:e2e:signed-out -- --project=chromium
```

Live sign-in-to-event browser flow requires a real Clerk development instance, an existing synthetic verified user, and PostgreSQL:

```sh
export E2E_CLERK_USER_EMAIL='synthetic+clerk_test@example.com'
npm run test:e2e -- --project=chromium -g 'signs in, creates an event'
```

Use a Clerk test address controlled by the project owner. The test is skipped when any required live integration value is missing; a skipped test is not evidence that identity integration works.

## Data and security notes

- The browser never receives database or Clerk secret keys.
- Event services scope every read to owner/membership before returning the record. Unknown and unauthorized event IDs share the same `404` result.
- Server Actions and cookie-authenticated mutation routes verify origin in addition to Next.js's same-origin Server Action protection.
- The local Docker passwords are deliberately labeled local-only. Replace them for any shared environment and use its secret manager.
- Do not run destructive integration tests against development, staging, or production. `TEST_DATABASE_URL` must identify a disposable database.
