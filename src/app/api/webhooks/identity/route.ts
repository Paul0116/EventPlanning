import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { AppError } from "@/lib/errors";
import { getClerkWebhookSecret } from "@/lib/env";
import { errorResponse, getRequestId, successResponse } from "@/lib/request";
import { applyIdentityWebhook, type IdentityProfile } from "@/features/users/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
  verification?: { status?: string } | null;
};

type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
};

function profileFromPayload(payload: ClerkUserPayload): IdentityProfile | null {
  const primaryEmail = payload.email_addresses?.find(
    (address) =>
      address.id === payload.primary_email_address_id && address.verification?.status === "verified",
  );

  if (!primaryEmail) {
    return null;
  }

  const fullName = [payload.first_name, payload.last_name].filter(Boolean).join(" ").trim();
  return {
    authSubject: payload.id,
    email: primaryEmail.email_address,
    displayName: fullName || payload.username?.trim() || primaryEmail.email_address,
  };
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const deliveryId = request.headers.get("svix-id") ?? request.headers.get("webhook-id");
    if (!deliveryId) {
      throw new AppError("VALIDATION_ERROR", "Webhook delivery ID is required.", 400);
    }

    const event = await verifyWebhook(request, {
      signingSecret: getClerkWebhookSecret(),
    });
    const eventTimestamp = BigInt(event.timestamp);

    if (event.type === "user.created" || event.type === "user.updated") {
      const profile = profileFromPayload(event.data as ClerkUserPayload);
      const result = await applyIdentityWebhook(
        profile
          ? {
              kind: "upsert",
              deliveryId,
              eventType: event.type,
              eventTimestamp,
              profile,
            }
          : {
              kind: "record-only",
              deliveryId,
              eventType: event.type,
              eventTimestamp,
            },
      );
      return successResponse({ status: result }, requestId);
    }

    if (event.type === "user.deleted" && event.data.id) {
      const result = await applyIdentityWebhook({
        kind: "delete",
        deliveryId,
        eventType: event.type,
        eventTimestamp,
        authSubject: event.data.id,
      });
      return successResponse({ status: result }, requestId);
    }

    const result = await applyIdentityWebhook({
      kind: "record-only",
      deliveryId,
      eventType: event.type,
      eventTimestamp,
    });
    return successResponse({ status: result }, requestId);
  } catch (error) {
    return errorResponse(error, requestId, request);
  }
}
