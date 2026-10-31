import "server-only";

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeError, toErrorEnvelope } from "@/lib/errors";
import { logger } from "@/lib/logger";

const requestIdPattern = /^[a-zA-Z0-9._:-]{8,128}$/;

export function getRequestId(request: Request): string {
  const provided = request.headers.get("x-request-id");
  return provided && requestIdPattern.test(provided) ? provided : randomUUID();
}

export function successResponse<T>(data: T, requestId: string, status = 200): NextResponse {
  return NextResponse.json(
    { data },
    {
      status,
      headers: {
        "cache-control": "private, no-store",
        "x-request-id": requestId,
      },
    },
  );
}

export function errorResponse(error: unknown, requestId: string, request: Request): NextResponse {
  const normalized = normalizeError(error);

  logger[normalized.status >= 500 ? "error" : "warn"]("request_failed", {
    requestId,
    route: new URL(request.url).pathname,
    method: request.method,
    status: normalized.status,
    code: normalized.code,
  });

  return NextResponse.json(toErrorEnvelope(normalized, requestId), {
    status: normalized.status,
    headers: {
      "cache-control": "private, no-store",
      "x-request-id": requestId,
    },
  });
}
