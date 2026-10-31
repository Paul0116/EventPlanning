import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { encodeCursor, parsePagination } from "@/lib/pagination";

describe("pagination", () => {
  it("uses a default of 25 and accepts an opaque UUID cursor", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    expect(parsePagination({ cursor: encodeCursor(id) })).toEqual({ cursor: id, limit: 25 });
  });

  it("rejects limits over 100 and malformed cursors", () => {
    expect(() => parsePagination({ limit: 101 })).toThrow(AppError);
    expect(() => parsePagination({ cursor: "not-a-cursor" })).toThrow(AppError);
  });
});
