import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Not found</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">This resource is unavailable</h1>
        <p className="mt-4 leading-7 text-slate-600">It may not exist, or your account may not have access.</p>
        <Link href="/events" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 font-semibold text-white">
          Return to events
        </Link>
      </div>
    </main>
  );
}
