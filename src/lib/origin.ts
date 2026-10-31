import "server-only";

import { AppError } from "@/lib/errors";
import { getAppUrl } from "@/lib/env";

type HeaderReader = Pick<Headers, "get">;

export function assertTrustedOrigin(headers: HeaderReader, configuredOrigin = getAppUrl()): void {
  const origin = headers.get("origin");
  if (!origin) {
    throw new AppError("INVALID_ORIGIN", "The request origin could not be verified.", 403);
  }

  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const protocol = headers.get("x-forwarded-proto") ?? new URL(configuredOrigin).protocol.slice(0, -1);
  const requestOrigin = host ? `${protocol}://${host}` : null;
  const allowed = new Set([configuredOrigin, requestOrigin].filter((value): value is string => Boolean(value)));

  if (!allowed.has(origin)) {
    throw new AppError("INVALID_ORIGIN", "The request origin is not allowed.", 403);
  }
}
