import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the synthetic seed.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const defaultCategories = ["Venue", "Catering", "Decor", "Entertainment", "Logistics", "Other"];

async function main() {
  const owner = await prisma.user.upsert({
    where: { authSubject: process.env.SYNTHETIC_OWNER_AUTH_SUBJECT ?? "seed_user_alex" },
    update: {
      displayName: "Alex Rivera",
      email: "alex.rivera@example.test",
      identityDeletedAt: null,
    },
    create: {
      authSubject: process.env.SYNTHETIC_OWNER_AUTH_SUBJECT ?? "seed_user_alex",
      displayName: "Alex Rivera",
      email: "alex.rivera@example.test",
    },
  });

  const eventId = "11111111-1111-4111-8111-111111111111";
  await prisma.$transaction(async (tx) => {
    await tx.event.upsert({
      where: { id: eventId },
      update: {},
      create: {
        id: eventId,
        ownerId: owner.id,
        title: "Synthetic Company Anniversary",
        description: "Synthetic development data only.",
        eventType: "CORPORATE",
        startsAt: new Date("2027-02-20T10:00:00.000Z"),
        endsAt: new Date("2027-02-20T14:00:00.000Z"),
        timezone: "Asia/Manila",
        venueText: "Development Hall",
        currency: "PHP",
        budgetLimit: "50000.00",
        capacity: 100,
        rsvpDeadline: new Date("2027-02-10T15:59:00.000Z"),
      },
    });

    await tx.budgetCategory.createMany({
      data: defaultCategories.map((name) => ({ eventId, name })),
      skipDuplicates: true,
    });
  });

  console.info(`Synthetic seed ready for local user ${owner.id} and event ${eventId}.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error instanceof Error ? error.message : "Synthetic seed failed.");
    await prisma.$disconnect();
    process.exitCode = 1;
  });
