import { clerkSetup } from "@clerk/testing/playwright";

export default async function globalSetup() {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    await clerkSetup();
  }
}
