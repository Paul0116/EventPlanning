import { SignIn } from "@clerk/nextjs";
import { Alert } from "@/components/ui/alert";
import { isClerkConfigured } from "@/lib/env";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main id="main-content" className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 py-12">
      {isClerkConfigured() ? (
        <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/events" />
      ) : (
        <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Gatherly</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Authentication setup required</h1>
          </div>
          <Alert>
            Clerk development keys are not configured. Add them to an ignored local environment file
            using the names in <code>.env.example</code>, then restart the app.
          </Alert>
        </div>
      )}
    </main>
  );
}
