import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getOptionalAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EventsLayout({ children }: { children: ReactNode }) {
  const user = await getOptionalAuthenticatedUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50/70">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/events" className="shrink-0 text-xl font-black tracking-tight text-teal-800">
              Gatherly
            </Link>
            <nav aria-label="Workspace" className="hidden sm:block">
              <Link href="/events" className="text-sm font-semibold text-slate-700 hover:text-teal-800">
                All events
              </Link>
            </nav>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden max-w-56 truncate text-sm text-slate-600 md:inline">
              {user.displayName}
            </span>
            <UserButton />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
