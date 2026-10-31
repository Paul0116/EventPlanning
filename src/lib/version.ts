import { versionConflict } from "@/lib/errors";

export function versionedWhere(id: string, version: number) {
  return { id, version } as const;
}

export function assertVersionedUpdate(updatedRows: number): void {
  if (updatedRows !== 1) {
    throw versionConflict();
  }
}
