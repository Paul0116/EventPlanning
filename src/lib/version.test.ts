import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { assertVersionedUpdate, versionedWhere } from "@/lib/version";

describe("version helpers", () => {
  it("builds a version-scoped update target", () => {
    expect(versionedWhere("record-id", 4)).toEqual({ id: "record-id", version: 4 });
  });

  it("reports a conflict when no versioned row is updated", () => {
    expect(() => assertVersionedUpdate(0)).toThrow(AppError);
    expect(() => assertVersionedUpdate(1)).not.toThrow();
  });
});
