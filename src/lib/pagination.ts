import { z } from "zod";
import { validationError } from "@/lib/errors";

const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const cursorIdSchema = z.uuid();

export type PaginationInput = {
  cursor?: string | null;
  limit?: string | number | null;
};

export type Pagination = {
  cursor?: string;
  limit: number;
};

export function encodeCursor(id: string): string {
  return Buffer.from(id, "utf8").toString("base64url");
}

export function decodeCursor(value: string): string {
  const decoded = Buffer.from(value, "base64url").toString("utf8");
  return cursorIdSchema.parse(decoded);
}

export function parsePagination(input: PaginationInput): Pagination {
  try {
    return {
      limit: pageSizeSchema.parse(input.limit ?? undefined),
      ...(input.cursor ? { cursor: decodeCursor(input.cursor) } : {}),
    };
  } catch {
    throw validationError({ pagination: ["Use a valid cursor and a limit from 1 to 100."] });
  }
}
