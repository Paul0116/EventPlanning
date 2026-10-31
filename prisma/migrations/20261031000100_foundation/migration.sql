CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "event_status" AS ENUM ('draft', 'planning', 'completed', 'cancelled', 'archived');
CREATE TYPE "event_type" AS ENUM ('birthday', 'wedding', 'party', 'corporate', 'other');
CREATE TYPE "event_member_role" AS ENUM ('editor', 'viewer');

CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_subject" VARCHAR(255) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "display_name" VARCHAR(160) NOT NULL,
    "identity_event_timestamp" BIGINT NOT NULL DEFAULT 0,
    "identity_deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_version_positive" CHECK ("version" > 0)
);

CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "event_type" "event_type" NOT NULL,
    "status" "event_status" NOT NULL DEFAULT 'draft',
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "timezone" VARCHAR(64) NOT NULL,
    "venue_text" VARCHAR(500),
    "currency" CHAR(3) NOT NULL,
    "budget_limit" DECIMAL(14,2),
    "capacity" INTEGER,
    "rsvp_deadline" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "events_end_after_start" CHECK ("ends_at" > "starts_at"),
    CONSTRAINT "events_rsvp_before_start" CHECK ("rsvp_deadline" IS NULL OR "rsvp_deadline" <= "starts_at"),
    CONSTRAINT "events_budget_nonnegative" CHECK ("budget_limit" IS NULL OR "budget_limit" >= 0),
    CONSTRAINT "events_capacity_positive" CHECK ("capacity" IS NULL OR "capacity" > 0),
    CONSTRAINT "events_version_positive" CHECK ("version" > 0),
    CONSTRAINT "events_currency_supported" CHECK ("currency" IN ('AUD','CAD','EUR','GBP','HKD','INR','MYR','NZD','PHP','SGD','THB','USD'))
);

CREATE TABLE "event_members" (
    "event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "event_member_role" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "event_members_pkey" PRIMARY KEY ("event_id", "user_id"),
    CONSTRAINT "event_members_version_positive" CHECK ("version" > 0)
);

CREATE TABLE "budget_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "budget_categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "budget_categories_version_positive" CHECK ("version" > 0)
);

CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "actor_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity_webhook_events" (
    "id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "event_timestamp" BIGINT NOT NULL,
    "processed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_auth_subject_key" ON "users"("auth_subject");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "events_owner_id_status_starts_at_idx" ON "events"("owner_id", "status", "starts_at");
CREATE INDEX "events_status_starts_at_idx" ON "events"("status", "starts_at");
CREATE INDEX "event_members_user_id_role_idx" ON "event_members"("user_id", "role");
CREATE UNIQUE INDEX "budget_categories_event_id_name_key" ON "budget_categories"("event_id", "name");
CREATE UNIQUE INDEX "budget_categories_event_id_id_key" ON "budget_categories"("event_id", "id");
CREATE INDEX "budget_categories_event_id_idx" ON "budget_categories"("event_id");
CREATE INDEX "audit_logs_event_id_created_at_idx" ON "audit_logs"("event_id", "created_at");
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");
CREATE INDEX "identity_webhook_events_processed_at_idx" ON "identity_webhook_events"("processed_at");

ALTER TABLE "events"
    ADD CONSTRAINT "events_owner_id_fkey"
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "event_members"
    ADD CONSTRAINT "event_members_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_members"
    ADD CONSTRAINT "event_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "budget_categories"
    ADD CONSTRAINT "budget_categories_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "audit_logs"
    ADD CONSTRAINT "audit_logs_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "audit_logs"
    ADD CONSTRAINT "audit_logs_actor_id_fkey"
    FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
