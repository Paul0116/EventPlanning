"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createEventWithCategories, getEventForUser } from "@/features/events/service";
import { formDataToEventInput, parseCreateEventInput } from "@/features/events/schemas";
import { requireAuthenticatedUser } from "@/lib/auth";
import { normalizeError } from "@/lib/errors";
import { assertTrustedOrigin } from "@/lib/origin";

export type CreateEventState = {
  status: "idle" | "error";
  message?: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialCreateEventState: CreateEventState = { status: "idle" };

export async function createEventAction(
  _previousState: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  let eventId: string;

  try {
    const requestHeaders = await headers();
    assertTrustedOrigin(requestHeaders);
    const user = await requireAuthenticatedUser();
    const input = parseCreateEventInput(formDataToEventInput(formData));
    const event = await createEventWithCategories(user.id, input);
    eventId = event.id;
  } catch (error) {
    const normalized = normalizeError(error);
    return {
      status: "error",
      message: normalized.message,
      code: normalized.code,
      fieldErrors: normalized.details,
    };
  }

  redirect(`/events/${eventId}`);
}

export async function openEventAction(eventId: string): Promise<never> {
  const requestHeaders = await headers();
  assertTrustedOrigin(requestHeaders);
  const user = await requireAuthenticatedUser();
  await getEventForUser(user.id, eventId);
  redirect(`/events/${eventId}`);
}
