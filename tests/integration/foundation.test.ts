import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createDatabaseClient } from "@/lib/db";
import { AppError } from "@/lib/errors";
import {
  createEventWithCategories,
  getEventForUser,
  listAccessibleEvents,
} from "@/features/events/service";
import { applyIdentityWebhook } from "@/features/users/service";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for PostgreSQL integration tests.");
}

const database = createDatabaseClient(databaseUrl);

const baseEventInput = {
  title: "Isolation Test Event",
  eventType: "CORPORATE" as const,
  startsAt: new Date("2027-02-20T10:00:00.000Z"),
  endsAt: new Date("2027-02-20T14:00:00.000Z"),
  timezone: "Asia/Manila",
  currency: "PHP" as const,
};

async function cleanDatabase() {
  await database.identityWebhookEvent.deleteMany();
  await database.auditLog.deleteMany();
  await database.budgetCategory.deleteMany();
  await database.eventMember.deleteMany();
  await database.event.deleteMany();
  await database.user.deleteMany();
}

async function user(subject: string) {
  return database.user.create({
    data: {
      authSubject: subject,
      email: `${subject}@example.test`,
      displayName: subject,
    },
  });
}

beforeAll(cleanDatabase);
beforeEach(cleanDatabase);
afterAll(async () => {
  await cleanDatabase();
  await database.$disconnect();
});

describe("foundation PostgreSQL behavior", () => {
  it("creates the event, categories, and audit record atomically", async () => {
    const owner = await user("owner_atomic");
    const event = await createEventWithCategories(owner.id, baseEventInput, database);

    expect(await database.event.count({ where: { id: event.id } })).toBe(1);
    expect(await database.budgetCategory.count({ where: { eventId: event.id } })).toBe(6);
    expect(await database.auditLog.count({ where: { eventId: event.id } })).toBe(1);
  });

  it("rolls the event back when default category insertion fails", async () => {
    const owner = await user("owner_rollback");

    await expect(
      createEventWithCategories(owner.id, baseEventInput, database, ["Duplicate", "Duplicate"]),
    ).rejects.toBeDefined();

    expect(await database.event.count({ where: { ownerId: owner.id } })).toBe(0);
    expect(await database.budgetCategory.count()).toBe(0);
    expect(await database.auditLog.count()).toBe(0);
  });

  it("isolates events while allowing explicit editor and viewer memberships", async () => {
    const ownerA = await user("owner_a");
    const ownerB = await user("owner_b");
    const editor = await user("editor");
    const viewer = await user("viewer");
    const eventA = await createEventWithCategories(ownerA.id, baseEventInput, database);
    const eventB = await createEventWithCategories(
      ownerB.id,
      { ...baseEventInput, title: "Owner B Event" },
      database,
    );

    await database.eventMember.createMany({
      data: [
        { eventId: eventA.id, userId: editor.id, role: "EDITOR" },
        { eventId: eventA.id, userId: viewer.id, role: "VIEWER" },
      ],
    });

    await expect(getEventForUser(ownerB.id, eventA.id, database)).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    } satisfies Partial<AppError>);
    await expect(getEventForUser(ownerA.id, eventB.id, database)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });

    expect((await getEventForUser(ownerA.id, eventA.id, database)).role).toBe("OWNER");
    expect((await getEventForUser(editor.id, eventA.id, database)).role).toBe("EDITOR");
    expect((await getEventForUser(viewer.id, eventA.id, database)).role).toBe("VIEWER");

    const ownerAList = await listAccessibleEvents(ownerA.id, { limit: 25 }, database);
    expect(ownerAList.items.map((event) => event.id)).toEqual([eventA.id]);
  });

  it("deduplicates identity deliveries and ignores older profile changes", async () => {
    const newerTimestamp = 2_000n;
    const olderTimestamp = 1_000n;
    const profile = {
      authSubject: "clerk_subject",
      email: "new@example.test",
      displayName: "New Name",
    };

    await expect(
      applyIdentityWebhook(
        {
          kind: "upsert",
          deliveryId: "delivery-new",
          eventType: "user.updated",
          eventTimestamp: newerTimestamp,
          profile,
        },
        database,
      ),
    ).resolves.toBe("processed");

    await expect(
      applyIdentityWebhook(
        {
          kind: "upsert",
          deliveryId: "delivery-new",
          eventType: "user.updated",
          eventTimestamp: newerTimestamp,
          profile,
        },
        database,
      ),
    ).resolves.toBe("duplicate");

    await applyIdentityWebhook(
      {
        kind: "upsert",
        deliveryId: "delivery-old",
        eventType: "user.updated",
        eventTimestamp: olderTimestamp,
        profile: { ...profile, email: "old@example.test", displayName: "Old Name" },
      },
      database,
    );

    const stored = await database.user.findUniqueOrThrow({ where: { authSubject: profile.authSubject } });
    expect(stored.email).toBe("new@example.test");
    expect(stored.displayName).toBe("New Name");
    expect(await database.identityWebhookEvent.count()).toBe(2);
  });
});
