import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/env";

function buildPrismaClient(databaseUrl: string) {
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });

  return new PrismaClient({ adapter });
}

type GatherlyPrismaClient = ReturnType<typeof buildPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  gatherlyPrisma?: GatherlyPrismaClient;
};

export const db =
  globalForPrisma.gatherlyPrisma ?? buildPrismaClient(getDatabaseUrl());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.gatherlyPrisma = db;
}

export function createDatabaseClient(databaseUrl: string): GatherlyPrismaClient {
  return buildPrismaClient(databaseUrl);
}

export type DatabaseClient = GatherlyPrismaClient;
