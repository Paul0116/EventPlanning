import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { can, requireCapability } from "@/lib/permissions";

describe("event permissions", () => {
  it("allows all event roles to read", () => {
    expect(can("OWNER", "event:read")).toBe(true);
    expect(can("EDITOR", "event:read")).toBe(true);
    expect(can("VIEWER", "event:read")).toBe(true);
  });

  it("keeps owner-only controls owner-only", () => {
    for (const capability of ["members:manage", "lifecycle:manage", "event:delete"] as const) {
      expect(can("OWNER", capability)).toBe(true);
      expect(can("EDITOR", capability)).toBe(false);
      expect(can("VIEWER", capability)).toBe(false);
    }
  });

  it("throws a forbidden error when a role lacks a capability", () => {
    expect(() => requireCapability("VIEWER", "planning:write")).toThrow(AppError);
  });
});
