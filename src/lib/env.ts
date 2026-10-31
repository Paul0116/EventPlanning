import "server-only";

import { z } from "zod";

const urlSchema = z.url().refine((value) => !value.endsWith("/"), {
  message: "must not end with a slash",
});

export function getAppUrl(): string {
  const value = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return urlSchema.parse(value);
}

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
      process.env.CLERK_SECRET_KEY?.trim(),
  );
}

export function isClerkWebhookConfigured(): boolean {
  return Boolean(process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim());
}

export function getDatabaseUrl(): string {
  const value =
    process.env.DATABASE_URL?.trim() ??
    "postgresql://invalid:invalid@127.0.0.1:1/gatherly_unconfigured";
  return z.url({ protocol: /^postgres(?:ql)?:$/ }).parse(value);
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getClerkWebhookSecret(): string {
  const value = process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim();
  if (!value) {
    throw new Error("CLERK_WEBHOOK_SIGNING_SECRET is required for identity webhooks.");
  }
  return value;
}
