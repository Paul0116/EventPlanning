import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { parseCreateEventInput } from "@/features/events/schemas";

const validInput = {
  title: "Company Anniversary",
  eventType: "CORPORATE",
  startsAt: "2027-02-20T18:00",
  endsAt: "2027-02-20T22:00",
  timezone: "Asia/Manila",
  currency: "PHP",
  budgetLimit: "50000.00",
  capacity: "100",
  rsvpDeadline: "2027-02-10T23:59",
};

describe("parseCreateEventInput", () => {
  it("interprets local wall times in the selected IANA time zone", () => {
    const parsed = parseCreateEventInput(validInput);
    expect(parsed.startsAt.toISOString()).toBe("2027-02-20T10:00:00.000Z");
    expect(parsed.endsAt.toISOString()).toBe("2027-02-20T14:00:00.000Z");
    expect(parsed.budgetLimit).toBe("50000.00");
    expect(parsed.capacity).toBe(100);
  });

  it("rejects unsupported currency precision choices", () => {
    expect(() => parseCreateEventInput({ ...validInput, currency: "JPY" })).toThrow(AppError);
  });

  it("rejects an RSVP deadline after the start", () => {
    try {
      parseCreateEventInput({ ...validInput, rsvpDeadline: "2027-02-20T19:00" });
      throw new Error("Expected validation to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).details?.rsvpDeadline).toBeDefined();
    }
  });

  it("rejects an end before the start", () => {
    try {
      parseCreateEventInput({ ...validInput, endsAt: "2027-02-20T17:00" });
      throw new Error("Expected validation to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).details?.endsAt).toBeDefined();
    }
  });
});
