import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { AppError, authenticationRequired } from "@/lib/errors";
import { isClerkConfigured } from "@/lib/env";
import { reconcileAuthenticatedUser } from "@/features/users/service";

export type AuthenticatedUser = Awaited<ReturnType<typeof reconcileAuthenticatedUser>>;

export async function getOptionalAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  if (!isClerkConfigured()) {
    return null;
  }

  const session = await auth();
  if (!session.userId) {
    return null;
  }

  const identity = await currentUser();
  if (!identity || identity.id !== session.userId) {
    return null;
  }

  const verifiedEmail = identity.emailAddresses.find(
    (address) =>
      address.id === identity.primaryEmailAddressId && address.verification?.status === "verified",
  );

  if (!verifiedEmail) {
    throw new AppError(
      "VERIFIED_EMAIL_REQUIRED",
      "Verify your primary email address before using Gatherly.",
      403,
    );
  }

  const displayName =
    identity.fullName?.trim() || identity.username?.trim() || verifiedEmail.emailAddress;

  return reconcileAuthenticatedUser({
    authSubject: identity.id,
    email: verifiedEmail.emailAddress,
    displayName,
  });
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const user = await getOptionalAuthenticatedUser();
  if (!user) {
    throw authenticationRequired();
  }
  return user;
}
