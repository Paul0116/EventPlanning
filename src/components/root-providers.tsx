import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { isClerkConfigured } from "@/lib/env";

export function RootProviders({ children }: { children: ReactNode }) {
  if (!isClerkConfigured()) {
    return children;
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
