import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { z } from "zod";
import { eventTypes, supportedCurrencies } from "@/features/events/constants";
import { validationError } from "@/lib/errors";

const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const offsetPattern = /(?:Z|[+-]\d{2}:\d{2})$/;

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const optionalPositiveInteger = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().positive().max(1_000_000).optional(),
);

const optionalMoney = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d{1,12}(?:\.\d{1,2})?$/, "Use a non-negative amount with at most two decimals.")
    .optional(),
);

function isIanaTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function parseDateTime(value: string, timezone: string): Date {
  if (offsetPattern.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }

  if (!localDateTimePattern.test(value)) {
    throw new Error("Use a local date and time or an ISO 8601 timestamp with an offset.");
  }

  const parsed = fromZonedTime(value, timezone);
  const roundTrip = formatInTimeZone(parsed, timezone, "yyyy-MM-dd'T'HH:mm");
  if (roundTrip !== value) {
    throw new Error("This local time does not exist in the selected time zone.");
  }
  return parsed;
}

const rawEventInputSchema = z.object({
  title: z.string().trim().min(1, "Enter an event title.").max(160),
  description: optionalText(5_000),
  eventType: z.enum(eventTypes),
  startsAt: z.string().trim().min(1, "Enter a start date and time."),
  endsAt: z.string().trim().min(1, "Enter an end date and time."),
  timezone: z.string().trim().min(1).max(64).refine(isIanaTimeZone, "Choose a valid IANA time zone."),
  venueText: optionalText(500),
  currency: z.enum(supportedCurrencies),
  budgetLimit: optionalMoney,
  capacity: optionalPositiveInteger,
  rsvpDeadline: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().optional(),
  ),
});

export type CreateEventInput = {
  title: string;
  description?: string;
  eventType: (typeof eventTypes)[number];
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  venueText?: string;
  currency: (typeof supportedCurrencies)[number];
  budgetLimit?: string;
  capacity?: number;
  rsvpDeadline?: Date;
};

export function parseCreateEventInput(input: unknown): CreateEventInput {
  const raw = rawEventInputSchema.safeParse(input);
  if (!raw.success) {
    throw validationError(z.flattenError(raw.error).fieldErrors);
  }

  const fieldErrors: Record<string, string[]> = {};
  let startsAt: Date | undefined;
  let endsAt: Date | undefined;
  let rsvpDeadline: Date | undefined;

  for (const [field, value] of [
    ["startsAt", raw.data.startsAt],
    ["endsAt", raw.data.endsAt],
    ["rsvpDeadline", raw.data.rsvpDeadline],
  ] as const) {
    if (!value) continue;
    try {
      const parsed = parseDateTime(value, raw.data.timezone);
      if (field === "startsAt") startsAt = parsed;
      if (field === "endsAt") endsAt = parsed;
      if (field === "rsvpDeadline") rsvpDeadline = parsed;
    } catch (error) {
      fieldErrors[field] = [error instanceof Error ? error.message : "Enter a valid date and time."];
    }
  }

  if (startsAt && endsAt && endsAt <= startsAt) {
    fieldErrors.endsAt = ["Event end must be after the start."];
  }
  if (startsAt && rsvpDeadline && rsvpDeadline > startsAt) {
    fieldErrors.rsvpDeadline = ["The RSVP deadline cannot be after the event starts."];
  }

  if (Object.keys(fieldErrors).length > 0 || !startsAt || !endsAt) {
    throw validationError(fieldErrors);
  }

  return {
    title: raw.data.title,
    eventType: raw.data.eventType,
    startsAt,
    endsAt,
    timezone: raw.data.timezone,
    currency: raw.data.currency,
    ...(raw.data.description ? { description: raw.data.description } : {}),
    ...(raw.data.venueText ? { venueText: raw.data.venueText } : {}),
    ...(raw.data.budgetLimit ? { budgetLimit: raw.data.budgetLimit } : {}),
    ...(raw.data.capacity ? { capacity: raw.data.capacity } : {}),
    ...(rsvpDeadline ? { rsvpDeadline } : {}),
  };
}

export function formDataToEventInput(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(
    [
      "title",
      "description",
      "eventType",
      "startsAt",
      "endsAt",
      "timezone",
      "venueText",
      "currency",
      "budgetLimit",
      "capacity",
      "rsvpDeadline",
    ].map((key) => [key, formData.get(key) ?? ""]),
  );
}
