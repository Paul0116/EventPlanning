import { createEventWithCategories, listAccessibleEvents } from "@/features/events/service";
import { parseCreateEventInput } from "@/features/events/schemas";
import { requireAuthenticatedUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { assertTrustedOrigin } from "@/lib/origin";
import { parsePagination } from "@/lib/pagination";
import { errorResponse, getRequestId, successResponse } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maximumBodyBytes = 32_768;

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    const user = await requireAuthenticatedUser();
    const url = new URL(request.url);
    const pagination = parsePagination({
      cursor: url.searchParams.get("cursor"),
      limit: url.searchParams.get("limit"),
    });
    const result = await listAccessibleEvents(user.id, pagination);
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId, request);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  try {
    assertTrustedOrigin(request.headers);
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > maximumBodyBytes) {
      throw new AppError("VALIDATION_ERROR", "The request body is too large.", 413);
    }

    const user = await requireAuthenticatedUser();
    const input = parseCreateEventInput(await request.json());
    const event = await createEventWithCategories(user.id, input);
    return successResponse(
      {
        ...event,
        budgetLimit: event.budgetLimit?.toString() ?? null,
      },
      requestId,
      201,
    );
  } catch (error) {
    return errorResponse(error, requestId, request);
  }
}
