import "server-only";

import type { DatabaseClient } from "@/lib/db";
import { db } from "@/lib/db";
import { defaultBudgetCategories } from "@/features/events/constants";
import type { CreateEventInput } from "@/features/events/schemas";
import { encodeCursor, type Pagination } from "@/lib/pagination";
import { notFound } from "@/lib/errors";
import type { EventAccessRole } from "@/lib/permissions";

export type CategoryName = string;

export async function createEventWithCategories(
  ownerId: string,
  input: CreateEventInput,
  database: DatabaseClient = db,
  categoryNames: readonly CategoryName[] = defaultBudgetCategories,
) {
  return database.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        ownerId,
        title: input.title,
        description: input.description,
        eventType: input.eventType,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        timezone: input.timezone,
        venueText: input.venueText,
        currency: input.currency,
        budgetLimit: input.budgetLimit,
        capacity: input.capacity,
        rsvpDeadline: input.rsvpDeadline,
      },
    });

    await tx.budgetCategory.createMany({
      data: categoryNames.map((name) => ({ eventId: event.id, name })),
    });

    await tx.auditLog.create({
      data: {
        eventId: event.id,
        actorId: ownerId,
        action: "event.created",
        entityType: "event",
        entityId: event.id,
        metadata: { status: "draft" },
      },
    });

    return event;
  });
}

export async function listAccessibleEvents(
  userId: string,
  pagination: Pagination,
  database: DatabaseClient = db,
) {
  const rows = await database.event.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    orderBy: { id: "asc" },
    take: pagination.limit + 1,
    ...(pagination.cursor ? { cursor: { id: pagination.cursor }, skip: 1 } : {}),
    select: {
      id: true,
      ownerId: true,
      title: true,
      eventType: true,
      status: true,
      startsAt: true,
      endsAt: true,
      timezone: true,
      venueText: true,
      currency: true,
      version: true,
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  const hasNextPage = rows.length > pagination.limit;
  const visibleRows = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return {
    items: visibleRows.map(({ members, ...event }) => ({
      ...event,
      role: (event.ownerId === userId ? "OWNER" : members[0]?.role) as EventAccessRole,
    })),
    nextCursor: hasNextPage ? encodeCursor(visibleRows.at(-1)!.id) : null,
  };
}

export async function getEventForUser(
  userId: string,
  eventId: string,
  database: DatabaseClient = db,
) {
  const event = await database.event.findFirst({
    where: {
      id: eventId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      budgetCategories: {
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  if (!event) {
    throw notFound();
  }

  const { members, ...data } = event;
  return {
    ...data,
    role: (event.ownerId === userId ? "OWNER" : members[0]?.role) as EventAccessRole,
  };
}
