import { z } from "zod";
import { getEventForUser } from "@/features/events/service";
import { requireAuthenticatedUser } from "@/lib/auth";
import { notFound } from "@/lib/errors";
import { errorResponse, getRequestId, successResponse } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const requestId = getRequestId(request);
  try {
    const user = await requireAuthenticatedUser();
    const { eventId } = await context.params;
    if (!z.uuid().safeParse(eventId).success) {
      throw notFound();
    }
    const event = await getEventForUser(user.id, eventId);
    return successResponse(
      {
        ...event,
        budgetLimit: event.budgetLimit?.toString() ?? null,
      },
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId, request);
  }
}
