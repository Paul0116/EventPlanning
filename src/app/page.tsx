import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { isClerkConfigured } from "@/lib/env";

export default function HomePage() {
  const authConfigured = isClerkConfigured();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-xl font-black tracking-tight text-teal-800">
            Gatherly
          </Link>
          {authConfigured ? (
            <AuthControls />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main id="main-content" className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <section className="self-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
            Calm planning for meaningful gatherings
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
            One private workspace for the whole event.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Bring dates, tasks, budgets, guests, and the event-day schedule together—without turning
            planning into another full-time job.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={authConfigured ? "/events" : "/sign-in"}
              className="inline-flex min-h-12 items-center rounded-xl bg-teal-700 px-6 font-semibold text-white hover:bg-teal-800"
            >
              Open your events
            </Link>
            <a
              href="#foundation"
              className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-800"
            >
              See what’s included
            </a>
          </div>
        </section>

        <section id="foundation" aria-label="Gatherly foundation" className="grid gap-4 rounded-3xl border border-teal-100 bg-white p-6 shadow-xl shadow-teal-950/5">
          {[
            ["Private by default", "Every event read and write is checked against ownership or membership."],
            ["Exact planning", "Time zones and two-decimal currencies stay explicit from the beginning."],
            ["Built to collaborate", "The foundation reserves editor and viewer roles without weakening owner control."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl bg-slate-50 p-5">
              <h2 className="font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
