import { forbidden } from "@/lib/errors";

export const eventRoles = ["OWNER", "EDITOR", "VIEWER"] as const;
export type EventAccessRole = (typeof eventRoles)[number];

export type EventCapability =
  | "event:read"
  | "planning:write"
  | "members:manage"
  | "lifecycle:manage"
  | "event:delete";

const capabilityRoles: Record<EventCapability, ReadonlySet<EventAccessRole>> = {
  "event:read": new Set(eventRoles),
  "planning:write": new Set(["OWNER", "EDITOR"]),
  "members:manage": new Set(["OWNER"]),
  "lifecycle:manage": new Set(["OWNER"]),
  "event:delete": new Set(["OWNER"]),
};

export function can(role: EventAccessRole, capability: EventCapability): boolean {
  return capabilityRoles[capability].has(role);
}

export function requireCapability(role: EventAccessRole, capability: EventCapability): void {
  if (!can(role, capability)) {
    throw forbidden();
  }
}
