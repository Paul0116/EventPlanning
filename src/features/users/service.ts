import "server-only";

import type { DatabaseClient } from "@/lib/db";
import { db } from "@/lib/db";

export type IdentityProfile = {
  authSubject: string;
  email: string;
  displayName: string;
};

export async function reconcileAuthenticatedUser(
  profile: IdentityProfile,
  database: DatabaseClient = db,
) {
  return database.user.upsert({
    where: { authSubject: profile.authSubject },
    create: {
      authSubject: profile.authSubject,
      email: profile.email.toLowerCase(),
      displayName: profile.displayName,
    },
    update: {
      email: profile.email.toLowerCase(),
      displayName: profile.displayName,
      identityDeletedAt: null,
    },
    select: {
      id: true,
      authSubject: true,
      email: true,
      displayName: true,
      version: true,
    },
  });
}

export type IdentityWebhookChange =
  | {
      kind: "upsert";
      deliveryId: string;
      eventType: string;
      eventTimestamp: bigint;
      profile: IdentityProfile;
    }
  | {
      kind: "delete";
      deliveryId: string;
      eventType: string;
      eventTimestamp: bigint;
      authSubject: string;
    }
  | {
      kind: "record-only";
      deliveryId: string;
      eventType: string;
      eventTimestamp: bigint;
    };

export async function applyIdentityWebhook(
  change: IdentityWebhookChange,
  database: DatabaseClient = db,
): Promise<"processed" | "duplicate"> {
  return database.$transaction(async (tx) => {
    const inserted = await tx.$queryRaw<Array<{ id: string }>>`
      INSERT INTO "identity_webhook_events" ("id", "type", "event_timestamp")
      VALUES (${change.deliveryId}, ${change.eventType}, ${change.eventTimestamp})
      ON CONFLICT ("id") DO NOTHING
      RETURNING "id"
    `;

    if (inserted.length === 0) {
      return "duplicate";
    }

    if (change.kind === "upsert") {
      await tx.$executeRaw`
        INSERT INTO "users" (
          "auth_subject",
          "email",
          "display_name",
          "identity_event_timestamp",
          "identity_deleted_at"
        )
        VALUES (
          ${change.profile.authSubject},
          ${change.profile.email.toLowerCase()},
          ${change.profile.displayName},
          ${change.eventTimestamp},
          NULL
        )
        ON CONFLICT ("auth_subject") DO UPDATE
        SET
          "email" = EXCLUDED."email",
          "display_name" = EXCLUDED."display_name",
          "identity_event_timestamp" = EXCLUDED."identity_event_timestamp",
          "identity_deleted_at" = NULL,
          "updated_at" = CURRENT_TIMESTAMP,
          "version" = "users"."version" + 1
        WHERE "users"."identity_event_timestamp" <= EXCLUDED."identity_event_timestamp"
      `;
    }

    if (change.kind === "delete") {
      await tx.$executeRaw`
        UPDATE "users"
        SET
          "identity_deleted_at" = CURRENT_TIMESTAMP,
          "identity_event_timestamp" = ${change.eventTimestamp},
          "updated_at" = CURRENT_TIMESTAMP,
          "version" = "version" + 1
        WHERE
          "auth_subject" = ${change.authSubject}
          AND "identity_event_timestamp" <= ${change.eventTimestamp}
      `;
    }

    return "processed";
  });
}
