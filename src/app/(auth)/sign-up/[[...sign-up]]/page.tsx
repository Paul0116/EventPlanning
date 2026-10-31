import { SignUp } from "@clerk/nextjs";
import { Alert } from "@/components/ui/alert";
import { isClerkConfigured } from "@/lib/env";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <main id="main-content" className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 py-12">
      {isClerkConfigured() ? (
        <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/events" />
      ) : (
        <Alert>Clerk development keys are required before account creation can be tested.</Alert>
      )}
    </main>
  );
}
